import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { CulturePage } from '@/pages/CulturePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/store/useAuth';
const queryClient = new QueryClient();
// Route Protection Component
function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/shop" replace />;
  }
  return <>{children}</>;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "culture",
        element: <CulturePage />,
      },
      {
        path: "shop",
        element: <ProductsPage />,
      },
      {
        path: "shop/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "confirmation",
        element: <OrderConfirmationPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "admin",
        element: <AdminGuard><AdminPage /></AdminGuard>,
      }
    ]
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)