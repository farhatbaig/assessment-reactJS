import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './utils/i18n.js'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
      }} showDetails={import.meta.env.MODE === 'development'}>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
