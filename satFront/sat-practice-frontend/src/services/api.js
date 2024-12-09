import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data) => {
  return api.post('/students/register', data);
};

export const loginUser = async (data) => {
  return api.post('/login', data);
};

export const verifyOtp = async (data) => {
  return api.post('/verifyAccount', data);
};

export const resendOtp = async (email) => {
  return api.post('/regenerateOtp', { email });
};

export default api;
