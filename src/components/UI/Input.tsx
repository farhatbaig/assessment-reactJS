import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Input component props interface
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below input */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the input is required */
  required?: boolean;
}

/**
 * Input Component
 * 
 * A comprehensive input component with:
 * - Label and error handling
 * - Helper text support
 * - Accessibility features
 * - Consistent styling with form theme
 * - Type safety
 * 
 * @component
 * @example
 * ```tsx
 * <Input
 *   label="Full Name"
 *   error={errors.name?.message}
 *   helperText="Enter your full legal name"
 *   required
 *   {...register('name')}
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  id,
  ...props
}, ref) => {
  /**
   * Generate unique ID for accessibility
   */
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;

  /**
   * Input classes with error state handling
   */
  const inputClasses = cn(
    'form-input',
    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="form-label"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      {/* Input Field */}
      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={cn(
          error && errorId,
          helperText && !error && helperId
        )}
        required={required}
        {...props}
      />
      
      {/* Error Message */}
      {error && (
        <p 
          id={errorId}
          className="form-error" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p 
          id={helperId}
          className="text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';