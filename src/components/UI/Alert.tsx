import React from 'react';
import { cn } from '../../utils/cn.js';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className = '',
  ...props
}) => {
  const baseClasses = 'p-4 rounded-lg border';
  
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    className
  );

  return (
    <div
      className={classes}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

