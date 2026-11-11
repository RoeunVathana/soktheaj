import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { skillApi } from '../../services/api';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name (EN)', accessor: 'name' },
  { header: 'Category', accessor: 'category' },
  { header: 'Proficiency', accessor: 'proficiency' },
];

const formFields = [
  { name: 'name_en', label: 'Name (English)', type: 'text', placeholder: 'Enter name in English' },
  { name: 'name_kh', label: 'Name (Khmer)', type: 'text', placeholder: 'Enter name in Khmer' },
  { name: 'icon', label: 'Icon URL', type: 'text', placeholder: 'https://example.com/icon.png or SVG path', preview: true },
  { name: 'category', label: 'Category', type: 'select', options: [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
  ]},
  { name: 'proficiency', label: 'Proficiency (1-100)', type: 'number' },
];

const transformPayload = (formData) => {
  const payload = {
    name: {
      en: formData.name_en || '',
      kh: formData.name_kh || formData.name_en || '',
    },
    icon: formData.icon || '',
    proficiency: Number(formData.proficiency) || 0,
    category: formData.category || 'frontend',
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
  category: item.category || 'frontend',
  proficiency: item.proficiency ?? '',
});

const AdminSkills = () => (
  <AdminLayout>
    <CrudTable
      title="Skills"
      description="Manage your skills"
      fetchAll={skillApi.getAll}
      getItemById={skillApi.getById}
      createItem={skillApi.create}
      updateItem={skillApi.update}
      deleteItem={skillApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{ name_en: '', name_kh: '', icon: '', category: 'frontend', proficiency: '' }}
      transformPayload={transformPayload}
      parseFormData={parseFormData}
    />
  </AdminLayout>
);

export default AdminSkills;