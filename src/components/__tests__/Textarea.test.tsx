import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Textarea } from '../ui/Textarea';

describe('Textarea Component', () => {
  it('renders textarea with label', () => {
    render(<Textarea label="Test Label" />);
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders textarea without label', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Textarea label="Test Textarea" error="This field is required" />);
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(<Textarea label="Test Textarea" helperText="This is helper text" />);
    expect(screen.getByText(/this is helper text/i)).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(
      <Textarea 
        label="Test Textarea" 
        error="Error message" 
        helperText="Helper text" 
      />
    );
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
    expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
  });

  it('handles text changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test content' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('test content');
  });

  it('applies error styling when error is present', () => {
    render(<Textarea label="Test Textarea" error="Error message" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-red-300');
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('has minimum height styling', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('min-h-[120px]');
  });

  it('has resize-y styling', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-y');
  });

  it('accepts placeholder text', () => {
    render(<Textarea placeholder="Enter your message here" />);
    expect(screen.getByPlaceholderText(/enter your message here/i)).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('handles required attribute', () => {
    render(<Textarea required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });
});
