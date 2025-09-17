import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { ProgressStepper } from '../ProgressStepper';

describe('ProgressStepper Component', () => {
  const mockSteps = ['Step 1', 'Step 2', 'Step 3'];
  const mockOnStepClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all steps', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={1} />);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('shows current step as active', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={2} />);
    
    const step2Button = screen.getByRole('button', { name: /go to step 2/i });
    expect(step2Button).toHaveClass('bg-blue-600', 'text-white');
    expect(step2Button).toHaveAttribute('aria-current', 'step');
  });

  it('shows completed steps with checkmark', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={3} />);
    
    const step1Button = screen.getByRole('button', { name: /go to step 1/i });
    const step2Button = screen.getByRole('button', { name: /go to step 2/i });
    
    expect(step1Button).toHaveClass('bg-green-500', 'text-white');
    expect(step2Button).toHaveClass('bg-green-500', 'text-white');
    
    // Check for checkmark SVG
    expect(step1Button.querySelector('svg')).toBeInTheDocument();
    expect(step2Button.querySelector('svg')).toBeInTheDocument();
  });

  it('shows future steps as disabled', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={1} />);
    
    const step2Button = screen.getByRole('button', { name: /go to step 2/i });
    const step3Button = screen.getByRole('button', { name: /go to step 3/i });
    
    expect(step2Button).toHaveClass('bg-gray-200', 'text-gray-500', 'cursor-not-allowed');
    expect(step3Button).toHaveClass('bg-gray-200', 'text-gray-500', 'cursor-not-allowed');
    expect(step2Button).toBeDisabled();
    expect(step3Button).toBeDisabled();
  });

  it('calls onStepClick when clicking on completed step', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={3} onStepClick={mockOnStepClick} />);
    
    const step1Button = screen.getByRole('button', { name: /go to step 1/i });
    fireEvent.click(step1Button);
    
    expect(mockOnStepClick).toHaveBeenCalledWith(1);
  });

  it('calls onStepClick when clicking on current step', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={2} onStepClick={mockOnStepClick} />);
    
    const step2Button = screen.getByRole('button', { name: /go to step 2/i });
    fireEvent.click(step2Button);
    
    expect(mockOnStepClick).toHaveBeenCalledWith(2);
  });

  it('does not call onStepClick when clicking on future step', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={1} onStepClick={mockOnStepClick} />);
    
    const step3Button = screen.getByRole('button', { name: /go to step 3/i });
    fireEvent.click(step3Button);
    
    expect(mockOnStepClick).not.toHaveBeenCalled();
  });

  it('shows abbreviated text on mobile', () => {
    // Mock window.innerWidth to simulate mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    render(<ProgressStepper steps={['Personal Information', 'Family Details', 'Situation Description']} currentStep={1} />);
    
    // Should show abbreviated text (first word) on mobile
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Situation')).toBeInTheDocument();
  });

  it('shows full text on desktop', () => {
    // Mock window.innerWidth to simulate desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(<ProgressStepper steps={['Personal Information', 'Family Details', 'Situation Description']} currentStep={1} />);
    
    // Should show full text on desktop
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Family Details')).toBeInTheDocument();
    expect(screen.getByText('Situation Description')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={2} />);
    
    const step2Button = screen.getByRole('button', { name: /go to step 2/i });
    expect(step2Button).toHaveAttribute('aria-current', 'step');
    expect(step2Button).toHaveAttribute('aria-label', 'Go to step 2: Step 2');
    expect(step2Button).toHaveAttribute('title', 'Click to go to step 2');
  });

  it('handles single step', () => {
    render(<ProgressStepper steps={['Only Step']} currentStep={1} />);
    
    expect(screen.getByText('Only Step')).toBeInTheDocument();
    const stepButton = screen.getByRole('button', { name: /go to step 1/i });
    expect(stepButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('works without onStepClick prop', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={2} />);
    
    const step1Button = screen.getByRole('button', { name: /go to step 1/i });
    expect(() => fireEvent.click(step1Button)).not.toThrow();
  });
});
