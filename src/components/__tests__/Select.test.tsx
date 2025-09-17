import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Select } from '../ui/Select';

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  it('renders select with label', () => {
    render(<Select label="Test Label" options={mockOptions} />);
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders select without label', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<Select placeholder="Choose an option" options={mockOptions} />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select label="Test Select" error="This field is required" options={mockOptions} />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(<Select label="Test Select" helperText="This is helper text" options={mockOptions} />);
    expect(screen.getByText(/this is helper text/i)).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(
      <Select 
        label="Test Select" 
        error="Error message" 
        helperText="Helper text" 
        options={mockOptions}
      />
    );
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
    expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
  });

  it('handles selection changes', () => {
    const handleChange = vi.fn();
    render(<Select onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue('option2');
  });

  it('applies error styling when error is present', () => {
    render(<Select label="Test Select" error="Error message" options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-300');
  });

  it('applies custom className', () => {
    render(<Select className="custom-class" options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Select ref={ref} options={mockOptions} />);
    expect(ref).toHaveBeenCalled();
  });

  it('handles empty options array', () => {
    render(<Select options={[]} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // Should only have the placeholder option
    expect(select.children).toHaveLength(1);
  });

  it('sets default value', () => {
    render(<Select defaultValue="option2" options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
  });
});
