import Link from 'next/link';

interface MenuItemProps {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  hovered: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onItemClick: () => void;
}

export default function MenuItem({
  href,
  label,
  icon,
  active,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onItemClick,
}: MenuItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    onItemClick();
  };

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        transition-all duration-300 ease-in-out
        group relative
        ${
          active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        }
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <span
        className={`
        text-lg transition-transform duration-300
        ${active || hovered ? 'scale-110' : 'scale-100'}
      `}
      >
        {icon}
      </span>
      <span className="font-medium transition-all duration-300">{label}</span>

      {active && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
      )}
      {!active && hovered && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-500/50 rounded-r-full" />
      )}
    </Link>
  );
}
