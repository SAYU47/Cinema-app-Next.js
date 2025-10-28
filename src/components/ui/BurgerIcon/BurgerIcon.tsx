interface BurgerIconProps {
  isOpen: boolean;
}

export default function BurgerIcon({ isOpen }: BurgerIconProps) {
  return (
    <div className="flex flex-col gap-1 w-6 cursor-pointer">
      <div
        className={`h-0.5 w-full bg-white transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-1.5' : ''
        }`}
      />
      <div
        className={`h-0.5 w-full bg-white transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        className={`h-0.5 w-full bg-white transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : ''
        }`}
      />
    </div>
  );
}
