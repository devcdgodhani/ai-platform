import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const apiClient = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().tokens?.accessToken;
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Clear auth on 401 and unwrap ApiResponse
apiClient.interceptors.response.use(
  (r) => {
    // If the backend wraps responses in { success: true, data: T }, unwrap it here
    if (r.data && typeof r.data === 'object' && 'success' in r.data && 'data' in r.data) {
      r.data = r.data.data;
    }
    return r;
  },
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(err);
  },
);
