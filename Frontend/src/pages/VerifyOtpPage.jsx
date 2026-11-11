import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail } from 'lucide-react';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the full 6-digit OTP code.'); return; }
    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#12122a] border border-gray-200 dark:border-purple-900/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Enter the 6-digit code sent to <strong className="text-gray-700 dark:text-gray-300">{email}</strong></p>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => (inputRefs.current[i] = el)} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 bg-gray-50 dark:bg-[#1a1a3a] text-gray-900 dark:text-white text-center text-2xl font-bold border border-gray-300 dark:border-purple-900/30 rounded-lg focus:border-yellow-400 focus:outline-none transition" />
            ))}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
          <Link to="/register" className="text-amber-600 dark:text-amber-400 hover:underline">Back to Register</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;