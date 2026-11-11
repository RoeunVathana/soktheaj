import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { messageApi } from '../../services/api';
import ReplyModal from '../../components/admin/ReplyModal';
import { Mail, Eye, Edit2, Trash2 } from 'lucide-react';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'sender_name' },
  { header: 'Email', accessor: 'sender_email' },
  { header: 'Subject', accessor: 'subject' },
  { header: 'Read', accessor: 'is_read', type: 'boolean' },
  { header: 'Date', accessor: 'created_at', type: 'date' },
];

const formFields = [
  { name: 'sender_name', label: 'Name', type: 'text' },
  { name: 'sender_email', label: 'Email', type: 'text' },
  { name: 'subject', label: 'Subject', type: 'text' },
  { name: 'message', label: 'Message', type: 'textarea' },
  { name: 'is_read', label: 'Mark as Read', type: 'select', options: [{ value: true, label: 'Yes' }, { value: false, label: 'No' }] },
];

const AdminMessages = () => {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSendReply = async (id, data) => {
    await messageApi.reply(id, data);
    setSuccessMsg('Email reply sent successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Parse a raw ISO date string into a human-readable format.
  const formatMessageDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Modern mobile card for Messages: sender Name + Email + Subject, with a
  // small ID + Read status badge and a bottom Reply / View / Edit / Delete row.
  const renderMobileMessageCard = (item, { onView, onEdit, onDelete }) => {
    const senderName = item?.sender_name || item?.name || 'Unknown Sender';
    const senderEmail = item?.sender_email || item?.email || '';
    const subject = item?.subject || '(No Subject)';
    const isRead = item?.is_read === true || item?.is_read === 1 || item?.is_read === '1';
    const dateStr = formatMessageDate(item?.created_at);
    const messagePreview = item?.message || '';

    return (
      <div className="p-4 md:hidden">
        <div className="bg-white dark:bg-[#131b2e]/70 backdrop-blur-xl rounded-2xl border border-purple-900/40 dark:border-purple-900/40 shadow-lg shadow-purple-900/5 p-4 overflow-hidden">
          {/* Top: sender avatar + name + ID/read badge */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-blue-500/10 border border-blue-900/30 text-blue-500 dark:text-blue-400 shrink-0 font-bold text-sm">
              {senderName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate break-words">{senderName}</p>
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                  #{item?.id}
                </span>
              </div>
              {senderEmail && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{senderEmail}</p>
              )}
            </div>
          </div>

          {/* Subject + read badge */}
          <div className="mt-3 flex items-start justify-between gap-2">
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium break-words">{subject}</p>
            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
              isRead
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
            }`}>
              {isRead ? 'Read' : 'Unread'}
            </span>
          </div>

          {/* Message preview + date */}
          {messagePreview && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-normal">{messagePreview}</p>
          )}
          {dateStr && (
            <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">{dateStr}</p>
          )}

          {/* Bottom action row: Reply / View / Edit / Delete */}
          <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700/50">
            <button
              onClick={() => { setSelectedMessage(item); setReplyModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition text-xs font-medium"
              title="Reply via Email"
              aria-label="Reply via Email"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={onView}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition text-xs font-medium"
              title="View Details"
              aria-label="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition text-xs font-medium"
              title="Edit"
              aria-label="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition text-xs font-medium"
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {successMsg && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-600 dark:text-green-400">
          {successMsg}
        </div>
      )}
      <CrudTable
        title="Messages"
        description="View and manage contact messages"
        fetchAll={messageApi.getAll}
        getItemById={messageApi.getById}
        createItem={null}
        updateItem={messageApi.update}
        deleteItem={messageApi.delete}
        columns={columns}
        formFields={formFields}
        formInitialValues={{ is_read: false }}
        transformPayload={(data) => ({
          ...data,
          is_read: data.is_read === true || data.is_read === 'true' || data.is_read === 1 || data.is_read === '1',
        })}
        renderRowActions={(item) => (
          <button
            onClick={() => {
              setSelectedMessage(item);
              setReplyModalOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            title="Reply via Email"
          >
            <Mail size={15} />
          </button>
        )}
        mobileCard={renderMobileMessageCard}
      />
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        message={selectedMessage}
        onSend={handleSendReply}
      />
    </AdminLayout>
  );
};
export default AdminMessages;

