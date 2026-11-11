import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { socialApi } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import { Eye, Edit2, Trash2, Globe, Link as LinkIcon } from 'lucide-react';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Platform', accessor: 'platform_name' },
  { header: 'URL', accessor: 'url' },
  { header: 'Visible', accessor: 'is_visible', type: 'boolean' },
];

const formFields = [
  { name: 'platform_name', label: 'Platform', type: 'text' },
  { name: 'url', label: 'URL', type: 'text' },
  { name: 'icon', label: 'Icon', type: 'text' },
  { name: 'is_visible', label: 'Visible', type: 'select', options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
];

// Safely resolve the social platform name regardless of how it is stored:
// as a plain string, a JSON string, or a { en, kh } localized object.
const resolveSocialName = (item) => {
  const raw = item?.platform_name ?? item?.platform ?? item?.name ?? item?.title ?? '';
  if (raw === null || raw === undefined || raw === '') return '';
  if (typeof raw === 'object') {
    return raw.en || raw.kh || Object.values(raw)[0] || '';
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed.en || parsed.kh || Object.values(parsed)[0] || '';
      }
    } catch (e) {
      // Not a JSON string — use as-is
    }
    return raw;
  }
  return '';
};

const renderMobileSocialCard = (item, { onView, onEdit, onDelete }) => {
  const platformName = resolveSocialName(item) || 'Untitled Social';
  const url = item?.url || item?.link || '';
  const thumbnailUrl = item?.icon ? getImageUrl(item?.icon) : null;
  const isVisible = item?.is_visible === true || item?.is_visible === 1 || item?.is_visible === '1';

  return (
    <div className="p-4 md:hidden">
      <div className="bg-white dark:bg-[#131b2e]/70 backdrop-blur-xl rounded-2xl border border-purple-900/40 dark:border-purple-900/40 shadow-lg shadow-purple-900/5 p-4 overflow-hidden">
        {/* Top: thumbnail/icon + platform name + ID */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-purple-500/10 border border-purple-900/40 text-purple-400 shrink-0">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={platformName}
                className="w-full h-full object-contain p-2"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <Globe size={22} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate break-words">{platformName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">#{item?.id}</p>
          </div>
        </div>

        {/* Clickable URL / link */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline text-xs break-all"
          >
            <LinkIcon size={14} className="shrink-0" />
            <span className="truncate">{url}</span>
          </a>
        )}

        {/* Visibility status */}
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
            isVisible
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-gray-500/10 text-gray-500 dark:text-gray-400'
          }`}>
            {isVisible ? 'Visible' : 'Hidden'}
          </span>
        </div>

        {/* Bottom action row */}
        <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700/50">
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition text-xs font-medium"
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

const AdminSocials = () => (
  <AdminLayout>
    <CrudTable
      title="Socials"
      description="Manage social media links"
      fetchAll={socialApi.getAll}
      getItemById={socialApi.getById}
      createItem={socialApi.create}
      updateItem={socialApi.update}
      deleteItem={socialApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{ platform_name: '', url: '', icon: '', is_visible: '1' }}
      mobileCard={renderMobileSocialCard}
    />
  </AdminLayout>
);
export default AdminSocials;