import axios from 'axios';

/**
 * Enterprise-Grade Axios Instance
 *
 * Security Architecture:
 *  - Access Token: Stored in React memory (AuthContext), NEVER in localStorage.
 *  - Refresh Token: Stored in httpOnly cookie (inaccessible to JavaScript).
 *  - withCredentials: true — Required for sending/receiving httpOnly cookies.
 *
 * Interceptor Flow:
 *  1. Request Interceptor: Attaches Bearer token from React state (via getToken callback).
 *  2. Response Interceptor: On 401, silently refreshes the token and retries.
 *  3. Queue System: Pending requests during refresh are queued and retried after.
 *
 * Security Rationale:
 *  - No tokens are ever written to localStorage, sessionStorage, or cookies by JS.
 *  - The access token lives only in React state (AuthContext).
 *  - On page refresh, the access token is lost — AuthContext triggers silent refresh.
 *  - The refresh token is an httpOnly cookie — JS cannot read it, XSS-proof.
 *
 * Token Callback Pattern:
 *  - setupInterceptors() is called ONCE from AuthContext on mount.
 *  - It receives getToken/setToken/onSessionExpired callbacks that read/write
 *    React state via a useRef, avoiding stale closure issues and infinite loops.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // Required for httpOnly cookie-based refresh tokens
});

// ─────────────────────────────────────────────
//  Interceptor Setup (Called Once from AuthContext)
// ─────────────────────────────────────────────
// These are set by setupInterceptors() and used by the interceptors below.
// Using let + callbacks avoids module-level token state and stale closures.
let getToken = () => null;
let setToken = (token) => {};
let onSessionExpired = () => {};

/**
 * Initialize the Axios interceptors with React state callbacks.
 *
 * This MUST be called once from AuthContext's useEffect (empty deps).
 * The callbacks use useRef internally so they always have the latest
 * token value without causing the interceptors to be re-registered.
 *
 * @param {Function} getTokenFn  - Returns the current access token from React state
 * @param {Function} setTokenFn  - Updates the access token in React state
 * @param {Function} onExpiredFn - Called when refresh fails (clears auth state)
 */
export const setupInterceptors = (getTokenFn, setTokenFn, onExpiredFn) => {
  getToken = getTokenFn;
  setToken = setTokenFn;
  onSessionExpired = onExpiredFn;
};

// ─────────────────────────────────────────────
//  Shared Auth Token Helper
// ─────────────────────────────────────────────
// Resolves the current access token from (1) AuthContext state via the
// getToken callback, then (2) any legacy localStorage keys. Exported so
// service modules (e.g. adminApi) can explicitly attach the Bearer header
// to sensitive admin endpoints (users management, dashboard stats).
export const getAuthToken = () => {
  const stateToken = getToken();
  if (stateToken) return stateToken;
  return localStorage.getItem('token')
    || localStorage.getItem('TokenPortfolio')
    || localStorage.getItem('access_token')
    || null;
};

// ─────────────────────────────────────────────
//  Request Interceptor
// ─────────────────────────────────────────────
// Automatically attaches the Bearer token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach the current language from localStorage (set by LanguageContext)
    const currentLang = localStorage.getItem('app_language') || 'en';
    config.headers['Accept-Language'] = currentLang;

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
//  Response Interceptor (Auto-Refresh)
// ─────────────────────────────────────────────
// On 401 Unauthorized, silently attempts to refresh the access token
// using the httpOnly refresh cookie. If successful, retries the original request.
// If refresh fails, clears auth state and calls onSessionExpired so AuthContext
// can react (e.g., redirect to login) without using window.location.href.

let isRefreshing = false;
let failedQueue = [];

const createSessionExpiredError = () => {
  const sessionError = new Error('Session expired. Please log in again to continue.');
  sessionError.isSessionExpired = true;
  return sessionError;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      // Reject queued requests with a standardized session-expiry error so
      // UI components can suppress red error banners and prompt re-login.
      prom.reject(createSessionExpiredError());
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── Only handle 401 errors ──
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ── Prevent infinite retry loop ──
    // A second 401 on the retried request means the refreshed token is also
    // invalid → treat it as a clean session expiry instead of surfacing the
    // raw Laravel "Unauthenticated." message.
    if (originalRequest._retry) {
      return Promise.reject(createSessionExpiredError());
    }

    // ── Don't retry auth endpoints to avoid infinite loops ──
    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // ── If already refreshing, queue this request ──
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ── Silently attempt to refresh the access token ──
      // The refresh token is sent automatically via the httpOnly cookie.
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { access_token } = response.data;

      // Update the token in React state via the callback
      setToken(access_token);

      // Process the queued requests
      processQueue(null, access_token);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      // ── Refresh failed — clear auth state and prompt a clean re-login ──
      processQueue(refreshError, null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('TokenPortfolio');
      localStorage.removeItem('access_token');
      onSessionExpired();

      // Dispatch a global event so open UI components (e.g. CrudTable) can
      // suppress red "Unauthenticated." banners while ProtectedRoute
      // redirects to the login page.
      window.dispatchEvent(new CustomEvent('auth:session-expired'));

      // Reject with a standardized error so every failed 401 path is handled
      // uniformly (never the raw Laravel "Unauthenticated." message).
      return Promise.reject(createSessionExpiredError());
    } finally {
      isRefreshing = false;
    }
  }
);

// ─────────────────────────────────────────────
//  Helper to extract data from various response formats
// ─────────────────────────────────────────────
const extractData = (res) => {
  if (res.data?.data) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  return res.data;
};

// ─────────────────────────────────────────────
//  Generic CRUD Factory
// ─────────────────────────────────────────────
const createCrudService = (endpoint) => ({
  getAll: () => api.get(endpoint).then(extractData),
  getById: (id) => api.get(`${endpoint}/${id}`).then(extractData),
  create: (data) => api.post(endpoint, data).then(extractData),
  update: (id, data) => {
    // Use POST with _method=PUT for FormData (file uploads) since Laravel
    // doesn't handle file uploads well with PUT requests
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post(`${endpoint}/${id}`, data).then(extractData);
    }
    return api.put(`${endpoint}/${id}`, data).then(extractData);
  },
  delete: (id) => api.delete(`${endpoint}/${id}`).then((r) => r.data),
});

// ─────────────────────────────────────────────
//  Entity Services
// ─────────────────────────────────────────────
export const projectApi = createCrudService('/projects');
export const experienceApi = createCrudService('/experiences');
export const educationApi = createCrudService('/education');
export const partnerApi = createCrudService('/partners');
export const skillApi = createCrudService('/skills');
export const softwareAppApi = createCrudService('/software-applications');
export const messageApi = {
  getAll: () => api.get('/messages').then(extractData),
  getById: (id) => api.get(`/messages/${id}`).then(extractData),
  create: (data) => api.post('/messages', data).then(extractData),
  update: async (id, data) => {
    if (data.is_read !== undefined && Object.keys(data).length === 1 && data.is_read) {
      return api.patch(`/messages/${id}/read`).then(extractData);
    }
    try {
      const res = await api.put(`/messages/${id}`, data);
      return extractData(res);
    } catch (err) {
      if (data.is_read !== undefined) {
        await api.patch(`/messages/${id}/read`);
      }
      return api.get(`/messages/${id}`).then(extractData);
    }
  },
  markAsRead: (id) => api.patch(`/messages/${id}/read`).then((r) => r.data),
  reply: (id, data) => api.post(`/messages/${id}/reply`, data).then((r) => r.data),
  delete: (id) => api.delete(`/messages/${id}`).then((r) => r.data),
};
export const socialApi = createCrudService('/socials');
export const achievementApi = createCrudService('/achievements');
export const userManagementApi = createCrudService('/users');

// ─────────────────────────────────────────────
//  Dashboard & Analytics Services
// ─────────────────────────────────────────────
// Explicitly attaches the Bearer token (same pattern as the user-management
// fix) so admin analytics endpoints always carry authentication.
export const dashboardApi = {
  getMonthlyActivity: () => {
    const token = getAuthToken();
    return api.get('/admin/monthly-activity', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(extractData);
  },
};

// ─────────────────────────────────────────────
//  Public API Helpers
// ─────────────────────────────────────────────
export const fetchSocials = async () => {
  const res = await api.get('/socials/visible');
  return res.data?.data || res.data || [];
};

export const fetchSoftwareApplications = async () => {
  const res = await api.get('/software-applications');
  return res.data?.data || res.data || [];
};

export const getVisiblePartners = () => api.get('/partners/visible').then(extractData);
export const getFeaturedProjects = () => api.get('/projects/featured').then(extractData);
export const getProjectBySlug = (slug) => api.get(`/projects/slug/${slug}`).then(extractData);

export default api;