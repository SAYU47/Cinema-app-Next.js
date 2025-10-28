export interface NavigationMenuItem {
  href: string;
  label: string;
  icon: string;
  onClick?: (e: React.MouseEvent) => void;
}
