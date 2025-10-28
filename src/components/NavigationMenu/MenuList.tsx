import { NavigationMenuItem } from '@/types/navigation';
import MenuItem from './MenuItem';

interface MenuListProps {
  items: NavigationMenuItem[];
  hoveredItem: string | null;
  setHoveredItem: (href: string | null) => void;
  isActive: (href: string) => boolean;
  onItemClick: () => void;
}

export default function MenuList({
  items,
  hoveredItem,
  setHoveredItem,
  isActive,
  onItemClick,
}: MenuListProps) {
  return (
    <nav className="space-y-2 flex-1">
      {items.map((item) => (
        <MenuItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={isActive(item.href)}
          hovered={hoveredItem === item.href}
          onClick={item.onClick}
          onMouseEnter={() => setHoveredItem(item.href)}
          onMouseLeave={() => setHoveredItem(null)}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
}
