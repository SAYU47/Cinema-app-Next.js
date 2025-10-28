// config/navigationMenuConfig.ts
import { NavigationMenuItem } from '@/types/navigation';

export const getMenuItems = (
  isAuthorized: boolean,
  handleMyTicketsClick: (e: React.MouseEvent) => void,
  handleLogout: () => void
): NavigationMenuItem[] => [
  { href: '/', label: 'Фильмы', icon: '🎬' },
  { href: '/cinema/cinemas', label: 'Кинотеатры', icon: '🏛️' },
  {
    href: '/my-tickets',
    label: 'Мои билеты',
    icon: '🎫',
    onClick: handleMyTicketsClick,
  },
  {
    href: isAuthorized ? '#' : '/auth/login',
    label: isAuthorized ? 'Выход' : 'Вход',
    icon: isAuthorized ? '🚪' : '👤',
    onClick: isAuthorized ? handleLogout : undefined,
  },
];
