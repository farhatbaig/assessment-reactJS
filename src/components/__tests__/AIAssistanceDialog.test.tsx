import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { AIAssistanceDialog } from '../AIAssistanceDialog';

// Mock the AI service
const mockGetAIAssistance = vi.fn();
vi.mock('../../services/aiService', () => ({
  getAIAssistance: mockGetAIAssistance
}));

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'ai.title': 'AI Assistant',
        'ai.description': 'Get help with your form',
        'ai.inputPlaceholder': 'Ask a question...',
        'ai.sendButton': 'Send',
        'ai.closeButton': 'Close',
        'ai.loading': 'Thinking...',
        'ai.error': 'Something went wrong. Please try again.'
      };
      return translations[key] || key;
    }
  })
}));

describe('AIAssistanceDialog Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    context: 'personal information form',
    fieldType: 'text',
    currentValue: '',
    onAccept: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<AIAssistanceDialog {...mockProps} />);
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Get help with your form')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AIAssistanceDialog {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AIAssistanceDialog {...mockProps} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('handles user input and sends message', async () => {
    mockGetAIAssistance.mockResolvedValue('Here is some help with your form.');
    
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'How do I fill this out?' } });
    fireEvent.click(sendButton);
    
    expect(mockGetAIAssistance).toHaveBeenCalledWith('How do I fill this out?', 'personal information form');
    
    await waitFor(() => {
      expect(screen.getByText('Here is some help with your form.')).toBeInTheDocument();
    });
  });

  it('shows loading state while processing', async () => {
    mockGetAIAssistance.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('Response'), 100)));
    
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(sendButton);
    
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });
  });

  it('shows error message when AI service fails', async () => {
    mockGetAIAssistance.mockRejectedValue(new Error('API Error'));
    
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });

  it('clears input after sending message', async () => {
    mockGetAIAssistance.mockResolvedValue('Response');
    
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...') as HTMLInputElement;
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('disables send button when input is empty', () => {
    render(<AIAssistanceDialog {...mockProps} />);
    
    const sendButton = screen.getByText('Send');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has content', () => {
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Test question' } });
    
    expect(sendButton).not.toBeDisabled();
  });

  it('handles Enter key to send message', async () => {
    mockGetAIAssistance.mockResolvedValue('Response');
    
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockGetAIAssistance).toHaveBeenCalledWith('Test question', 'personal information form');
  });

  it('displays conversation history', async () => {
    mockGetAIAssistance.mockResolvedValue('Response');
    
    render(<AIAssistanceDialog {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByText('Send');
    
    // Send first message
    fireEvent.change(input, { target: { value: 'First question' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('First question')).toBeInTheDocument();
      expect(screen.getByText('Response')).toBeInTheDocument();
    });
    
    // Send second message
    fireEvent.change(input, { target: { value: 'Second question' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Second question')).toBeInTheDocument();
    });
    
    // Both messages should be visible
    expect(screen.getByText('First question')).toBeInTheDocument();
    expect(screen.getByText('Response')).toBeInTheDocument();
  });
});
