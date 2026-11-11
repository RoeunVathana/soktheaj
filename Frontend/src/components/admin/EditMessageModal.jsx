import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const EditMessageModal = ({ isOpen, onClose, message, updateItem }) => {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: '',
    is_read: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (message) {
      setFormData({
        sender_name: message.sender_name || '',
        sender_email: message.sender_email || '',
        subject: message.subject || '',
        message: message.message || '',
        is_read: message.is_read || false,
      });
    }
  }, [message]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateItem(message.id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update message');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Message</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={formData.sender_name}
              onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.sender_email}
              onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_read"
              checked={formData.is_read}
              onChange={(e) => setFormData({ ...formData, is_read: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_read" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Read</label>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMessageModal;
