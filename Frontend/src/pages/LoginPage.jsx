import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, loading, login, verifyTwoFactor } = useAuth();

  // ── Auto-redirect if already authenticated (silent refresh restored session) ──
  useEffect(() => {
    if (!loading && (user || accessToken)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, accessToken, loading, navigate]);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 2FA challenge state
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(form.email, form.password);
      if (result.two_factor_required) {
        setTwoFactorRequired(true);
        setUserEmail(result.user_email);
      } else {
        navigate('/');
      }
    } catch (err) {
      // Account does not exist in the database → direct user to register
      if (err.response?.data?.account_not_found) {
        navigate('/register', { state: { email: form.email, fromLogin: true } });
        return;
      }
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await verifyTwoFactor(userEmail, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code');
    } finally {
      setSubmitting(false);
    }
  };

  if (twoFactorRequired) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={32} className="text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Enter the 6-digit code from your authenticator app for <strong className="text-gray-700 dark:text-gray-300">{userEmail}</strong></p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handle2FA}>
            <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000"
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white text-center text-2xl tracking-[0.5em] border border-gray-300 dark:border-purple-900/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none transition mb-4" />
            <button type="submit" disabled={submitting || otp.length !== 6}
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {submitting ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <button onClick={() => { setTwoFactorRequired(false); setOtp(''); setError(''); }}
            className="w-full text-gray-400 dark:text-gray-500 text-sm mt-3 hover:text-gray-600 dark:hover:text-gray-300 transition">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Welcome Back</h2>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" required
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Password" required
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-10 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-amber-600 dark:text-amber-400 text-sm hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
          Don't have an account? <Link to="/register" className="text-amber-600 dark:text-amber-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;