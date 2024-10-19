import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/auth/login';
import OTP from '@/pages/auth/otp';
import ProtectedRoute from '@/pages/ProtectedRoute';
import GeneralError from '@/pages/errors/general-error';
import NotFoundError from '@/pages/errors/not-found-error';
import MaintenanceError from '@/pages/errors/maintenance-error';

import Loader from '@/components/loader';

const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('@/pages/auth/login')).default,
    }),
  },
  {
    path: '/otp',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader />}>
          <OTP />
        </Suspense>
      </ProtectedRoute>
    ),
  },

  // Error routes
  { path: '/500', element: <GeneralError /> },
  { path: '/404', element: <NotFoundError /> },
  { path: '/503', element: <MaintenanceError /> },

  // Captive portal fallback
  { path: '/*', element: <Login /> },
]);

export default router;
