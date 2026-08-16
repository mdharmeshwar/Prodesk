const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawApiUrl
  ? rawApiUrl.endsWith('/api')
    ? rawApiUrl
    : rawApiUrl.replace(/\/+$/, '') + '/api'
  : '/api';

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

  const contentType = response.headers.get('content-type') || '';
  const isJsonResponse = contentType.includes('application/json');
  const payload = isJsonResponse ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJsonResponse) {
      throw new Error(payload.message || 'Request failed.');
    }

    throw new Error('The server returned an unexpected response. Check that VITE_API_URL points to your backend.');
  }

  if (!isJsonResponse) {
    throw new Error('The server returned HTML instead of JSON. Check your deployed API URL configuration.');
  }

  return payload;
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
