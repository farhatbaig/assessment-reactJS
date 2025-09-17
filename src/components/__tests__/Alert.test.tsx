import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Alert } from '../ui/Alert';

describe('Alert Component', () => {
  it('renders alert with children', () => {
    render(<Alert>Test alert message</Alert>);
    expect(screen.getByText('Test alert message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies info variant by default', () => {
    render(<Alert>Info alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });

  it('applies success variant', () => {
    render(<Alert variant="success">Success alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
  });

  it('applies warning variant', () => {
    render(<Alert variant="warning">Warning alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');
  });

  it('applies error variant', () => {
    render(<Alert variant="error">Error alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
  });

  it('applies custom className', () => {
    render(<Alert className="custom-class">Custom alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });

  it('has base styling classes', () => {
    render(<Alert>Base alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('p-4', 'rounded-lg', 'border');
  });

  it('renders complex children', () => {
    render(
      <Alert>
        <div>
          <h3>Alert Title</h3>
          <p>Alert description with <strong>bold text</strong></p>
        </div>
      </Alert>
    );
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description with')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
  });

  it('forwards additional props', () => {
    render(<Alert data-testid="custom-alert">Test alert</Alert>);
    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
  });

  it('maintains role="alert" for accessibility', () => {
    render(<Alert variant="error">Critical error</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });
});
