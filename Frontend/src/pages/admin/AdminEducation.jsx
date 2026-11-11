import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { educationApi } from '../../services/api';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Degree (EN)', accessor: 'degree' },
  { header: 'Institution', accessor: 'institution' },
  { header: 'Field', accessor: 'field_of_study' },
  { header: 'Start', accessor: 'start_date', type: 'date' },
  { header: 'End', accessor: 'end_date', type: 'date' },
];

const formFields = [
  { name: 'degree_en', label: 'Degree (English)', type: 'text', placeholder: 'Enter degree in English' },
  { name: 'degree_kh', label: 'Degree (Khmer)', type: 'text', placeholder: 'Enter degree in Khmer' },
  { name: 'institution_en', label: 'Institution (English)', type: 'text', placeholder: 'Enter institution in English' },
  { name: 'institution_kh', label: 'Institution (Khmer)', type: 'text', placeholder: 'Enter institution in Khmer' },
  { name: 'field_of_study_en', label: 'Field of Study (English)', type: 'text', placeholder: 'Enter field of study in English' },
  { name: 'field_of_study_kh', label: 'Field of Study (Khmer)', type: 'text', placeholder: 'Enter field of study in Khmer' },
  { name: 'school_logo', label: 'School Logo URL', type: 'text' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea', placeholder: 'Enter description in English' },
  { name: 'description_kh', label: 'Description (Khmer)', type: 'textarea', placeholder: 'Enter description in Khmer' },
  { name: 'start_date', label: 'Start Date', type: 'date' },
  { name: 'end_date', label: 'End Date', type: 'date' },
];

const transformPayload = (formData) => {
  const payload = {
    school_logo: formData.school_logo,
    location: formData.location,
    start_date: formData.start_date,
    end_date: formData.end_date,
    degree: {
      en: formData.degree_en,
      kh: formData.degree_kh || formData.degree_en,
    },
    institution: {
      en: formData.institution_en,
      kh: formData.institution_kh || formData.institution_en,
    },
    field_of_study: {
      en: formData.field_of_study_en || '',
      kh: formData.field_of_study_kh || formData.field_of_study_en || '',
    },
    description: {
      en: formData.description_en || '',
      kh: formData.description_kh || formData.description_en || '',
    },
  };
  return payload;
};

// Helper to safely extract translation or string values from translatable fields
const getVal = (field, lang) => {
  if (!field) return '';
  if (typeof field === 'object') return field[lang] || field.en || '';
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return parsed[lang] || parsed.en || '';
    } catch (e) {
      return field; // Return string directly if not valid JSON
    }
  }
  return '';
};

const parseFormData = (item) => ({
  degree_en: getVal(item.degree, 'en'),
  degree_kh: getVal(item.degree, 'kh'),
  institution_en: getVal(item.institution, 'en'),
  institution_kh: getVal(item.institution, 'kh'),
  field_of_study_en: getVal(item.field_of_study, 'en'),
  field_of_study_kh: getVal(item.field_of_study, 'kh'),
  school_logo: item.school_logo || '',
  location: item.location || '',
  description_en: getVal(item.description, 'en'),
  description_kh: getVal(item.description, 'kh'),
  start_date: item.start_date || '',
  end_date: item.end_date || '',
});

const AdminEducation = () => (
  <AdminLayout>
    <CrudTable
      title="Education"
      description="Manage your education background"
      fetchAll={educationApi.getAll}
      getItemById={educationApi.getById}
      createItem={educationApi.create}
      updateItem={educationApi.update}
      deleteItem={educationApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{ degree_en: '', degree_kh: '', institution_en: '', institution_kh: '', field_of_study_en: '', field_of_study_kh: '', school_logo: '', location: '', description_en: '', description_kh: '', start_date: '', end_date: '' }}
      transformPayload={transformPayload}
      parseFormData={parseFormData}
    />
  </AdminLayout>
);

export default AdminEducation;