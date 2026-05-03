import { POST } from './route';
import { describe, it, expect, vi } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the AI module
vi.mock('@google/generative-ai', () => {
  const mModel = {
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          events: [
            {
              title: "Test Event",
              date: "10 April 2024",
              description: "Test description",
              why_it_matters: "Test reason",
              next_action: "Test action"
            }
          ]
        })
      }
    })
  };
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return mModel;
      }
    }
  };
});

describe('Generate Timeline API', () => {
  it('returns 400 if required fields are missing', async () => {
    const req = new Request('http://localhost/api/generate-timeline', {
      method: 'POST',
      body: JSON.stringify({ state: 'Delhi' }) // Missing electionType and year
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns valid JSON timeline on success', async () => {
    const req = new Request('http://localhost/api/generate-timeline', {
      method: 'POST',
      body: JSON.stringify({ state: 'Delhi', electionType: 'Lok Sabha', year: '2024' })
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.events).toHaveLength(1);
    expect(data.events[0].title).toBe('Test Event');
  });
});
