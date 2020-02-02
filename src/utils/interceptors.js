import axios from 'axios';
import userService from '../services/user-service';

export default function setup() {
  axios.interceptors.request.use((config) => {
      const token = userService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token.value}`;
      }
      return config;
  }, (error) => {
      return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response.status == 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  });
}


