import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../services/api';
import { X, Save, AlertTriangle, User, Plus, Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoProfile from '../assets/img/logoProfile.jpg';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { user, profileData, updateProfile, deleteProfile, clearAuth } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeLang, setActiveLang] = useState('en');
  const [formData, setFormData] = useState({
    name: '', // Name remains a simple string
    email: '',
    title: { en: '', kh: '' },
    headline: { en: '', kh: '' },
    description: { en: '', kh: '' },
    bio: { en: '', kh: '' },
    avatars: [],
    avatarPreviews: [],
    contact: { email: '', telegram: '', telegramUsername: '' },
    socials: [],
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedJson, setExpandedJson] = useState(false);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const profile = user || profileData;

  useEffect(() => {
    if (profile) {
      const defaultContact = { email: '', telegram: '', telegramUsername: '' };
      const profileContact = profile.contact
        ? (typeof profile.contact === 'object' ? profile.contact : JSON.parse(profile.contact))
        : defaultContact;

      const parseTranslatable = (field) => {
        if (typeof field === 'object' && field !== null) return field;
        if (field === null || field === undefined) return { en: '', kh: '' };
        try {
          return JSON.parse(field);
        } catch {
          return { en: field || '', kh: '' };
        }
      };

      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        title: parseTranslatable(profile.title),
        headline: parseTranslatable(profile.headline),
        description: parseTranslatable(profile.description),
        bio: parseTranslatable(profile.bio),
        avatars: [],
        avatarPreviews: [],
        contact: { ...defaultContact, ...profileContact },
        socials: Array.isArray(profile.socials) ? profile.socials : [],
      });
      setAvatarRemoved(false);
    }
  }, [profile, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    setFormData((prev) => ({ 
      ...prev, 
      avatars: [...(prev.avatars || []), ...imageFiles],
      avatarPreviews: [...(prev.avatarPreviews || []), ...imageFiles.map(file => URL.createObjectURL(file))]
    }));
  };

  const handleRemoveAvatar = (index) => {
    setFormData((prev) => ({
      ...prev,
      avatars: prev.avatars.filter((_, i) => i !== index),
      avatarPreviews: prev.avatarPreviews.filter((_, i) => i !== index)
    }));
  };

  const getCurrentAvatarSrc = () => {
    if (formData.avatarPreview) return formData.avatarPreview;
    if (avatarRemoved) return null;
    return profile?.avatar || profile?.avatars?.[0] || logoProfile;
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSocialChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.socials];
      if (!updated[index]) {
        updated[index] = { icon: '', href: '', label: '' };
      }
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, socials: updated };
    });
  };

  const addSocial = () => {
    setFormData((prev) => ({
      ...prev,
      socials: [...prev.socials, { icon: '', href: '', label: '' }],
    }));
  };

  const removeSocial = (index) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Handle file upload first if files are selected
      if (formData.avatars && formData.avatars.length > 0) {
        const fd = new FormData();
        formData.avatars.forEach((file) => fd.append('avatars[]', file));
        await api.post('/auth/avatar/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 2. Handle profile field updates
      const changedFields = {};

      // Compare simple fields
      ['name', 'email'].forEach((key) => {
        if (formData[key] !== (profile[key] || '')) {
          changedFields[key] = formData[key];
        }
      });

      // Compare translatable JSON fields
      ['title', 'headline', 'description', 'bio'].forEach((key) => {
        const profileField = profile[key]
          ? (typeof profile[key] === 'object' ? profile[key] : JSON.parse(profile[key]))
          : { en: '', kh: '' };
        
        if (JSON.stringify(formData[key]) !== JSON.stringify(profileField)) {
          changedFields[key] = formData[key];
        }
      });

      // Compare contact JSON
      const profileContact = profile.contact
        ? (typeof profile.contact === 'object' ? profile.contact : JSON.parse(profile.contact))
        : { email: '', telegram: '', telegramUsername: '' };
      
      if (JSON.stringify(formData.contact) !== JSON.stringify(profileContact)) {
        changedFields.contact = formData.contact;
      }

      // Compare socials JSON
      const profileSocials = Array.isArray(profile.socials) ? profile.socials : [];
      if (JSON.stringify(formData.socials) !== JSON.stringify(profileSocials)) {
        changedFields.socials = formData.socials;
      }

      if (Object.keys(changedFields).length > 0) {
        // Use POST with _method: 'PUT' for multipart compatibility if needed
        // Here we try direct PUT first, as standard Laravel supports it
        await updateProfile(changedFields);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message || error);
      
      const errorMessage = error.response?.data?.message || 
                           (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) || 
                           'Failed to update profile.';
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProfile();
      clearAuth();
      navigate('/login');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete account.' });
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  const currentAvatar = getCurrentAvatarSrc();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a0a2e] border border-purple-500/30 rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-800/60 flex items-center justify-center">
              <User size={20} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <p className="text-xs text-gray-400">Update your personal information</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
            <X size={24} />
          </button>
        </div>

        {/* Profile Picture Upload Section */}
        <div className="p-6 pb-0">
          <div className="flex flex-col items-center gap-4">
            {/* Large Circular Avatar Preview */}
            <div className="relative group">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-purple-500/30 flex items-center justify-center bg-purple-900/40">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-purple-400/60" />
                )}
              </div>
              {/* Hover overlay with camera icon */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
              >
                <Camera size={28} className="text-white" />
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-all border-none cursor-pointer"
              >
                <Camera size={14} />
                Upload Photos
              </button>
            </div>

            {/* Preview Grid */}
            {formData.avatarPreviews?.length > 0 && (
              <div className="grid grid-cols-4 gap-2 w-full mt-4">
                {formData.avatarPreviews.map((preview, index) => (
                  <div key={index} className="relative w-full aspect-square">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleRemoveAvatar(index)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 border-none cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === 'success' ? 'bg-green-900/40 text-green-300 border border-green-500/30' :
            message.type === 'error' ? 'bg-red-900/40 text-red-300 border border-red-500/30' :
            'bg-blue-900/40 text-blue-300 border border-blue-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            {/* Language Switcher */}
            <div className="flex p-1 bg-purple-900/30 rounded-lg mb-4">
              {['en', 'kh'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`flex-1 text-sm py-1.5 rounded-md transition ${activeLang === lang ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
            </div>
            
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
            </div>

            {/* Multilingual Fields */}
            {['title', 'headline', 'description', 'bio'].map((field) => (
              <div key={field} className={field === 'description' || field === 'bio' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{field} ({activeLang.toUpperCase()})</label>
                {field === 'description' || field === 'bio' ? (
                  <textarea
                    rows="3"
                    value={formData[field]?.[activeLang] || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      [field]: { ...(typeof prev[field] === 'object' ? prev[field] : { en: '', kh: '' }), [activeLang]: e.target.value } 
                    }))}
                    className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[field]?.[activeLang] || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      [field]: { ...(typeof prev[field] === 'object' ? prev[field] : { en: '', kh: '' }), [activeLang]: e.target.value } 
                    }))}
                    className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                )}
              </div>
            ))}
          </div>

          {/* JSON Fields Section */}
          <div className="border-t border-purple-500/20 pt-4">
            <button
              type="button"
              onClick={() => setExpandedJson(!expandedJson)}
              className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition bg-transparent border-none cursor-pointer mb-3"
            >
              {expandedJson ? '− Hide' : '+ Show'} JSON Fields (Contact & Socials)
            </button>

            {expandedJson && (
              <div className="space-y-4">
                {/* Contact JSON */}
                <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-600/20">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Contact</label>
                  <div className="space-y-2">
                    <input type="email" placeholder="Contact Email" value={formData.contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                    <input type="text" placeholder="Telegram URL" value={formData.contact.telegram}
                      onChange={(e) => handleContactChange('telegram', e.target.value)}
                      className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                    <input type="text" placeholder="Telegram Username" value={formData.contact.telegramUsername}
                      onChange={(e) => handleContactChange('telegramUsername', e.target.value)}
                      className="w-full bg-purple-900/30 border border-purple-600/30 rounded-xl p-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                  </div>
                </div>

                {/* Socials JSON */}
                <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-600/20">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Socials</label>
                    <button type="button" onClick={addSocial}
                      className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition bg-transparent border-none cursor-pointer">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {formData.socials.length === 0 && (
                    <p className="text-xs text-gray-500">No social links added yet.</p>
                  )}
                  {formData.socials.map((social, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2 p-2 bg-purple-900/20 rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input type="text" placeholder="Icon" value={social.icon}
                          onChange={(e) => handleSocialChange(index, 'icon', e.target.value)}
                          className="w-full bg-purple-900/30 border border-purple-600/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                        <input type="text" placeholder="URL" value={social.href}
                          onChange={(e) => handleSocialChange(index, 'href', e.target.value)}
                          className="w-full bg-purple-900/30 border border-purple-600/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                        <input type="text" placeholder="Label" value={social.label}
                          onChange={(e) => handleSocialChange(index, 'label', e.target.value)}
                          className="w-full bg-purple-900/30 border border-purple-600/30 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" />
                      </div>
                      <button type="button" onClick={() => removeSocial(index)}
                        className="text-red-400 hover:text-red-300 transition bg-transparent border-none cursor-pointer p-1 flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
            {!showDeleteConfirm ? (
              <button type="button" onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 hover:text-red-300 text-xs font-medium transition bg-transparent border-none cursor-pointer">
                Delete Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  Are you sure?
                </span>
                <button type="button" onClick={handleDelete} disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50 border-none cursor-pointer">
                  {deleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button type="button" onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-white text-xs transition bg-transparent border-none cursor-pointer">
                  Cancel
                </button>
              </div>
            )}
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition-all duration-300 text-sm disabled:opacity-50 border-none cursor-pointer">
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;