import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertTriangle, Loader2, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/helpers';
import SoftwareApps from '../SoftwareApps';

const CrudTable = ({
  title,
  description,
  fetchAll,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  columns,
  formFields,
  formInitialValues,
  transformPayload,
  parseFormData,
  renderRowActions,
  mobileCard,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // 401 / session-expiry detection: auth errors are handled globally by the
  // axios interceptor (token refresh, then a clean redirect to /login), so we
  // suppress the red error banner and render a subtle notice instead.
  const isAuthError = (err) =>
    err?.isSessionExpired === true ||
    err?.response?.status === 401 ||
    (err?.message && err.message.toLowerCase().includes('unauthenticated'));

  useEffect(() => {
    const handleSessionExpired = () => setSessionExpired(true);
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // ── Localization / field-resolution helpers (View Details Modal) ──
  // Many admin models store localized values as { en, kh } objects (or as JSON
  // strings from older payloads). These helpers normalize strings ↔ objects and
  // also accept common alternative keys (platform_name for Socials, etc.) so no
  // valid field ever renders as a stray "-".
  const resolveLocalized = (value, lang) => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'object') {
      const v = value[lang] ?? value.en ?? value.kh ?? Object.values(value)[0];
      return v ?? '';
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object') {
          const v = parsed[lang] ?? parsed.en ?? parsed.kh ?? Object.values(parsed)[0];
          return v ?? '';
        }
      } catch (e) {
        // Not JSON → raw string
      }
      return lang === 'en' || lang === 'kh' ? value : value;
    }
    return '';
  };

  const resolveName = (item) => {
    const raw = item?.title ?? item?.name ?? item?.platform_name ?? item?.institution ?? item?.school_name ?? item?.degree ?? '';
    if (typeof raw === 'object') {
      return raw.en ?? raw.kh ?? Object.values(raw)[0] ?? '';
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed.en ?? parsed.kh ?? Object.values(parsed)[0] ?? '';
        }
      } catch (e) {
        return raw;
      }
      return raw;
    }
    return '';
  };

  const isImageUrl = (value) => /\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(value || '');

  const resolveUrl = (item) => item?.url || item?.website_url || item?.link || '';

  // Resolve the preview image URL from any of the image keys used across admin
  // models (Partners.logo, Education.school_logo, Socials.icon, etc.).
  // getImageUrl() handles prefixing relative Laravel storage paths with the
  // backend base URL (e.g. "logos/x.png" -> "http://localhost:8000/storage/logos/x.png").
  const resolveImageUrl = (item) => {
    if (!item) return null;
    const candidates = [
      item.institution_logo,
      item.logo,
      item.image,
      item.thumbnail,
      item.company_logo,
      item.school_logo,
      item.icon,
    ];
    for (const path of candidates) {
      if (path && typeof path === 'string' && path.trim()) {
        return getImageUrl(path.trim());
      }
    }
    return null;
  };

  // Fallback initial letter for the preview box when no image exists.
  const resolveInitial = (item) => {
    const name = resolveName(item) || '';
    return name.charAt(0).toUpperCase() || '?';
  };

  // Fallback content for the preview box when no image exists.
  // Education shows a graduation cap; everything else uses the initial letter.
  const resolveFallback = (item) => {
    if (title === 'Education') return '🎓';
    return resolveInitial(item);
  };

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (isAuthError(err)) {
        setSessionExpired(true);
        return;
      }
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ ...formInitialValues });
    setShowModal(true);
  };

  const openEditModal = async (item) => {
    setEditingItem(item);
    let itemToEdit = item;
    if (parseFormData) {
      setFormData(parseFormData(item));
    } else {
      const data = {};
      formFields.forEach((f) => { data[f.name] = item[f.name] ?? ''; });
      setFormData(data);
    }
    setShowModal(true);

    if (getItemById) {
      try {
        const freshData = await getItemById(item.id);
        if (freshData) {
          itemToEdit = freshData;
          setEditingItem(freshData);
          if (parseFormData) {
            setFormData(parseFormData(freshData));
          } else {
            const data = {};
            formFields.forEach((f) => { data[f.name] = freshData[f.name] ?? ''; });
            setFormData(data);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch fresh item details for editing:', err);
      }
    }
  };

  const openViewModal = async (item) => {
    setViewingItem(item);
    setShowViewModal(true);
    if (getItemById) {
      setViewLoading(true);
      try {
        const freshData = await getItemById(item.id);
        if (freshData) {
          setViewingItem(freshData);
        }
      } catch (err) {
        console.warn('Failed to fetch fresh item details:', err);
      } finally {
        setViewLoading(false);
      }
    }
  };

  const handleFileChange = (fieldName, file) => {
    setFormData((prev) => ({ ...prev, [fieldName]: file, [fieldName + '_file']: file }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = transformPayload ? transformPayload(formData) : formData;
      if (editingItem) {
        await updateItem(editingItem.id, payload);
        showSuccess('Updated successfully!');
      } else {
        await createItem(payload);
        showSuccess('Created successfully!');
      }
      setShowModal(false);
      loadItems();
    } catch (err) {
      if (isAuthError(err)) {
        setSessionExpired(true);
        return;
      }
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      showSuccess('Deleted successfully!');
      setShowDeleteConfirm(null);
      loadItems();
    } catch (err) {
      if (isAuthError(err)) {
        setSessionExpired(true);
        return;
      }
      setError(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const filtered = items.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return columns.some((col) => {
      // Backend returns localized values directly (based on Accept-Language header)
      const val = item[col.accessor];
      return val && String(val).toLowerCase().includes(term);
    });
  });

  const renderCell = (item, col) => {
    // Backend returns localized values directly (based on Accept-Language header)
    const val = item[col.accessor];
    if (col.render) return col.render(val, item);
    if (col.type === 'boolean') return val ? <span className="text-green-600 dark:text-green-400">Yes</span> : <span className="text-gray-400 dark:text-gray-500">No</span>;
    if (col.type === 'date') return val ? new Date(val).toLocaleDateString() : '-';
    // Render logo/image as thumbnail in table
    if (col.type === 'image') {
      const imageUrl = getImageUrl(val);
      if (!imageUrl) {
        return <span className="text-slate-500 text-sm">No Image</span>;
      }
      return (
        <img
          src={imageUrl}
          alt={item.title || item.name || ''}
          className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/100x100?text=No+Image";
          }}
        />
      );
    }
    return val ?? '-';
  };

  /**
   * Renders an image preview for URL fields that have preview: true.
   * Shows the image if URL is valid, otherwise shows a placeholder.
   */
  const renderImagePreview = (field) => {
    const url = formData[field.name];
    if (!url || !url.trim()) {
      return (
        <div className="mt-2 flex items-center justify-center w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600">
          <span className="text-xs text-gray-400">No image</span>
        </div>
      );
    }
    return (
      <div className="mt-2">
        <img
          src={url.trim()}
          alt="Preview"
          className="w-20 h-20 object-contain rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-1"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden mt-2 items-center justify-center w-20 h-20 rounded-lg bg-red-50 dark:bg-red-900/20 border border-dashed border-red-300 dark:border-red-700">
          <span className="text-xs text-red-400">Invalid URL</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{description}</p>}
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Alerts */}
      {sessionExpired && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-500">
          <AlertTriangle size={16} /> Your session has expired. Redirecting to login…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          <AlertTriangle size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
          {success}
          <button onClick={() => setSuccess(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-[#0b0f19] border border-gray-200 dark:border-gray-800/60 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/40 transition" />
      </div>

      {/* Table */}
      <div className="w-full max-w-full overflow-x-hidden bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-sm">No items found.</div>
        ) : (
          <>
            {/* ── Mobile Card List (small screens only) ── */}
            {/* Provides thumbnail, title, status and immediately-tappable
                View / Edit / Delete actions so nothing is cut off on phones. */}
            <div className="w-full max-w-full overflow-x-hidden md:hidden divide-y divide-gray-200 dark:divide-gray-800/60">
              {filtered.map((item) => {
                // If the page supplies a custom mobileCard renderer, use it
                // (e.g. Admin Achievements provides a glassmorphic card design).
                if (mobileCard) {
                  return mobileCard(item, {
                    onView: () => openViewModal(item),
                    onEdit: () => openEditModal(item),
                    onDelete: () => setShowDeleteConfirm(item.id),
                  });
                }
                const imageCol = columns.find((col) => col.type === 'image');
                const titleCol = columns.find((col) => col.accessor === 'title' || col.accessor === 'name')
                  || columns.find((col) => col.type !== 'image' && col.type !== 'boolean');
                const statusCols = columns.filter((col) => col.type === 'boolean');
                const titleValue = titleCol
                  ? renderCell(item, titleCol)
                  : item.title || item.name || `#${item.id}`;

                return (
                  <div key={item.id} className="p-4 flex items-start gap-3">
                    {imageCol && (
                      <div className="flex-shrink-0">
                        {renderCell(item, imageCol)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{titleValue}</p>
                      {item.slug && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.slug}</p>
                      )}
                      {statusCols.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                          {statusCols.map((col) => (
                            <span key={col.accessor} className="inline-flex items-center gap-1 text-xs">
                              <span className="text-gray-400">{col.header}:</span>
                              {renderCell(item, col)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {item.email || item.created_at || ''}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                      {renderRowActions && renderRowActions(item)}
                      <button
                        onClick={() => openViewModal(item)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop / Tablet Table (scrollable on md+) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {columns.map((col) => (
                    <th key={col.accessor} className="text-left py-3 px-3 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">{col.header}</th>
                  ))}
                  <th className="text-right py-3 px-3 text-gray-500 dark:text-gray-400 font-medium w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition">
                    {columns.map((col) => (
                      <td key={col.accessor} className="py-3 px-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{renderCell(item, col)}</td>
                    ))}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {renderRowActions && renderRowActions(item)}
                        <button onClick={() => openViewModal(item)} className="p-1.5 rounded-lg hover:bg-green-500/10 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition" title="View Details">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openEditModal(item)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowViewModal(false)}>
          <div className="bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye size={18} className="text-blue-500" /> Details
              </h3>
              <button onClick={() => setShowViewModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {viewLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#070a12] border border-gray-200 dark:border-gray-800">
                    <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                      {(() => {
                        const imgUrl = resolveImageUrl(viewingItem);
                        if (imgUrl) {
                          return (
                            <img
                              src={imgUrl}
                              alt={resolveName(viewingItem) || 'Preview'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.replaceWith(Object.assign(document.createElement('span'), {
                                  className: 'flex items-center justify-center w-full h-full text-lg font-bold text-blue-600 dark:text-blue-400',
                                  textContent: resolveFallback(viewingItem),
                                }));
                              }}
                            />
                          );
                        }
                        return (
                          <span className="flex items-center justify-center w-full h-full text-lg font-bold text-blue-600 dark:text-blue-400">
                            {resolveFallback(viewingItem)}
                          </span>
                        );
                      })()}
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">ID: #{viewingItem.id}</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
<div className="text-base font-semibold text-gray-900 dark:text-white">
                        {resolveName(viewingItem) || '-'}
                      </div>
                        {resolveName(viewingItem) || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60">
                      <span className="block text-xs text-gray-400 font-medium mb-1">
                        {title === 'Achievements' ? 'Title (EN / KH)' : 'Name (EN / KH)'}
                      </span>
                      <span className="text-gray-900 dark:text-gray-200 font-medium break-words">
                        {(() => {
                          const raw = viewingItem?.title ?? viewingItem?.name ?? viewingItem?.platform_name ?? viewingItem?.institution ?? viewingItem?.school_name ?? viewingItem?.degree ?? '';
                          const isObject = raw && (typeof raw === 'object' || (typeof raw === 'string' && raw.trim().startsWith('{')));
                          if (isObject) {
                            const en = resolveLocalized(raw, 'en');
                            const kh = resolveLocalized(raw, 'kh');
                            return `${en || '-'} / ${kh || '-'}`;
                          }
                          return resolveName(viewingItem) || '-';
                        })()}
                      </span>
                    </div>
                    {(viewingItem.category || viewingItem.platform || viewingItem.platform_name) && (
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60">
                        <span className="block text-xs text-gray-400 font-medium mb-1">Category & Platform</span>
                        <span className="text-gray-900 dark:text-gray-200 font-medium">
                          {viewingItem.category || '-'} {(viewingItem.platform || viewingItem.platform_name) ? `(${viewingItem.platform || viewingItem.platform_name})` : ''}
                        </span>
                      </div>
                    )}
                    {viewingItem.proficiency !== undefined && viewingItem.proficiency !== null && viewingItem.proficiency !== '' && (
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60 col-span-2">
                        <span className="block text-xs text-gray-400 font-medium mb-1">Proficiency</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${viewingItem.proficiency}%` }} />
                          </div>
                          <span className="text-gray-900 dark:text-gray-200 font-bold text-xs">{viewingItem.proficiency}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {(() => {
                    const rawDesc = viewingItem.description;
                    const hasDesc = rawDesc && (
                      (typeof rawDesc === 'object' && (rawDesc.en || rawDesc.kh || Object.values(rawDesc).some(Boolean)))
                      || (typeof rawDesc === 'string' && rawDesc.trim())
                    );
                    return (
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60">
                          <span className="block text-xs text-gray-400 font-medium mb-1">Description (EN)</span>
                          <span className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap break-words">
                            {hasDesc ? (resolveLocalized(viewingItem.description, 'en') || '-') : '-'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60">
                          <span className="block text-xs text-gray-400 font-medium mb-1">Description (KH)</span>
                          <span className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap break-words">
                            {(() => {
                              const raw = viewingItem.description;
                              const isObject = raw && (typeof raw === 'object' || (typeof raw === 'string' && raw.trim().startsWith('{')));
                              if (isObject) return resolveLocalized(raw, 'kh') || '-';
                              if (raw) return resolveLocalized(raw, 'kh') || raw;
                              return '-';
                            })()}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {(viewingItem.icon || viewingItem.url || viewingItem.website_url || viewingItem.link) && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60">
                      <span className="block text-xs text-gray-400 font-medium mb-2">Icon / Link</span>
                      <div className="flex flex-wrap items-center gap-3">
                        {viewingItem.icon && (
                          isImageUrl(viewingItem.icon) ? (
                            <img
                              src={getImageUrl(viewingItem.icon)}
                              alt="Icon"
                              className="w-8 h-8 object-contain rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-mono">
                              {viewingItem.icon}
                            </span>
                          )
                        )}
                        {resolveUrl(viewingItem) && (
                          <a
                            href={resolveUrl(viewingItem)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline text-xs break-all"
                          >
                            {resolveUrl(viewingItem)}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {title === 'Achievements' && viewingItem.company_logo && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60 flex items-center gap-4">
                      <span className="block text-xs text-gray-400 font-medium">Company Logo:</span>
                      <img src={getImageUrl(viewingItem.company_logo)} alt="Company Logo" className="w-10 h-10 object-cover rounded-lg border" />
                    </div>
                  )}

                  {title === 'Achievements' && viewingItem.school_logo && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#070a12] border border-gray-200/60 dark:border-gray-800/60 flex items-center gap-4">
                      <span className="block text-xs text-gray-400 font-medium">School Logo:</span>
                      <img src={getImageUrl(viewingItem.school_logo)} alt="School Logo" className="w-10 h-10 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingItem ? 'Edit' : 'Create'} {title.slice(0, -1) || 'Item'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/40 transition min-h-[80px]" rows={3} />
                  ) : field.type === 'file' ? (
                    <div>
                      {/* Existing Image Preview */}
                      {formData[field.name + '_url'] && !formData[field.name + '_file'] && (
                        <div className="mb-2 flex items-center gap-2">
                          <img
                            src={getImageUrl(formData[field.name + '_url'])}
                            alt="Current"
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <span className="text-xs text-gray-500">Current Image</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept={field.accept || 'image/*'}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData((prev) => ({
                              ...prev,
                              [field.name]: file,
                              [field.name + '_file']: file,
                              [field.name + '_preview']: URL.createObjectURL(file),
                            }));
                          }
                        }}
                        className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-sm file:cursor-pointer focus:outline-none focus:border-blue-500/40 transition"
                      />
                      {/* New Selected File Preview */}
                      {formData[field.name + '_preview'] && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={formData[field.name + '_preview']}
                            alt="New Preview"
                            className="w-16 h-16 object-cover rounded border border-blue-500"
                          />
                          <span className="text-xs text-blue-600">New Image Selected</span>
                        </div>
                      )}
                    </div>
                  ) : field.type === 'select' ? (
                    <select value={formData[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500/40 transition">
                      {field.options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                  ) : field.type === 'multiselect' ? (
                    <div className="space-y-2">
                      {/* Selected count */}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Array.isArray(formData[field.name]) ? formData[field.name].length : 0} selected
                      </div>
                      {/* Checkbox group */}
                      <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700/50 rounded-lg p-2 space-y-1 bg-gray-50 dark:bg-[#070a12]">
                        {field.options && field.options.length > 0 ? (
                          field.options.map((opt) => {
                            const selected = Array.isArray(formData[field.name]) && formData[field.name].includes(opt.value);
                            return (
                              <label
                                key={opt.value}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition text-sm ${
                                  selected
                                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => {
                                    const current = Array.isArray(formData[field.name]) ? [...formData[field.name]] : [];
                                    const idx = current.indexOf(opt.value);
                                    if (idx === -1) {
                                      current.push(opt.value);
                                    } else {
                                      current.splice(idx, 1);
                                    }
                                    setFormData({ ...formData, [field.name]: current });
                                  }}
                                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500/40"
                                />
                                {opt.app ? (
                                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                    <SoftwareApps app={opt.app} className="w-4 h-4" />
                                  </span>
                                ) : opt.icon ? (
                                  <span className="flex-shrink-0">{opt.icon}</span>
                                ) : null}
                                <span className="truncate">{opt.label}</span>
                              </label>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">No options available</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder || ''}
                      className="w-full bg-gray-50 dark:bg-[#070a12] border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/40 transition"
                    />
                  )}
                  {/* Image preview for URL/image fields */}
                  {field.preview && renderImagePreview(field)}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-800">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white dark:bg-[#0d111c] border border-gray-200 dark:border-gray-700/50 rounded-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-500/10"><AlertTriangle size={20} className="text-red-500 dark:text-red-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Delete</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTable;