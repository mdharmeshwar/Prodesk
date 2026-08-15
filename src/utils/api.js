const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const buildHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: buildHeaders(options.token || null),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

export const registerUser = async (payload) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const loginUser = async (payload) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getCurrentUser = async (token) =>
  apiRequest('/auth/me', {
    method: 'GET',
    token,
  });

export const getProtectedTasks = async (token) =>
  apiRequest('/tasks', {
    method: 'GET',
    token,
  });
