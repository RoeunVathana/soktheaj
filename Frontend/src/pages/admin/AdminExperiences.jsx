import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { experienceApi } from '../../services/api';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Job Title (EN)', accessor: 'job_title' },
  { header: 'Company', accessor: 'company_name' },
  { header: 'Location', accessor: 'location' },
  { header: 'Current', accessor: 'is_current', type: 'boolean' },
  { header: 'Start', accessor: 'start_date', type: 'date' },
  { header: 'End', accessor: 'end_date', type: 'date' },
];

const formFields = [
  { name: 'job_title_en', label: 'Job Title (English)', type: 'text', placeholder: 'Enter job title in English' },
  { name: 'job_title_kh', label: 'Job Title (Khmer)', type: 'text', placeholder: 'Enter job title in Khmer' },
  { name: 'company_name_en', label: 'Company Name (English)', type: 'text', placeholder: 'Enter company name in English' },
  { name: 'company_name_kh', label: 'Company Name (Khmer)', type: 'text', placeholder: 'Enter company name in Khmer' },
  { name: 'company_logo', label: 'Company Logo URL', type: 'text' },
  { name: 'location_en', label: 'Location (English)', type: 'text', placeholder: 'Enter location in English' },
  { name: 'location_kh', label: 'Location (Khmer)', type: 'text', placeholder: 'Enter location in Khmer' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea', placeholder: 'Enter description in English' },
  { name: 'description_kh', label: 'Description (Khmer)', type: 'textarea', placeholder: 'Enter description in Khmer' },
  { name: 'start_date', label: 'Start Date', type: 'date' },
  { name: 'end_date', label: 'End Date', type: 'date' },
  { name: 'is_current', label: 'Current Position', type: 'select', options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
];

const transformPayload = (formData) => {
  const payload = {
    company_logo: formData.company_logo,
    start_date: formData.start_date,
    end_date: formData.end_date,
    is_current: formData.is_current,
    job_title: {
      en: formData.job_title_en,
      kh: formData.job_title_kh || formData.job_title_en,
    },
    company_name: {
      en: formData.company_name_en,
      kh: formData.company_name_kh || formData.company_name_en,
    },
    location: {
      en: formData.location_en || '',
      kh: formData.location_kh || formData.location_en || '',
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
  // Handles both 'job_title' or fallback keys depending on backend schema
  job_title_en: getVal(item.job_title || item.title || item.position, 'en'),
  job_title_kh: getVal(item.job_title || item.title || item.position, 'kh'),
  company_name_en: getVal(item.company_name || item.company, 'en'),
  company_name_kh: getVal(item.company_name || item.company, 'kh'),
  company_logo: item.company_logo || item.company_logo_url || item.logo || '',
  location_en: getVal(item.location, 'en'),
  location_kh: getVal(item.location, 'kh'),
  description_en: getVal(item.description, 'en'),
  description_kh: getVal(item.description, 'kh'),
  start_date: item.start_date || '',
  end_date: item.end_date || '',
  is_current: item.is_current ? '1' : '0',
});

const AdminExperiences = () => (
  <AdminLayout>
    <CrudTable
      title="Experiences"
      description="Manage your work experience entries"
      fetchAll={experienceApi.getAll}
      getItemById={experienceApi.getById}
      createItem={experienceApi.create}
      updateItem={experienceApi.update}
      deleteItem={experienceApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{ job_title_en: '', job_title_kh: '', company_name_en: '', company_name_kh: '', company_logo: '', location_en: '', location_kh: '', description_en: '', description_kh: '', start_date: '', end_date: '', is_current: '0' }}
      transformPayload={transformPayload}
      parseFormData={parseFormData}
    />
  </AdminLayout>
);

export default AdminExperiences;