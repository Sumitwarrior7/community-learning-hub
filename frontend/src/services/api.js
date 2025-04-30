import axios from 'axios';

const API = axios.create({ baseURL: `${process.env.REACT_APP_BACKEND_URL}/api` });

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location = '/register';
    }
    return Promise.reject(error);
  }
);

export default API;