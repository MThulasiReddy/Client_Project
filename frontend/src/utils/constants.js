export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const SOCKET_ORIGIN = API_BASE_URL.startsWith('http')
  ? API_BASE_URL.replace(/^http/, 'ws').replace(/\/api$/, '')
  : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;

export const TOKEN_STORAGE_KEY = 'cc_token';

export const STATUSES = ['received', 'confirmed', 'doing', 'done', 'delivered'];

export const STATUS_LABELS = {
  received: 'Received',
  confirmed: 'Confirmed',
  doing: 'In Progress',
  done: 'Done',
  delivered: 'Delivered',
};

export const CATEGORIES = [
  { value: 'iot', label: 'IoT Project' },
  { value: 'web', label: 'Web Development' },
  { value: 'ai', label: 'AI / Machine Learning' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'design', label: 'UI / UX Design' },
  { value: 'other', label: 'Other' },
];

export const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'cse', label: 'CSE', full: 'Computer Science & Engineering' },
  { value: 'ece', label: 'ECE', full: 'Electronics & Communication' },
  { value: 'it', label: 'IT', full: 'Information Technology' },
  { value: 'eee', label: 'EEE', full: 'Electrical & Electronics' },
];

export function formatDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

