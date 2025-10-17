import React, { InputHTMLAttributes, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  type,
  className = '', 
  fullWidth,
  ...props  
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Получаем текст ошибки
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} min-w-[300px]`}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-white  mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`
            w-full px-4 py-3 
            border rounded-lg 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            disabled:opacity-50
            
            /* Базовые стили */
            border-gray-300 
            bg-white
            text-gray-900
            focus:border-blue-500 focus:ring-blue-500
            
            /* Стили при ошибке */
            ${errorMessage ? `
              border-red-500 
              bg-red-50
              text-red-900
              placeholder:text-red-300
              focus:border-red-500 focus:ring-red-500
            ` : ''}
            
            /* Отступ для иконки пароля */
            ${isPassword ? 'pr-10' : ''}
            
            ${className}
          `.trim()}
        />
        
        {/* Иконка toggle password */}
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer
                       text-white 
                       transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;