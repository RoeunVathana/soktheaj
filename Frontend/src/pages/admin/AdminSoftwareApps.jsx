import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { softwareAppApi } from '../../services/api';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name (EN)', accessor: 'name' },
  { header: 'Category', accessor: 'category' },
  { header: 'Platform', accessor: 'platform' },
];

const formFields = [
  { name: 'name_en', label: 'Name (English)', type: 'text', placeholder: 'Enter name in English' },
  { name: 'name_kh', label: 'Name (Khmer)', type: 'text', placeholder: 'Enter name in Khmer' },
  { name: 'icon', label: 'Icon URL', type: 'text' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea', placeholder: 'Enter description in English' },
  { name: 'description_kh', label: 'Description (Khmer)', type: 'textarea', placeholder: 'Enter description in Khmer' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'platform', label: 'Platform', type: 'text' },
  { name: 'url', label: 'URL', type: 'text' },
];

const transformPayload = (formData) => {
  const payload = {
    name: {
      en: formData.name_en || '',
      kh: formData.name_kh || formData.name_en || '',
    },
    icon: formData.icon_url || formData.icon || '',
    description: {
      en: formData.description_en || '',
      kh: formData.description_kh || formData.description_en || '',
    },
    category: formData.category || '',
    platform: formData.platform || '',
    url: formData.url || '',
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
  name_en: getVal(item.name, 'en'),
  name_kh: getVal(item.name, 'kh'),
  icon: item.icon || '',
  description_en: getVal(item.description, 'en'),
  description_kh: getVal(item.description, 'kh'),
  category: item.category || '',
  platform: item.platform || '',
  url: item.url || '',
});

const AdminSoftwareApps = () => (
  <AdminLayout>
    <CrudTable
      title="Software Applications"
      description="Manage software applications"
      fetchAll={softwareAppApi.getAll}
      getItemById={softwareAppApi.getById}
      createItem={softwareAppApi.create}
      updateItem={softwareAppApi.update}
      deleteItem={softwareAppApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{ name_en: '', name_kh: '', icon: '', description_en: '', description_kh: '', category: '', platform: '', url: '' }}
      transformPayload={transformPayload}
      parseFormData={parseFormData}
    />
  </AdminLayout>
);

export default AdminSoftwareApps;