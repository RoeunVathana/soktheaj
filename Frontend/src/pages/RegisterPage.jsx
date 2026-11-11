import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Info } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const fromLogin = location.state?.fromLogin;
  const [form, setForm] = useState({ name: '', email: location.state?.email || '', password: '', password_confirmation: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(fromLogin ? 'No account found with that email. Please register to continue.' : '');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/verify-otp', { state: { email: form.email } });
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Create Account</h2>
        {notice && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg mb-4 text-sm flex items-start gap-2">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" required
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Password" required minLength={8}
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-10 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} placeholder="Confirm Password" required minLength={8}
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-amber-600 dark:text-amber-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;