// src/services/apiService.js
import axios from 'axios';
const auth = localStorage.getItem('auth_token');

// axios info
const apiClient = axios.create({
  baseURL: 'https://api.alifawzi.software/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth}`,
  },
});

// GET request
export const get = async (url, params = {}, endPoint = '', id = '') => {
  try {
    const fullUrl = id ? `${url}${endPoint}/${id}` : `${url}${endPoint}`;
    const response = await apiClient.get(`${fullUrl}?pagesize=10000&offset=10000`, { params });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};


// POST request
export const post = async (url, data, endPoint = '', isFormData = false) => {
  try {
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post(`${url}${endPoint}`, data, { headers });
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

export const postFile = async (url, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${auth}`,
        'X-CSRF-TOKEN': 'CSRF-Token',
      },
    });

    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

// PUT request
export const put = async (url, data, endPoint = '') => {
  try {
    const response = await apiClient.put(`${url}${endPoint}`, data);
    return response.data;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

// DELETE request
export const del = async (url, id, endPoint = '') => {
  try {
    const response = await apiClient.delete(`${url}${endPoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};