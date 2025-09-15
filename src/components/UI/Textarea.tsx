import React from 'react';
import { cn } from '../../utils/cn.js';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const textareaClasses = cn(
    'form-input',
    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
