'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
export default function NavigationMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { isAuthorized, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleMyTicketsClick =  (e: React.MouseEvent) => {
    if (!isAuthorized) {    
      e.preventDefault();
      toast.error('Для доступа к странице "Мои билеты" необходимо авторизоваться');
      router.push('/auth/login'); 
    }
  };

  const menuItems = [
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

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 min-w-[300px]">
      <Link href={'/'} className="mb-8 pb-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🍿</span>
          Cinema App
        </h2>
        <p className="text-gray-400 text-sm mt-1">Ваш киногид</p>
      </Link>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-300 ease-in-out
                group relative
                ${active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }
              `}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={item.onClick}
            >
              <span className={`
                text-lg transition-transform duration-300
                ${active || hoveredItem === item.href ? 'scale-110' : 'scale-100'}
              `}>
                {item.icon}
              </span>
              <span className="font-medium transition-all duration-300">
                {item.label}
              </span>
              {active && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
              )}
              {!active && hoveredItem === item.href && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500/50 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform duration-300">
            ?
          </div>
          <span className="text-sm">Помощь и поддержка</span>
        </div>
      </div>
    </div>
  );
}
