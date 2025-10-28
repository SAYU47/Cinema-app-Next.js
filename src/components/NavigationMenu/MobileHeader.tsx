import Link from 'next/link';
import BurgerIcon from '@/components/ui/BurgerIcon/BurgerIcon';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function MobileHeader({
  isMobileMenuOpen,
  onToggleMenu,
}: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-800 p-4 border-b border-gray-700 z-50">
      <div className="flex items-center justify-between">
        <Link href={'/'} className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
          <h2 className="text-xl font-bold text-white">Cinema App</h2>
        </Link>
        <button
          onClick={onToggleMenu}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <BurgerIcon isOpen={isMobileMenuOpen} />
        </button>
      </div>
    </div>
  );
}
