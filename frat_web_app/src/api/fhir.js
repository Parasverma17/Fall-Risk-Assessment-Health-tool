import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || "http://localhost:8000";

// Token storage
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('frat_auth_token', token);
  } else {
    localStorage.removeItem('frat_auth_token');
  }
}

export function getAuthToken() {
  if (!authToken) {
    authToken = localStorage.getItem('frat_auth_token');
  }
  return authToken;
}

// Helper function with JWT token
const axiosWithAuth = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests
axiosWithAuth.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Legacy: Helper function with credentials (for backward compatibility)
const axiosWithCredentials = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get patient info (demographics, history, meds, observations)
export function getPatientInfo() {
  return axiosWithAuth.get(`${API_BASE}/patient/info`);
}

// Get assessment draft (if any)
export function getAssessmentDraft() {
  return axiosWithAuth.get(`${API_BASE}/assessment/draft`);
}

// Save assessment draft
export function saveAssessmentDraft(data) {
  return axiosWithAuth.post(`${API_BASE}/assessment/draft`, data);
}

// Submit completed assessment
export function submitAssessment(data) {
  return axiosWithAuth.post(`${API_BASE}/assessment/submit`, data);
}

// Get assessment result
export function getAssessmentResult() {
  return axiosWithAuth.get(`${API_BASE}/assessment/result`);
}

// Save assessment to patient record
export function saveAssessmentToRecord(assessmentId) {
  return axiosWithAuth.post(`${API_BASE}/assessment/save`, { assessmentId });
}

// SMART on FHIR OAuth callback
export function smartCallback(code) {
  return axiosWithCredentials.post(`${API_BASE}/auth/callback`, { code });
}

// Verify JWT token
export function verifyToken(token) {
  return axios.post(`${API_BASE}/auth/verify-token`, { token });
}

// Generate AI Care Plan
export function generateCarePlan(data) {
  return axios.post(`${AI_SERVICE_URL}/api/ai-careplan`, data);
}

// Get available AI models
export function getAvailableModels() {
  return axios.get(`${AI_SERVICE_URL}/api/models`);
}