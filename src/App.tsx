import React from 'react';
import { FormProvider } from './contexts/FormContext';
import { FormWizard } from './components/FormWizard.tsx';
import { LanguageSwitcher } from './components/LanguageSwitcher.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './utils/i18n';

const App: React.FC = () => {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <LanguageSwitcher />
        <FormWizard />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </div>
    </FormProvider>
  );
};

export default App;