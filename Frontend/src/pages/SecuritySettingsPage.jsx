import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Smartphone, Key, Loader2, Copy, Check, ArrowLeft } from 'lucide-react';

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [step, setStep] = useState('idle'); // idle | secret | enabled
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/2fa/generate');
      setSecret(res.data.secret);
      setQrCodeUrl(res.data.qr_code_url);
      setStep('secret');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate 2FA secret');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/2fa/enable', { otp });
      setStep('enabled');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <div className="bg-[#12122a] border border-purple-900/30 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security Settings</h2>
              <p className="text-gray-500 text-sm">Two-Factor Authentication</p>
            </div>
          </div>

          <div className="bg-[#1a1a3a] border border-purple-900/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-yellow-400" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Authenticator App</p>
                <p className="text-gray-500 text-xs">Google Authenticator, Authy, etc.</p>
              </div>
              {step === 'idle' && (
                <button onClick={handleGenerate} disabled={loading}
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-300 transition disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Enable 2FA'}
                </button>
              )}
              {step === 'enabled' && (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">Active</span>
              )}
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

          {step === 'secret' && (
            <div className="space-y-4">
              <div className="bg-[#1a1a3a] border border-purple-900/30 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-3">Scan this QR code with your authenticator app:</p>
                {qrCodeUrl && (
                  <div className="flex justify-center mb-3">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 rounded-lg" />
                  </div>
                )}
                <p className="text-gray-400 text-sm mb-2">Or enter this secret key manually:</p>
                <div className="flex items-center gap-2 bg-[#0a0a1a] border border-purple-900/30 rounded-lg px-4 py-3">
                  <code className="text-yellow-400 text-sm flex-1 font-mono break-all">{secret}</code>
                  <button onClick={handleCopy} className="text-gray-500 hover:text-yellow-400 transition flex-shrink-0">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleEnable} className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Enter the 6-digit code from your app:</label>
                  <input type="text" inputMode="numeric" maxLength={6} value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000"
                    className="w-full bg-[#1a1a3a] text-white text-center text-2xl tracking-[0.5em] border border-purple-900/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none transition" />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? 'Verifying...' : 'Enable 2FA'}
                </button>
              </form>
            </div>
          )}

          {step === 'enabled' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={32} className="text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">2FA Enabled Successfully!</h3>
              <p className="text-gray-500 text-sm">Your account is now protected with two-factor authentication.</p>
            </div>
          )}

          {user && (
            <div className="mt-6 pt-4 border-t border-purple-900/30">
              <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm transition">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;