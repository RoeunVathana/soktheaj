import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudTable from '../../components/admin/CrudTable';
import { userManagementApi } from '../../services/adminApi';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Role', accessor: 'role' },
  { header: 'Verified', accessor: 'is_verified', type: 'boolean' },
  { header: '2FA', accessor: 'two_factor_enabled', type: 'boolean' },
  { header: 'Joined', accessor: 'created_at', type: 'date' },
];

const formFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'password', label: 'Password (leave blank to keep current)', type: 'password' },
  { name: 'role', label: 'Role', type: 'select', options: [{ value: 'admin', label: 'Admin' }, { value: 'visitor', label: 'Visitor' }] },
  { name: 'is_verified', label: 'Verified', type: 'select', options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
];

const AdminUsers = () => (
  <AdminLayout>
    <CrudTable title="Users" description="Manage registered users" fetchAll={userManagementApi.getAll} createItem={userManagementApi.create} updateItem={userManagementApi.update} deleteItem={userManagementApi.delete} columns={columns} formFields={formFields} formInitialValues={{ name: '', email: '', password: '', role: 'visitor', is_verified: '0' }} />
  </AdminLayout>
);
export default AdminUsers;