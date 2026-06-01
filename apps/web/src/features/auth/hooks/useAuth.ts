import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import type { AuthTokens, UserProfile } from '@ai-platform/shared-types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<{ data: AuthTokens & { user: UserProfile } }>(
        '/auth/login',
        credentials,
      );
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn });
      toast.success('Welcome back!');
    },
    onError: () => toast.error('Invalid credentials'),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; name: string }) => {
      const { data } = await apiClient.post<{ data: AuthTokens & { user: UserProfile } }>(
        '/auth/register',
        credentials,
      );
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn });
      toast.success('Registration successful!');
    },
    onError: () => toast.error('Registration failed'),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return () => { clearAuth(); toast.success('Logged out'); };
}
