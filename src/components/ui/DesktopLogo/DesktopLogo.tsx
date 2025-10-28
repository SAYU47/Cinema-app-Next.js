import Link from 'next/link';

interface DesktopLogoProps {
  onCloseMobileMenu: () => void;
}

export default function DesktopLogo({ onCloseMobileMenu }: DesktopLogoProps) {
  return (
    <Link
      href={'/'}
      className="mb-8 pb-4 border-b border-gray-700 hidden min-lg:block"
      onClick={onCloseMobileMenu}
    >
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="text-2xl">🍿</span>
        Cinema App
      </h2>
      <p className="text-gray-400 text-sm mt-1">Ваш киногид</p>
    </Link>
  );
}
