import React, { useState, useEffect } from 'react';
import { X, Mail, Loader2, Send } from 'lucide-react';

const ReplyModal = ({ isOpen, onClose, message, onSend }) => {
  const [subject, setSubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (message) {
      setSubject(`Re: ${message.subject || 'Inquiry'}`);
      setReplyMessage('');
      setError(null);
    }
  }, [message]);

  if (!isOpen || !message) return null;

  const recipientEmail = message.sender_email || message.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await onSend(message.id, {
        subject,
        reply_message: replyMessage,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail size={18} className="text-blue-500" /> Reply to Message
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">To:</label>
            <input
              type="email"
              disabled
              value={recipientEmail}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply message here..."
              className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">Cancel</button>
            <button type="submit" disabled={sending} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition">
              {sending && <Loader2 size={14} className="animate-spin" />}
              <Send size={14} /> Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;
