import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { projectApi, softwareAppApi } from '../../services/api';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Thumbnail', accessor: 'thumbnail', type: 'image' },
  { header: 'Title (EN)', accessor: 'title' },
  { header: 'Slug', accessor: 'slug' },
  { header: 'Featured', accessor: 'is_featured', type: 'boolean' },
  { header: 'Views', accessor: 'views_count' },
  { header: 'Downloads', accessor: 'downloads_count' },
];

const AdminProjects = () => {
  const [softwareApps, setSoftwareApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const fetchSoftwareApps = async () => {
      try {
        const apps = await softwareAppApi.getAll();
        setSoftwareApps(Array.isArray(apps) ? apps : []);
      } catch (err) {
        console.warn('Failed to load software applications:', err);
        setSoftwareApps([]);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchSoftwareApps();
  }, []);

  // Build multi-select options from the software apps database.
  // Backend returns the localized name directly (based on Accept-Language header).
  const softwareOptions = softwareApps.map((app) => ({
    value: String(app.id),
    label: app.name || `App #${app.id}`,
    app, // Pass the full app object so CrudTable can render its icon
  }));

  const formFields = [
    { name: 'title_en', label: 'Title (English)', type: 'text', placeholder: 'Enter title in English' },
    { name: 'title_kh', label: 'Title (Khmer)', type: 'text', placeholder: 'Enter title in Khmer' },
    { name: 'slug', label: 'Slug', type: 'text' },
    { name: 'description_en', label: 'Description (English)', type: 'textarea', placeholder: 'Enter description in English' },
    { name: 'description_kh', label: 'Description (Khmer)', type: 'textarea', placeholder: 'Enter description in Khmer' },
    { name: 'thumbnail', label: 'Thumbnail Image', type: 'file', accept: 'image/*' },
    {
      name: 'software_ids',
      label: 'Technologies / Tools',
      type: 'multiselect',
      options: softwareOptions,
      placeholder: loadingApps ? 'Loading software apps...' : 'Select technologies used in this project',
    },
    { name: 'demo_link', label: 'Demo Link', type: 'text' },
    { name: 'github_link', label: 'GitHub Link', type: 'text' },
    { name: 'file_path', label: 'Download File URL (Google Drive link or direct URL)', type: 'text', placeholder: 'https://drive.google.com/file/d/FILE_ID/view or /uc?export=download&id=FILE_ID' },
    { name: 'is_featured', label: 'Featured', type: 'select', options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
  ];

  const transformPayload = (formData) => {
    // Detect the selected file explicitly from the thumbnail field (File object)
    // CrudTable stores the File under both `thumbnail` and `thumbnail_file` keys.
    const thumbnailFile =
      (formData.thumbnail instanceof File && formData.thumbnail) ||
      (formData.thumbnail_file instanceof File && formData.thumbnail_file);

    // Convert selected software IDs (strings) to integers
    const softwareIds = Array.isArray(formData.software_ids)
      ? formData.software_ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id))
      : [];

    // If a file was selected, use FormData for multipart upload
    if (thumbnailFile) {
      const submitData = new FormData();
      submitData.append('title', JSON.stringify({
        en: formData.title_en,
        kh: formData.title_kh || formData.title_en,
      }));
      submitData.append('description', JSON.stringify({
        en: formData.description_en || '',
        kh: formData.description_kh || formData.description_en || '',
      }));
      submitData.append('slug', formData.slug || '');
      // Append image file explicitly using the key expected by the backend
      submitData.append('thumbnail', thumbnailFile);
      submitData.append('demo_link', formData.demo_link || '');
      submitData.append('github_link', formData.github_link || '');
      submitData.append('file_path', formData.file_path || '');
      submitData.append('is_featured', formData.is_featured || '0');
      // Append each software ID so Laravel receives an array
      softwareIds.forEach((id) => submitData.append('software_ids[]', id));
      return submitData;
    }

    // Otherwise send JSON payload
    const payload = {
      slug: formData.slug,
      demo_link: formData.demo_link,
      github_link: formData.github_link,
      file_path: formData.file_path || null,
      is_featured: formData.is_featured,
      software_ids: softwareIds,
      title: {
        en: formData.title_en,
        kh: formData.title_kh || formData.title_en,
      },
      description: {
        en: formData.description_en || '',
        kh: formData.description_kh || formData.description_en || '',
      },
    };
    return payload;
  };

  // Helper to safely extract translation values (supports JSON objects, parsed JSON strings, or raw strings)
  const getVal = (field, lang) => {
    if (!field) return '';
    if (typeof field === 'object') return field[lang] || field.en || '';
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return parsed[lang] || parsed.en || '';
      } catch (e) {
        return field; // Raw string
      }
    }
    return '';
  };

  const parseFormData = (item) => ({
    title_en: getVal(item.title, 'en'),
    title_kh: getVal(item.title, 'kh'),
    slug: item.slug || '',
    description_en: getVal(item.description, 'en'),
    description_kh: getVal(item.description, 'kh'),
    thumbnail: '',
    thumbnail_url: item.thumbnail || '',
    // Extract selected software app IDs from the technologies relation
    software_ids: Array.isArray(item.technologies)
      ? item.technologies.map((tech) => String(tech.id))
      : [],
    demo_link: item.demo_link || '',
    github_link: item.github_link || '',
    file_path: item.file_path || '',
    is_featured: item.is_featured ? '1' : '0',
  });

  return (
    <AdminLayout>
      <CrudTable
        title="Projects"
        description="Manage your portfolio projects"
        fetchAll={projectApi.getAll}
        getItemById={projectApi.getById}
        createItem={projectApi.create}
        updateItem={projectApi.update}
        deleteItem={projectApi.delete}
        columns={columns}
        formFields={formFields}
        formInitialValues={{ title_en: '', title_kh: '', slug: '', description_en: '', description_kh: '', thumbnail: '', thumbnail_url: '', software_ids: [], demo_link: '', github_link: '', file_path: '', is_featured: '0' }}
        transformPayload={transformPayload}
        parseFormData={parseFormData}
      />
    </AdminLayout>
  );
};

export default AdminProjects;