import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    console.error('Error Report:', errorReport);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        console.log('Error details copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy error details:', err);
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return <ErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        showDetails={this.props.showDetails}
        onRetry={this.handleRetry}
        onReload={this.handleReload}
        onCopyDetails={this.copyErrorDetails}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  showDetails?: boolean;
  onRetry: () => void;
  onReload: () => void;
  onCopyDetails: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  showDetails = false,
  onRetry,
  onReload,
  onCopyDetails
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('error.title', 'Something went wrong')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('error.description', 'We apologize for the inconvenience. An unexpected error has occurred.')}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            {t('error.errorId', 'Error ID')}: {errorId}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onRetry} variant="primary">
              {t('error.retry', 'Try Again')}
            </Button>
            <Button onClick={onReload} variant="outline">
              {t('error.reload', 'Reload Page')}
            </Button>
          </div>

          {showDetails && error && (
            <Alert variant="error" className="mt-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    {t('error.details', 'Error Details')}:
                  </h3>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {error.message}
                  </p>
                </div>
                
                {error.stack && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium mb-2">
                      {t('error.stackTrace', 'Stack Trace')}
                    </summary>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </details>
                )}

                {errorInfo?.componentStack && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium mb-2">
                      {t('error.componentStack', 'Component Stack')}
                    </summary>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                <Button 
                  onClick={onCopyDetails} 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  {t('error.copyDetails', 'Copy Error Details')}
                </Button>
              </div>
            </Alert>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t('error.help', 'If this problem persists, please contact support with the Error ID above.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for programmatically triggering error boundary
export const useErrorHandler = () => {
  const throwError = (error: Error) => {
    throw error;
  };

  const throwAsyncError = (error: Error) => {
    // For async errors, we need to use setTimeout to throw in the next tick
    setTimeout(() => {
      throw error;
    }, 0);
  };

  return { throwError, throwAsyncError };
};

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryClass {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export const ErrorBoundary = ErrorBoundaryClass;
