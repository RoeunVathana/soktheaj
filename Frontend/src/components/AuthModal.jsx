import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const navigate = useNavigate();
  const { login, register, verifyTwoFactor } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const overlayRef = useRef();

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  // Register form
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showRegPwd, setShowRegPwd] = useState(false);

  // 2FA challenge
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError('');
      setTwoFactorRequired(false);
      setOtp('');
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // --- Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.two_factor_required) {
        setTwoFactorRequired(true);
        setUserEmail(result.user_email);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // --- 2FA ---
  const handle2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyTwoFactor(userEmail, otp);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  // --- Register ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regForm.password !== regForm.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(regForm.name, regForm.email, regForm.password, regForm.password_confirmation);
      onClose();
      navigate('/verify-otp', { state: { email: regForm.email } });
    } catch (err) {
      console.error('Registration error:', err);
      const errors = err.response?.data?.errors;
      const errorMessage = errors
        ? Object.values(errors).flat()[0]
        : (err.response?.data?.message || err.message || 'Registration failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // 2FA screen
  if (twoFactorRequired) {
    return (
      <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl relative" style={{ margin: 0 }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"><X size={20} /></button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={32} className="text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Two-Factor Auth</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Enter code from your authenticator app for <strong className="text-gray-700 dark:text-gray-300">{userEmail}</strong></p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handle2FA}>
            <input type="text" inputMode="numeric" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000"
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white text-center text-2xl tracking-[0.5em] border border-gray-300 dark:border-purple-900/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none transition mb-4" />
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <button onClick={() => { setTwoFactorRequired(false); setOtp(''); setError(''); }}
            className="w-full text-gray-400 dark:text-gray-500 text-sm mt-3 hover:text-gray-600 dark:hover:text-gray-300 transition">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl relative" style={{ margin: 0 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"><X size={20} /></button>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-purple-900/30 mb-6">
          <button onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 pb-3 text-sm font-medium transition ${tab === 'login' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>Login</button>
          <button onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 pb-3 text-sm font-medium transition ${tab === 'register' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>Register</button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="Email address" required
                className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input type={showPwd ? 'text' : 'password'} value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="Password" required
                className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-10 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => { onClose(); navigate('/forgot-password'); }} className="text-amber-600 dark:text-amber-400 text-sm hover:underline bg-transparent border-none cursor-pointer">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} placeholder="Full Name" required
                className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="Email address" required
                className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input type={showRegPwd ? 'text' : 'password'} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="Password" required minLength={8}
                className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-10 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
              <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                {showRegPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input type="password" value={regForm.password_confirmation} onChange={(e) => setRegForm({ ...regForm, password_confirmation: e.target.value })} placeholder="Confirm Password" required minLength={8}
                className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={18} className="animate-spin" />}{loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;