import { forwardRef, ReactElement, ForwardRefRenderFunction } from 'react';
import { IconType } from 'react-icons';

// Define the variant types
type ButtonVariant = 'default' | 'primary' | 'danger';

// Define the props interface for type safety
interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  label?: string;
  onClick?: () => void;
  className?: string;
  iconSize?: number;
  variant?: ButtonVariant;
}

// Create the ButtonIcon component with proper TypeScript typing
const ButtonIcon: ForwardRefRenderFunction<HTMLButtonElement, ButtonIconProps> = (
  {
    icon: Icon,
    label,
    onClick,
    className = '',
    iconSize = 20,
    variant = 'default',
    ...props
  },
  ref
) => {
  // Define variant styles with type safety
  const variantStyles: Record<ButtonVariant, string> = {
    default: `
      bg-white 
      text-gray-600 
      hover:bg-gray-50 
      hover:text-gray-900 
      dark:bg-gray-800 
      dark:text-gray-300 
      dark:hover:bg-gray-700 
      dark:hover:text-white
    `,
    primary: `
      bg-primary-500 
      text-white 
      hover:bg-primary-600 
      dark:bg-primary-600 
      dark:hover:bg-primary-700
    `,
    danger: `
      bg-red-500 
      text-white 
      hover:bg-red-600 
      dark:bg-red-600 
      dark:hover:bg-red-700
    `
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`
        p-2 
        rounded-lg 
        flex 
        items-center 
        justify-center 
        transition-all 
        duration-200 
        shadow-sm 
        border 
        border-gray-200 
        hover:shadow-md 
        hover:-translate-y-0.5 
        active:translate-y-0 
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-primary-500 
        focus-visible:ring-offset-2 
        dark:border-gray-700 
        dark:shadow-none 
        dark:hover:shadow-sm
        dark:focus-visible:ring-offset-gray-900
        ${variantStyles[variant]}
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      <Icon 
        size={iconSize} 
        className="transition-transform duration-300 hover:rotate-[15deg]" 
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
};

// Add display name and forward ref
const ForwardRefButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(ButtonIcon);
ForwardRefButtonIcon.displayName = 'ButtonIcon';

export default ForwardRefButtonIcon;