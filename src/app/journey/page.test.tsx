import { render, screen, fireEvent } from '@/test/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JourneyPage from '@/app/journey/page';

// Mock fetch
global.fetch = vi.fn();

describe('JourneyPage', () => {
  beforeEach(() => {
    localStorage.setItem('voterPersona', 'first-time');
  });

  it('renders loading state initially', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Hangs forever
    render(<JourneyPage />);
    expect(screen.getByText(/Generating your personalized/i)).toBeInTheDocument();
  });

  it('shows error on failed api call', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API failed'));
    
    render(<JourneyPage />);
    
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/We ran into a problem/i);
  });

  it('renders journey steps successfully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({
        steps: [
          {
            title: "Test Step",
            description: "Test Description",
            why_it_matters: "Test Matters",
            next_action: "Test Action"
          }
        ]
      })
    });

    render(<JourneyPage />);
    
    const title = await screen.findByText('Test Step');
    expect(title).toBeInTheDocument();
  });
});
