// components/Navigation/NavigationMenu.tsx
'use client';
import { useNavigation } from '@/hooks/useNavigation';
import { getMenuItems } from '@/config/navigationMenuConfig';
import MobileHeader from './MobileHeader';
import MenuList from './MenuList';

import MobileOverlay from './MobileOverlay';
import DesktopLogo from '../ui/DesktopLogo/DesktopLogo';

export default function NavigationMenu() {
  const {
    hoveredItem,
    setHoveredItem,
    isMobileMenuOpen,
    isAuthorized,
    handleLogout,
    handleMyTicketsClick,
    isActive,
    toggleMobileMenu,
    closeMobileMenu,
  } = useNavigation();

  const menuItems = getMenuItems(
    isAuthorized,
    handleMyTicketsClick,
    handleLogout
  );

  return (
    <>
      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMenu={toggleMobileMenu}
      />

      <div
        className={`
        fixed lg:static top-0 left-0 min-h-dvh z-40 max-w-[250px]
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col min-h-dvh bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700
        w-80 lg:w-full lg:min-w-[300px] mt-[60px] min-lg:mt-0
      `}
      >
        <DesktopLogo onCloseMobileMenu={closeMobileMenu} />

        <MenuList
          items={menuItems}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          isActive={isActive}
          onItemClick={closeMobileMenu}
        />
      </div>

      <MobileOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
