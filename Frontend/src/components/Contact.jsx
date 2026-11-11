import React, { useState } from 'react';
import { Send, ArrowUpRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useProfileData from '../hooks/useProfileData';
import api from '../services/api';
import profiles from '../data/static';
import { useLanguage, getLocalized } from '../context/LanguageContext';

const Contact = () => {
  const { accessToken } = useAuth();
  const { profile: profileData, loading: profileLoading } = useProfileData();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();
  const fallbackProfile = profiles[0];

  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Build the active profile: prefer API data, fall back to local file
  const profile = profileData
    ? {
        name: getLocalized(profileData.name || fallbackProfile.name, currentLang),
        email: profileData.email || fallbackProfile.contact.email,
        bio: getLocalized(profileData.bio || fallbackProfile.bio, currentLang),
        avatars: Array.isArray(profileData.avatars) && profileData.avatars.length > 0
          ? profileData.avatars
          : fallbackProfile.avatars,
        initials: getLocalized(profileData.name || fallbackProfile.name, currentLang)
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        contact: profileData.contact || fallbackProfile.contact,
      }
    : {
        ...fallbackProfile,
        name: getLocalized(fallbackProfile.name, currentLang),
        bio: getLocalized(fallbackProfile.bio, currentLang),
        email: fallbackProfile.contact.email,
      };

  const avatars = profile.avatars;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if user is authenticated
    if (!accessToken) {
      navigate('/login?redirect=/contact');
      return;
    }

    // Validate
    if (!formData.sender_name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!formData.sender_email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/messages', formData);
      setSuccess(response.data?.message || 'Your message has been sent successfully.');
      setFormData({
        sender_name: '',
        sender_email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 bg-gray-50 dark:bg-[#0a0a1a] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Part 1: Contact Form Card */}
        <div className="bg-white dark:bg-purple-900/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-md border border-purple-200 dark:border-purple-500/20 relative overflow-hidden mb-16">
          {/* Watermark Heading */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
            <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-purple-200/50 dark:text-purple-900/20 tracking-widest">
              CONTACT ME
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left - Form (7 cols) */}
            <div className="md:col-span-7">
              {/* Success Message */}
              {success && (
                <div className="mb-4 flex items-center gap-2 bg-green-900/40 border border-green-500/30 text-green-300 rounded-xl p-3 text-sm">
                  <CheckCircle size={16} />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-900/40 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      placeholder="Full Name *"
                      className="w-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600/30 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                  {/* Email */}
                  <input
                    type="email"
                    name="sender_email"
                    value={formData.sender_email}
                    onChange={handleChange}
                    placeholder="Email *"
                    className="w-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600/30 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                  {/* Phone */}
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone (optional)"
                    className="w-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600/30 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                  {/* Subject */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject *"
                      className="w-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600/30 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                  {/* Textarea */}
                  <div className="md:col-span-2">
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell Us About Project *"
                      className="w-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600/30 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 transition-all duration-300 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right - Profile Image (5 cols) */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative">
                {/* Abstract line graphics */}
                <div className="absolute -top-4 -right-4 w-32 h-32 border border-purple-500/20 rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-24 h-24 border border-purple-500/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-3xl" />
                
                {/* Person placeholder - Full bleed background image */}
                <div
                  className="relative w-72 h-96 sm:w-80 sm:h-[420px] md:w-72 md:h-[400px] lg:w-80 lg:h-[430px] rounded-2xl border border-purple-500/20 overflow-hidden flex items-end justify-center"
                  style={
                    avatars.length > 2
                      ? {
                          backgroundImage: `url('${avatars[2]}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {
                          background: 'linear-gradient(180deg, rgba(88,28,135,0.4), rgba(30,58,138,0.4))',
                        }
                  }
                >
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="relative z-10 text-center pb-5">
                    <p className="text-base text-gray-200 font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] mb-1">
                      {getLocalized(profile.name, currentLang)}
                    </p>
                    <p className="text-xs text-gray-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">Let's work together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: CTA Footer Banner */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-4">
            Let's Build the Future with Technology 🚀
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-2">
            Available for IT Training, Business Collaboration, Consulting, and Digital Solutions.
          </p>
          <p className="text-gray-600 dark:text-gray-500 text-sm max-w-2xl mx-auto mb-8">
            {profile.bio}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md shadow-orange-500/20 transition-all duration-300"
          >
            Let's Connect
            <ArrowUpRight size={20} />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Contact;