import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/reset-password', {
        token,
        email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setMessage(res.data.message || 'Password has been reset successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl">
        <Link to="/login" className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm mb-6 transition">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter your new password below.</p>
        {message && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="New Password" required minLength={8}
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-10 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} placeholder="Confirm New Password" required minLength={8}
              className="w-full bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:border-yellow-400 focus:outline-none transition placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;