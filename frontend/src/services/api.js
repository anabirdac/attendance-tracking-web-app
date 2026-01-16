/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Event Group API Methods
 */
export const eventGroupAPI = {
  // Get all event groups
  getAll: () => api.get('/event-groups'),

  // Get single event group with events
  getById: (id) => api.get(`/event-groups/${id}`),

  // Create new event group
  create: (data) => api.post('/event-groups', data),

  // Update event group
  update: (id, data) => api.put(`/event-groups/${id}`, data),

  // Delete event group
  delete: (id) => api.delete(`/event-groups/${id}`)
};

/**
 * Event API Methods
 */
export const eventAPI = {
  // Get all events
  getAll: () => api.get('/events'),

  // Get single event
  getById: (id) => api.get(`/events/${id}`),

  // Get events by group
  getByGroupId: (groupId) => api.get(`/events/group/${groupId}`),

  // Create new event
  create: (data) => api.post('/events', data),

  // Update event
  update: (id, data) => api.put(`/events/${id}`, data),

  // Delete event
  delete: (id) => api.delete(`/events/${id}`),

  // Force open event (testing)
  forceOpen: (id) => api.post(`/events/${id}/force-open`),

  // Force close event (testing)
  forceClose: (id) => api.post(`/events/${id}/force-close`)
};

/**
 * Attendance API Methods
 */
export const attendanceAPI = {
  // Confirm attendance with code
  confirm: (data) => api.post('/attendance', data),

  // Get attendance for specific event
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`),

  // Export event attendance as CSV
  exportEventCSV: (eventId) => api.get(`/attendance/event/${eventId}/export/csv`, {
    responseType: 'blob'
  }),

  // Export event attendance as XLSX
  exportEventXLSX: (eventId) => api.get(`/attendance/event/${eventId}/export/xlsx`, {
    responseType: 'blob'
  }),

  // Export group attendance as CSV
  exportGroupCSV: (groupId) => api.get(`/attendance/group/${groupId}/export/csv`, {
    responseType: 'blob'
  }),

  // Export group attendance as XLSX
  exportGroupXLSX: (groupId) => api.get(`/attendance/group/${groupId}/export/xlsx`, {
    responseType: 'blob'
  })
};

/**
 * Helper function to download exported files
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
