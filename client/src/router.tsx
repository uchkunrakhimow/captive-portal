import { createBrowserRouter } from 'react-router-dom';
import GeneralError from '@/pages/errors/general-error';
import NotFoundError from '@/pages/errors/not-found-error';
import MaintenanceError from '@/pages/errors/maintenance-error';
import Login from '@/pages/auth/login';

const router = createBrowserRouter([
  // Home route
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('@/pages/auth/login')).default,
    }),
  },

  // Auth routes
  {
    path: '/signin',
    lazy: async () => ({
      Component: (await import('@/pages/auth/login')).default,
    }),
  },
  {
    path: '/signin-2',
    lazy: async () => ({
      Component: (await import('@/pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/signup',
    lazy: async () => ({
      Component: (await import('@/pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('@/pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('@/pages/auth/otp')).default,
    }),
  },

  // Main routes
  {
    path: '/admin',
    lazy: async () => {
      const AppShell = await import('./components/app-shell');
      return { Component: AppShell.default };
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/dashboard')).default,
        }),
      },
      {
        path: 'tasks',
        lazy: async () => ({
          Component: (await import('@/pages/tasks')).default,
        }),
      },
      {
        path: 'chats',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'apps',
        lazy: async () => ({
          Component: (await import('@/pages/apps')).default,
        }),
      },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'analysis',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Captive portal
  { path: '/*', Component: Login },
]);

export default router;
