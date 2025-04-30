import API from './api.js';

// after login/register we’ll set this on-demand, so no need for an interceptor here
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export const loginUser = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  // console.log("data :", data)
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await API.get('/auth/me');
  // console.log("me data :", data)
  return data;
};
