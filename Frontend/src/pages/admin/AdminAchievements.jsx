import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { achievementApi } from '../../services/api';
import { getAchievementThumbnail, getImageUrl } from '../../utils/helpers';
import { Eye, Edit2, Trash2, Trophy } from 'lucide-react';

// Helper to safely extract translation values (supports JSON objects, parsed JSON strings, or raw strings)
const getVal = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'object') return field[lang] || field.en || Object.values(field)[0] || '';
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return parsed[lang] || parsed.en || Object.values(parsed)[0] || '';
    } catch (e) {
      return field; // Raw string fallback
    }
  }
  return '';
};

const columns = [
  { header: 'ID', accessor: 'id' },
  {
    header: 'Title (EN)',
    accessor: 'title',
    render: (val) => getVal(val, 'en') || '-'
  },
  {
    header: 'Thumbnail',
    accessor: 'thumbnail',
    render: (val, item) => {
      const thumbnailUrl = getAchievementThumbnail(item);
      if (!thumbnailUrl) {
        return <span className="text-slate-500 text-sm">No Image</span>;
      }
      return (
        <img
          src={thumbnailUrl}
          alt={getVal(item.title, 'en') || 'Achievement'}
          className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/100x100?text=No+Image";
          }}
        />
      );
    },
  },
  {
    header: 'Description (EN)',
    accessor: 'description',
    render: (val) => {
      const text = getVal(val, 'en');
      if (!text) return <span className="text-slate-500 text-sm">-</span>;
      return (
        <span className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 max-w-xs whitespace-normal">
          {text}
        </span>
      );
    },
  },
  {
    header: 'Company Logo',
    accessor: 'company_logo',
    render: (val) => {
      const imageUrl = getImageUrl(val);
      if (!imageUrl) {
        return <span className="text-slate-500 text-sm">No Image</span>;
      }
      return (
        <img
          src={imageUrl}
          alt="Company Logo"
          className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/100x100?text=No+Image";
          }}
        />
      );
    },
  },
  {
    header: 'School Logo',
    accessor: 'school_logo',
    render: (val) => {
      const imageUrl = getImageUrl(val);
      if (!imageUrl) {
        return <span className="text-slate-500 text-sm">No Image</span>;
      }
      return (
        <img
          src={imageUrl}
          alt="School Logo"
          className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/100x100?text=No+Image";
          }}
        />
      );
    },
  },
];

const formFields = [
  { name: 'title_en', label: 'Title (English)', type: 'text', placeholder: 'Enter title in English' },
  { name: 'title_kh', label: 'Title (Khmer)', type: 'text', placeholder: 'Enter title in Khmer' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea', placeholder: 'Enter description in English' },
  { name: 'description_kh', label: 'Description (Khmer)', type: 'textarea', placeholder: 'Enter description in Khmer' },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accept: 'image/*' },
  { name: 'company_logo', label: 'Company Logo', type: 'file', accept: 'image/*' },
  { name: 'school_logo', label: 'School Logo', type: 'file', accept: 'image/*' },
];

const transformPayload = (formData) => {
  const submitData = new FormData();

  submitData.append('title[en]', formData.title_en || '');
  submitData.append('title[kh]', formData.title_kh || formData.title_en || '');
  submitData.append('description[en]', formData.description_en || '');
  submitData.append('description[kh]', formData.description_kh || formData.description_en || '');

  const thumbnailFile =
    (formData.thumbnail instanceof File && formData.thumbnail) ||
    (formData.thumbnail_file instanceof File && formData.thumbnail_file);
  if (thumbnailFile) {
    submitData.append('thumbnail', thumbnailFile);
  }

  const companyLogoFile =
    (formData.company_logo instanceof File && formData.company_logo) ||
    (formData.company_logo_file instanceof File && formData.company_logo_file);
  if (companyLogoFile) {
    submitData.append('company_logo', companyLogoFile);
  }

  const schoolLogoFile =
    (formData.school_logo instanceof File && formData.school_logo) ||
    (formData.school_logo_file instanceof File && formData.school_logo_file);
  if (schoolLogoFile) {
    submitData.append('school_logo', schoolLogoFile);
  }

  return submitData;
};

const parseFormData = (item) => ({
  title_en: getVal(item.title, 'en'),
  title_kh: getVal(item.title, 'kh'),
  description_en: getVal(item.description, 'en'),
  description_kh: getVal(item.description, 'kh'),
  thumbnail: '',
  thumbnail_url: item.thumbnail || '',
  company_logo: '',
  company_logo_url: item.company_logo || '',
  school_logo: '',
  school_logo_url: item.school_logo || '',
});

// Parse a raw ISO date string (e.g. 2026-08-31T07:38:42...) into a
// human-readable "Aug 31, 2026" format. Returns '' for invalid/missing dates.
const formatAchievementDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Modern glassmorphic mobile card for Achievements.
const renderMobileAchievementCard = (item, { onView, onEdit, onDelete }) => {
  const thumbnailUrl = getAchievementThumbnail(item);
  const title = getVal(item.title, 'en') || item.title || 'Untitled Achievement';
  const description = getVal(item.description, 'en');
  const dateStr = formatAchievementDate(item.created_at);

  return (
    <div className="w-full max-w-full overflow-x-hidden p-4 md:hidden">
      <div className="w-full box-border bg-white dark:bg-[#131b2e]/70 backdrop-blur-xl rounded-2xl border border-purple-900/40 dark:border-purple-900/40 shadow-lg shadow-purple-900/5 p-4 overflow-hidden">
        {/* Top: thumbnail + title + date */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-purple-500/10 border border-purple-900/40 text-purple-400 shrink-0">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <Trophy size={24} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate break-words">{title}</p>
            {dateStr && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">{dateStr}</p>
            )}
          </div>
        </div>

        {/* Description (if any) */}
        {description && (
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-normal break-words">
            {description}
          </p>
        )}

        {/* Bottom row: dedicated action buttons */}
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

const AdminAchievements = () => (
  <AdminLayout>
    <CrudTable
      title="Achievements"
      description="Manage your achievements and certifications"
      fetchAll={achievementApi.getAll}
      getItemById={achievementApi.getById}
      createItem={achievementApi.create}
      updateItem={achievementApi.update}
      deleteItem={achievementApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{
        title_en: '',
        title_kh: '',
        description_en: '',
        description_kh: '',
        thumbnail: '',
        thumbnail_url: '',
        company_logo: '',
        company_logo_url: '',
        school_logo: '',
        school_logo_url: '',
      }}
      transformPayload={transformPayload}
      parseFormData={parseFormData}
      mobileCard={renderMobileAchievementCard}
    />
  </AdminLayout>
);

export default AdminAchievements;