import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonType = 'button' | 'submit' | 'reset';

interface CustomButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  isLoading?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = 'button',
  isLoading = false,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = `
    cursor-pointer rounded-xl focus:outline-none focus:ring-2 
    focus:ring-offset-2 transition-all duration-300 font-semibold shadow-lg
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500 focus:ring-offset-gray-900',
    secondary:
      'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-gray-900',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 focus:ring-offset-gray-900',
  };

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };

  return (
    <button
      type={type}
      disabled={isLoading}
      className={`
        w-full
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
