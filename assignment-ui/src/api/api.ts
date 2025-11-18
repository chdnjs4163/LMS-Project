import axios from 'axios';

// 백엔드 API의 기본 주소를 설정합니다.
const apiClient = axios.create({
  // ✅ '127.0.0.1'을 현재 컴퓨터의 실제 IP 주소로 변경합니다.
  baseURL: 'http://192.168.24.182:8000/api',
});

// "요청 인터셉터"를 사용하여 모든 요청에 자동으로 JWT 토큰을 추가합니다.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

