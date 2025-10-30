"use client";

import { forwardRef } from 'react';

/**
 * Button Component - Accessible, Consistent, Multi-variant
 *
 * A comprehensive button component with multiple variants, sizes, and states.
 * Follows WCAG 2.1 AA accessibility guidelines with proper focus states and keyboard navigation.
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" size="lg" leftIcon={<Icon />}>With Icon</Button>
 * <Button variant="ghost" loading>Loading...</Button>
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles - consistent across all variants
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      select-none
    `;

    // Variant styles
    const variantStyles = {
      primary: `
        bg-theme-500 text-white
        hover:bg-theme-600 active:bg-theme-700
        focus:ring-theme-500
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-gray-100 text-gray-900
        hover:bg-gray-200 active:bg-gray-300
        focus:ring-gray-500
        border border-gray-300
      `,
      outline: `
        bg-transparent border-2 border-theme-500
        text-theme-600 hover:bg-theme-50
        active:bg-theme-100
        focus:ring-theme-500
      `,
      ghost: `
        bg-transparent text-theme-600
        hover:bg-theme-50 active:bg-theme-100
        focus:ring-theme-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700 active:bg-red-800
        focus:ring-red-500
        shadow-sm hover:shadow-md
      `,
      success: `
        bg-green-600 text-white
        hover:bg-green-700 active:bg-green-800
        focus:ring-green-500
        shadow-sm hover:shadow-md
      `,
      link: `
        bg-transparent text-theme-600
        hover:text-theme-700 hover:underline
        active:text-theme-800
        focus:ring-theme-500
        p-0 h-auto
      `,
    };

    // Size styles
    const sizeStyles = {
      xs: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
      sm: 'px-4 py-2 text-sm rounded-md gap-2',
      md: 'px-6 py-2.5 text-base rounded-lg gap-2',
      lg: 'px-8 py-3 text-lg rounded-lg gap-2.5',
      xl: 'px-10 py-4 text-xl rounded-xl gap-3',
    };

    // Icon sizes
    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    const fullWidthStyle = fullWidth ? 'w-full' : '';

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${variant !== 'link' ? sizeStyles[size] : ''}
      ${fullWidthStyle}
      ${className}
    `.trim();

    const handleClick = (e) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={combinedClassName}
        onClick={handleClick}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className={`animate-spin ${iconSizes[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && leftIcon && (
          <span className={iconSizes[size]} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span>{children}</span>

        {!loading && rightIcon && (
          <span className={iconSizes[size]} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Additional button variants for specific use cases

export const IconButton = forwardRef(
  ({ icon, label, size = 'md', variant = 'ghost', className = '', ...props }, ref) => {
    const sizeClasses = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
    };

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        className={`${sizeClasses[size]} !px-0 rounded-full aspect-square ${className}`}
        aria-label={label}
        {...props}
      >
        <span className={iconSizes[size]} aria-hidden="true">
          {icon}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`} role="group">
      {children}
    </div>
  );
};
