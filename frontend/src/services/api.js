import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../utils/constants';

/**
 * Universal fetch wrapper for API communication.
 * Automatically injects the JWT authorization token and handles JSON serialization/deserialization.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMessage = 'Something went wrong. Please try again.';

    if (data.detail) {
      errorMessage = data.detail;
    } else if (typeof data === 'object' && data !== null) {
      const messages = Object.entries(data)
        .map(([field, err]) => {
          const formattedErr = Array.isArray(err) ? err.join(' ') : String(err);
          return field === 'non_field_errors' ? formattedErr : `${field}: ${formattedErr}`;
        })
        .filter(Boolean);

      if (messages.length > 0) {
        errorMessage = messages.join(' | ');
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API
export const authApi = {
  login: (credentials) =>
    apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (payload) =>
    apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => apiRequest('/auth/me/'),
};

// Projects API
export const projectsApi = {
  list: () => apiRequest('/projects/'),
  create: (projectData) =>
    apiRequest('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),
  submitFeedback: (id, feedbackData) =>
    apiRequest(`/projects/${id}/feedback/`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    }),
  getAnnouncement: () => apiRequest('/projects/announcement/'),
  updateAnnouncement: (data) =>
    apiRequest('/projects/announcement/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  adminList: () => apiRequest('/projects/admin/'),
  adminUpdate: (id, updates) =>
    apiRequest(`/projects/admin/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
};

// Placement Companies API
export const placementApi = {
  list: (department = '', search = '') => {
    const params = new URLSearchParams();
    if (department && department !== 'all') params.append('department', department);
    if (search) params.append('search', search);
    const queryString = params.toString();
    return apiRequest(`/projects/placement-links/${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) =>
    apiRequest('/projects/placement-links/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/projects/placement-links/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/projects/placement-links/${id}/`, {
      method: 'DELETE',
    }),
  toggleApplied: (id) =>
    apiRequest(`/projects/placement-links/${id}/toggle-apply/`, {
      method: 'POST',
    }),
  trackClick: (id) =>
    apiRequest(`/projects/placement-links/${id}/track-click/`, {
      method: 'POST',
    }),
};

