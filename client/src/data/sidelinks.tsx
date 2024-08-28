import { IconChecklist, IconLayoutDashboard } from '@tabler/icons-react';

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: 'Изменение логотипа',
    label: '',
    href: '/admin',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Панель приборов',
    label: '',
    href: '/admin/tasks',
    icon: <IconChecklist size={18} />,
  },
];
