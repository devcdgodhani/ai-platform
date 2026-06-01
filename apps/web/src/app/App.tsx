import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Router } from './Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgb(30 30 46)',
            color: 'rgb(240 240 255)',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
