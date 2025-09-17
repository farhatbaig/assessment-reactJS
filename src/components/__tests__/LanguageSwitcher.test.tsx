import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock the hook
const mockSwitchLanguage = vi.fn();
const mockGetCurrentLanguage = vi.fn();
const mockIsRTL = vi.fn();
const mockAvailableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

vi.mock('../../hooks/useInternationalization', () => ({
  useLanguageSwitcher: () => ({
    switchLanguage: mockSwitchLanguage,
    getCurrentLanguage: mockGetCurrentLanguage,
    isRTL: mockIsRTL,
    availableLanguages: mockAvailableLanguages
  })
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentLanguage.mockReturnValue('en');
    mockIsRTL.mockReturnValue(false);
  });

  it('renders language buttons', () => {
    render(<LanguageSwitcher />);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('shows current language as primary variant', () => {
    mockGetCurrentLanguage.mockReturnValue('en');
    render(<LanguageSwitcher />);
    
    const englishButton = screen.getByRole('button', { name: /switch to english/i });
    const arabicButton = screen.getByRole('button', { name: /switch to arabic/i });
    
    expect(englishButton).toHaveClass('bg-blue-600');
    expect(arabicButton).toHaveClass('border');
  });

  it('calls switchLanguage when clicking a language button', () => {
    render(<LanguageSwitcher />);
    
    const arabicButton = screen.getByRole('button', { name: /switch to arabic/i });
    fireEvent.click(arabicButton);
    
    expect(mockSwitchLanguage).toHaveBeenCalledWith('ar');
  });

  it('positions correctly for LTR languages', () => {
    mockIsRTL.mockReturnValue(false);
    render(<LanguageSwitcher />);
    
    const container = screen.getByRole('region', { name: /language selection/i });
    expect(container).toHaveClass('right-4');
  });

  it('positions correctly for RTL languages', () => {
    mockIsRTL.mockReturnValue(true);
    render(<LanguageSwitcher />);
    
    const container = screen.getByRole('region', { name: /language selection/i });
    expect(container).toHaveClass('left-4');
  });

  it('has proper accessibility attributes', () => {
    mockGetCurrentLanguage.mockReturnValue('en');
    render(<LanguageSwitcher />);
    
    const englishButton = screen.getByRole('button', { name: /switch to english/i });
    const arabicButton = screen.getByRole('button', { name: /switch to arabic/i });
    
    expect(englishButton).toHaveAttribute('aria-pressed', 'true');
    expect(arabicButton).toHaveAttribute('aria-pressed', 'false');
    expect(englishButton).toHaveAttribute('aria-label', 'Switch to English');
    expect(arabicButton).toHaveAttribute('aria-label', 'Switch to Arabic');
  });

  it('has proper region role and label', () => {
    render(<LanguageSwitcher />);
    
    const region = screen.getByRole('region', { name: /language selection/i });
    expect(region).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<LanguageSwitcher />);
    
    const container = screen.getByRole('region', { name: /language selection/i });
    expect(container).toHaveClass('fixed', 'top-4', 'z-50');
    
    const buttonContainer = container.querySelector('div');
    expect(buttonContainer).toHaveClass('flex', 'space-x-2', 'bg-white', 'rounded-lg', 'shadow-lg', 'p-1', 'border');
  });

  it('handles multiple language switches', () => {
    render(<LanguageSwitcher />);
    
    const englishButton = screen.getByRole('button', { name: /switch to english/i });
    const arabicButton = screen.getByRole('button', { name: /switch to arabic/i });
    
    fireEvent.click(arabicButton);
    fireEvent.click(englishButton);
    
    expect(mockSwitchLanguage).toHaveBeenCalledWith('ar');
    expect(mockSwitchLanguage).toHaveBeenCalledWith('en');
    expect(mockSwitchLanguage).toHaveBeenCalledTimes(2);
  });
});
