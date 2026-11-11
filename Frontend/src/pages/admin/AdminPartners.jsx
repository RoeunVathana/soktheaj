import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { partnerApi } from '../../services/api';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Logo', accessor: 'logo', type: 'image' },
  { header: 'Name (EN)', accessor: 'name' },
  { header: 'Website', accessor: 'website_url' },
  { header: 'Visible', accessor: 'is_visible', type: 'boolean' },
];

const formFields = [
  { name: 'name_en', label: 'Name (English)', type: 'text', placeholder: 'Enter name in English' },
  { name: 'name_kh', label: 'Name (Khmer)', type: 'text', placeholder: 'Enter name in Khmer' },
  { name: 'logo', label: 'Logo URL', type: 'text', placeholder: 'https://picsum.photos/... or logos/tech.png', preview: true },
  { name: 'website_url', label: 'Website URL', type: 'text' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea', placeholder: 'Enter description in English' },
  { name: 'description_kh', label: 'Description (Khmer)', type: 'textarea', placeholder: 'Enter description in Khmer' },
  { name: 'is_visible', label: 'Visible', type: 'select', options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
  { name: 'order', label: 'Order', type: 'number' },
];

const transformPayload = (formData) => {
  const payload = {
    name: {
      en: formData.name_en || '',
      kh: formData.name_kh || formData.name_en || '',
    },
    description: {
      en: formData.description_en || '',
      kh: formData.description_kh || formData.description_en || '',
    },
    logo: formData.logo || '',
    website_url: formData.website_url || '',
    is_visible: formData.is_visible ?? true,
    order: formData.order || 1,
  };
  return payload;
};

const tryJsonParse = (str) => {
  if (typeof str !== 'string') return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const parseFormData = (item) => {
  if (!item) return {};
  const nameObj = typeof item.name === 'object' && item.name !== null ? item.name : (tryJsonParse(item.name) || { en: item.name || '', kh: item.name || '' });
  const descObj = typeof item.description === 'object' && item.description !== null ? item.description : (tryJsonParse(item.description) || { en: item.description || '', kh: item.description || '' });

  return {
    name_en: nameObj.en || item.name_en || '',
    name_kh: nameObj.kh || item.name_kh || nameObj.en || '',
    logo: item.logo || item.logo_url || '',
    logo_url: item.logo || item.logo_url || '',
    website_url: item.website_url || item.url || '',
    description_en: descObj.en || item.description_en || '',
    description_kh: descObj.kh || item.description_kh || descObj.en || '',
    is_visible: (item.is_visible === true || item.is_visible === 1 || item.is_visible === '1') ? '1' : '0',
    order: item.order ?? '',
  };
};

const AdminPartners = () => (
  <AdminLayout>
    <CrudTable
      title="Partners"
      description="Manage partner logos and links"
      fetchAll={partnerApi.getAll}
      getItemById={partnerApi.getById}
      createItem={partnerApi.create}
      updateItem={partnerApi.update}
      deleteItem={partnerApi.delete}
      columns={columns}
      formFields={formFields}
      formInitialValues={{ name_en: '', name_kh: '', logo: '', website_url: '', description_en: '', description_kh: '', is_visible: '1', order: '' }}
      transformPayload={transformPayload}
      parseFormData={parseFormData}
    />
  </AdminLayout>
);
export default AdminPartners;