  import axios from 'axios';

  const API_BASE_URL = 'http://localhost:3022';


  export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, 
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const message = error.response.data?.message || `Ошибка: ${error.response.status}`;
        return Promise.reject(new Error(message));
      } else if (error.request) {
        return Promise.reject(new Error('Нет соединения с сервером'));
      } else {
        return Promise.reject(new Error('Ошибка настройки запроса'));
      }
    }
  );