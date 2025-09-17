import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { FormWizard } from '../FormWizard';

// Mock the FormContext
const mockSetCurrentStep = vi.fn();
const mockSetError = vi.fn();

vi.mock('../../contexts/FormContext', () => ({
  useFormContext: () => ({
    currentStep: 1,
    setCurrentStep: mockSetCurrentStep,
    error: null,
    setError: mockSetError
  })
}));

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'steps.step1': 'Personal Information',
        'steps.step2': 'Family & Financial',
        'steps.step3': 'Situation Description',
        'app.title': 'Social Support Application',
        'app.subtitle': 'Apply for government financial assistance',
        'buttons.closeError': 'Close error message'
      };
      return translations[key] || key;
    }
  })
}));

// Mock the step components
vi.mock('../steps/PersonalInfoStep', () => ({
  PersonalInfoStep: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="personal-info-step">
      <h2>Personal Information</h2>
      <button onClick={onNext}>Next</button>
    </div>
  )
}));

vi.mock('../steps/FamilyFinancialStep', () => ({
  FamilyFinancialStep: ({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) => (
    <div data-testid="family-financial-step">
      <h2>Family & Financial</h2>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  )
}));

vi.mock('../steps/SituationDescriptionsStep', () => ({
  SituationDescriptionsStep: ({ onPrevious, onSubmit }: { onPrevious: () => void; onSubmit: () => void }) => (
    <div data-testid="situation-descriptions-step">
      <h2>Situation Description</h2>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}));

describe('FormWizard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main title and subtitle', () => {
    render(<FormWizard />);
    
    expect(screen.getByText('Social Support Application')).toBeInTheDocument();
    expect(screen.getByText('Apply for government financial assistance')).toBeInTheDocument();
  });

  it('renders progress stepper', () => {
    render(<FormWizard />);
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Family & Financial')).toBeInTheDocument();
    expect(screen.getByText('Situation Description')).toBeInTheDocument();
  });

  it('renders first step by default', () => {
    render(<FormWizard />);
    
    expect(screen.getByTestId('personal-info-step')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('handles step navigation', () => {
    render(<FormWizard />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
  });

  it('does not show error alert when no error', () => {
    render(<FormWizard />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has proper main content structure', () => {
    render(<FormWizard />);
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveAttribute('id', 'main-content');
    expect(mainContent).toHaveAttribute('tabIndex', '-1');
  });

  it('has proper form progress section', () => {
    render(<FormWizard />);
    
    const progressSection = screen.getByLabelText('Form progress');
    expect(progressSection).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<FormWizard />);
    
    const mainContainer = screen.getByText('Social Support Application').closest('div');
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
  });
});

// Test with error state
describe('FormWizard Component with Error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error alert when error is present', () => {
    // Mock FormContext with error
    vi.mocked(require('../../contexts/FormContext').useFormContext).mockReturnValue({
      currentStep: 1,
      setCurrentStep: mockSetCurrentStep,
      error: 'Test error message',
      setError: mockSetError
    });

    render(<FormWizard />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('dismisses error when close button is clicked', () => {
    // Mock FormContext with error
    vi.mocked(require('../../contexts/FormContext').useFormContext).mockReturnValue({
      currentStep: 1,
      setCurrentStep: mockSetCurrentStep,
      error: 'Test error message',
      setError: mockSetError
    });

    render(<FormWizard />);
    
    const closeButton = screen.getByLabelText('Close error message');
    fireEvent.click(closeButton);
    
    expect(mockSetError).toHaveBeenCalledWith(null);
  });
});

// Test different step states
describe('FormWizard Component - Different Steps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders second step when currentStep is 2', () => {
    vi.mocked(require('../../contexts/FormContext').useFormContext).mockReturnValue({
      currentStep: 2,
      setCurrentStep: mockSetCurrentStep,
      error: null,
      setError: mockSetError
    });

    render(<FormWizard />);
    
    expect(screen.getByTestId('family-financial-step')).toBeInTheDocument();
    expect(screen.getByText('Family & Financial')).toBeInTheDocument();
  });

  it('renders third step when currentStep is 3', () => {
    vi.mocked(require('../../contexts/FormContext').useFormContext).mockReturnValue({
      currentStep: 3,
      setCurrentStep: mockSetCurrentStep,
      error: null,
      setError: mockSetError
    });

    render(<FormWizard />);
    
    expect(screen.getByTestId('situation-descriptions-step')).toBeInTheDocument();
    expect(screen.getByText('Situation Description')).toBeInTheDocument();
  });

  it('handles form submission completion', () => {
    vi.mocked(require('../../contexts/FormContext').useFormContext).mockReturnValue({
      currentStep: 3,
      setCurrentStep: mockSetCurrentStep,
      error: null,
      setError: mockSetError
    });

    render(<FormWizard />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith(1);
    expect(mockSetError).toHaveBeenCalledWith(null);
  });
});
