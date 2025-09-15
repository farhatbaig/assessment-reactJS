import { toast } from 'react-toastify';

interface ToastOptions {
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

const DEFAULT_TOAST_OPTIONS = {
  position: "top-right" as const,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const formatContent = (message: string, title?: string): string => {
  return title ? `${title}: ${message}` : message;
};

export const showSuccess = (
  message: string, 
  title?: string, 
  options: ToastOptions = {}
): void => {
  const content = formatContent(message, title);
  
  toast.success(content, {
    ...DEFAULT_TOAST_OPTIONS,
    autoClose: 5000,
    ...options
  });
};

export const showError = (
  message: string, 
  title?: string, 
  options: ToastOptions = {}
): void => {
  const content = formatContent(message, title);
  
  toast.error(content, {
    ...DEFAULT_TOAST_OPTIONS,
    autoClose: 7000,
    ...options
  });
};

export const showInfo = (
  message: string, 
  title?: string, 
  options: ToastOptions = {}
): void => {
  const content = formatContent(message, title);
  
  toast.info(content, {
    ...DEFAULT_TOAST_OPTIONS,
    autoClose: 5000,
    ...options
  });
};

export const showWarning = (
  message: string, 
  title?: string, 
  options: ToastOptions = {}
): void => {
  const content = formatContent(message, title);
  
  toast.warning(content, {
    ...DEFAULT_TOAST_OPTIONS,
    autoClose: 6000,
    ...options
  });
};

export const showLoading = (
  message: string, 
  title?: string, 
  options: ToastOptions = {}
): string | number => {
  const content = formatContent(message, title);
  
  return toast.loading(content, {
    ...DEFAULT_TOAST_OPTIONS,
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    ...options
  });
};

export const dismissAll = (): void => {
  toast.dismiss();
};

export const dismiss = (toastId: string | number): void => {
  toast.dismiss(toastId);
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  dismissAll,
  dismiss
};