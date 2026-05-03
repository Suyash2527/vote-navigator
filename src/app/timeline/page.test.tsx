import { render, screen, fireEvent } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import TimelinePage from '@/app/timeline/page';

// Mock fetch
global.fetch = vi.fn();

describe('TimelinePage', () => {
  it('renders correctly', () => {
    render(<TimelinePage />);
    expect(screen.getByRole('heading', { name: /Mission Map/i })).toBeInTheDocument();
  });

  it('handles state selection', () => {
    render(<TimelinePage />);
    const select = screen.getByRole('combobox', { name: /State or Union Territory/i });
    fireEvent.change(select, { target: { value: 'Maharashtra' } });
    expect(select).toHaveValue('Maharashtra');
  });

  it('shows error on failed api call', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API failed'));
    
    render(<TimelinePage />);
    
    const stateSelect = screen.getByRole('combobox', { name: /State or Union Territory/i });
    fireEvent.change(stateSelect, { target: { value: 'Maharashtra' } });
    
    const typeSelect = screen.getByRole('combobox', { name: /Election Type/i });
    fireEvent.change(typeSelect, { target: { value: 'Lok Sabha (General Election)' } });
    
    const yearSelect = screen.getByRole('combobox', { name: /Election Year/i });
    fireEvent.change(yearSelect, { target: { value: '2024' } });

    const btn = screen.getByRole('button', { name: /Launch Mission Map/i });
    fireEvent.click(btn);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/Unable to generate timeline/i);
  });
});
