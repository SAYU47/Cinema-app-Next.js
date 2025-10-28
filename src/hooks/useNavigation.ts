import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthorized, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      toast.error(`Ошибка при выходе: ${error}`);
    }
  };

  const handleMyTicketsClick = (e: React.MouseEvent) => {
    if (!isAuthorized) {
      e.preventDefault();
      toast.error(
        'Для доступа к странице "Мои билеты" необходимо авторизоваться'
      );
      router.push('/auth/login');
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    pathname,
    hoveredItem,
    setHoveredItem,
    isMobileMenuOpen,
    isAuthorized,
    handleLogout,
    handleMyTicketsClick,
    isActive,
    toggleMobileMenu,
    closeMobileMenu,
  };
};
