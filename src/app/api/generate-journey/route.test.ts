import { POST } from './route';
import { describe, it, expect, vi } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the AI module
vi.mock('@google/generative-ai', () => {
  const mModel = {
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          steps: [
            {
              title: "Test Step",
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

describe('Generate Journey API', () => {
  it('returns 400 if persona is missing', async () => {
    const req = new Request('http://localhost/api/generate-journey', {
      method: 'POST',
      body: JSON.stringify({}) // Missing persona
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns valid JSON journey on success', async () => {
    const req = new Request('http://localhost/api/generate-journey', {
      method: 'POST',
      body: JSON.stringify({ persona: 'first-time' })
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.steps).toHaveLength(1);
    expect(data.steps[0].title).toBe('Test Step');
  });
});
