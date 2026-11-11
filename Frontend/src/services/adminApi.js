import api, { getAuthToken } from './api';

// Attach the Bearer token explicitly to admin-only requests. This is a
// defensive layer on top of the global axios request interceptor — it
// guarantees sensitive endpoints (e.g. /users) always carry the access
// token read from the auth context / localStorage.
const withAuth = (config = {}) => {
  const token = getAuthToken();
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Helper to extract data from various response formats
const extractData = (res) => {
  if (res.data?.data) return res.data.data;
  if (res.data?.users) return res.data.users;
  if (Array.isArray(res.data)) return res.data;
  if (res.data?.message && res.data?.user) return res.data;
  return res.data;
};

// ========== PROJECTS ==========
export const getAllProjects = () => api.get('/projects').then(extractData);
export const getProjectById = (id) => api.get(`/projects/${id}`).then(extractData);
export const createProject = (data) => api.post('/projects', data).then(extractData);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then(extractData);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);

// ========== EXPERIENCES ==========
export const getAllExperiences = () => api.get('/experiences').then(extractData);
export const getExperienceById = (id) => api.get(`/experiences/${id}`).then(extractData);
export const createExperience = (data) => api.post('/experiences', data).then(extractData);
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data).then(extractData);
export const deleteExperience = (id) => api.delete(`/experiences/${id}`).then((r) => r.data);

// ========== EDUCATION ==========
export const getAllEducation = () => api.get('/education').then(extractData);
export const getEducationById = (id) => api.get(`/education/${id}`).then(extractData);
export const createEducation = (data) => api.post('/education', data).then(extractData);
export const updateEducation = (id, data) => api.put(`/education/${id}`, data).then(extractData);
export const deleteEducation = (id) => api.delete(`/education/${id}`).then((r) => r.data);

// ========== PARTNERS ==========
export const getAllPartners = () => api.get('/partners').then(extractData);
export const getPartnerById = (id) => api.get(`/partners/${id}`).then(extractData);
export const createPartner = (data) => api.post('/partners', data).then(extractData);
export const updatePartner = (id, data) => api.put(`/partners/${id}`, data).then(extractData);
export const deletePartner = (id) => api.delete(`/partners/${id}`).then((r) => r.data);

// ========== SKILLS ==========
export const getAllSkills = () => api.get('/skills').then(extractData);
export const getSkillById = (id) => api.get(`/skills/${id}`).then(extractData);
export const createSkill = (data) => api.post('/skills', data).then(extractData);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data).then(extractData);
export const deleteSkill = (id) => api.delete(`/skills/${id}`).then((r) => r.data);

// ========== SOFTWARE APPLICATIONS ==========
export const getAllSoftwareApps = () => api.get('/software-applications').then(extractData);
export const getSoftwareAppById = (id) => api.get(`/software-applications/${id}`).then(extractData);
export const createSoftwareApp = (data) => api.post('/software-applications', data).then(extractData);
export const updateSoftwareApp = (id, data) => api.put(`/software-applications/${id}`, data).then(extractData);
export const deleteSoftwareApp = (id) => api.delete(`/software-applications/${id}`).then((r) => r.data);

// ========== MESSAGES ==========
export const getAllMessages = () => api.get('/messages').then(extractData);
export const getMessageById = (id) => api.get(`/messages/${id}`).then(extractData);
export const markMessageRead = (id) => api.patch(`/messages/${id}/read`).then((r) => r.data);
export const deleteMessage = (id) => api.delete(`/messages/${id}`).then((r) => r.data);

// ========== SOCIALS ==========
export const getAllSocials = () => api.get('/socials').then(extractData);
export const getSocialById = (id) => api.get(`/socials/${id}`).then(extractData);
export const createSocial = (data) => api.post('/socials', data).then(extractData);
export const updateSocial = (id, data) => api.put(`/socials/${id}`, data).then(extractData);
export const deleteSocial = (id) => api.delete(`/socials/${id}`).then((r) => r.data);

// ========== ACHIEVEMENTS (ADMIN) ==========
export const getAllAchievements = () => api.get('/achievements').then(extractData);
export const getAchievementById = (id) => api.get(`/achievements/${id}`).then(extractData);
export const createAchievement = (data) => api.post('/achievements', data).then(extractData);
export const updateAchievement = (id, data) => api.put(`/achievements/${id}`, data).then(extractData);
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`).then((r) => r.data);

// ========== USERS (ADMIN) ==========
// Bearer token is attached explicitly (Authorization: Bearer <token>) so the
// /users endpoints never fire without authentication.
export const getAllUsers = (config) => api.get('/users', withAuth(config)).then(extractData);
export const getUserById = (id, config) => api.get(`/users/${id}`, withAuth(config)).then(extractData);
export const createUser = (data, config) => api.post('/users', data, withAuth(config)).then(extractData);
export const updateUser = (id, data, config) => api.put(`/users/${id}`, data, withAuth(config)).then(extractData);
export const deleteUser = (id, config) => api.delete(`/users/${id}`, withAuth(config)).then((r) => r.data);

export const userManagementApi = {
  getAll: getAllUsers,
  getById: getUserById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
};
