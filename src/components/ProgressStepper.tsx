import React from 'react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((_, index) => {
          if (index === steps.length - 1) return null;
          
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div
              key={`line-${index}`}
              className={`absolute top-4 sm:top-5 h-0.5 sm:h-1 w-full transition-all duration-300 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-200'
              }`}
              style={{
                left: `calc(${(index + 1) * (100 / steps.length)}% - ${(100 / steps.length) / 2}%)`,
                width: `calc(${100 / steps.length}% - 1.5rem)`,
                zIndex: 0
              }}
            />
          );
        })}
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = isCompleted || isActive;

          const handleStepClick = () => {
            if (isClickable && onStepClick) {
              onStepClick(stepNumber);
            }
          };

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative z-10">
              <button
                type="button"
                onClick={handleStepClick}
                disabled={!isClickable}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 touch-manipulation ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                    : isCompleted
                    ? 'bg-green-500 text-white shadow-md hover:bg-green-600 cursor-pointer active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } ${isClickable ? 'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Go to step ${stepNumber}: ${step}`}
                title={isClickable ? `Click to go to step ${stepNumber}` : 'Step not available yet'}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </button>
              <button
                type="button"
                onClick={handleStepClick}
                disabled={!isClickable}
                className={`mt-2 text-xs sm:text-sm font-medium text-center transition-colors duration-200 touch-manipulation ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : isCompleted
                    ? 'text-green-600 hover:text-green-700 cursor-pointer'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                aria-label={`Go to step ${stepNumber}: ${step}`}
                title={isClickable ? `Click to go to step ${stepNumber}` : 'Step not available yet'}
              >
                <span className="hidden sm:inline">{step}</span>
                <span className="sm:hidden">{step.split(' ')[0]}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
