import { lazy, Suspense } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardLayout = lazy(() => import('@/features/dashboard/components/DashboardLayout'));

export function Router() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Suspense fallback={<FullPageSpinner />}>
      {isAuthenticated ? <DashboardLayout /> : <LoginPage />}
    </Suspense>
  );
}

function FullPageSpinner() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
