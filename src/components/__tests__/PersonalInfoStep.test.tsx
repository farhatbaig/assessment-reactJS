import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { PersonalInfoStep } from '../steps/PersonalInfoStep';

// Mock the FormContext
const mockUpdateFormData = vi.fn();
const mockSetError = vi.fn();

vi.mock('../../../contexts/FormContext', () => ({
  useFormContext: () => ({
    formData: {},
    updateFormData: mockUpdateFormData,
    setError: mockSetError
  })
}));

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'steps.personalInfo.title': 'Personal Information',
        'steps.personalInfo.subtitle': 'Please provide your personal details',
        'form.fields.name': 'Full Name',
        'form.fields.email': 'Email Address',
        'form.fields.phone': 'Phone Number',
        'form.fields.nationalId': 'National ID',
        'form.fields.dateOfBirth': 'Date of Birth',
        'form.fields.gender': 'Gender',
        'form.fields.address': 'Address',
        'form.fields.city': 'City',
        'form.fields.state': 'State/Province',
        'form.fields.country': 'Country',
        'buttons.next': 'Next',
        'buttons.previous': 'Previous',
        'validation.required': 'This field is required',
        'validation.email': 'Please enter a valid email address'
      };
      return translations[key] || key;
    }
  })
}));

describe('PersonalInfoStep Component', () => {
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the step title and subtitle', () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Please provide your personal details')).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/national id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const nextButton = screen.getByText('Next');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('calls onNext when form is valid', async () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/national id/i), { target: { value: '1234567890123' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'us' } });
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });

  it('calls updateFormData with correct data when form is valid', async () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/national id/i), { target: { value: '1234567890123' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'us' } });
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        nationalId: '1234567890123',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'us'
      });
    });
  });

  it('shows loading state on next button when submitting', async () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/national id/i), { target: { value: '1234567890123' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'us' } });
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    // Button should be disabled during submission
    expect(nextButton).toBeDisabled();
  });

  it('handles form reset', () => {
    render(<PersonalInfoStep onNext={mockOnNext} />);
    
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput.value).toBe('John Doe');
    
    // Simulate form reset (this would typically be triggered by a reset button or form context)
    fireEvent.change(nameInput, { target: { value: '' } });
    
    expect(nameInput.value).toBe('');
  });
});
