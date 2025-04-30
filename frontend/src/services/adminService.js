// src/services/adminService.js
import API from './api.js';

export const getUsers = async () => {
  const { data } = await API.get('/admin/users');
  return data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await API.put(`/admin/users/${userId}/role`, { role });
  return data;
};

export const getReports = async () => {
  const { data } = await API.get('/admin/reports');
  return data;
};

export const resolveReport = async (reportId, status) => {
  const { data } = await API.put(`/admin/reports/${reportId}`, { status });
  return data;
};

export const deleteReport = async (reportId) => {
  const { data } = await API.delete(`/admin/reports/${reportId}`);
  return data;
};

export const getTopSavedContent = async (limit = 3) => {
  const { data } = await API.get(`/admin/top-saved?limit=${limit}`);
  return data;
};