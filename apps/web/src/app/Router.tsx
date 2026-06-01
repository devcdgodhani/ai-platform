import { lazy, Suspense } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';

import { Spinner } from '@ai-platform/ui';

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
      <Spinner size="lg" className="border-brand-500 border-t-transparent" />
    </div>
  );
}
