import { POST } from './route';
import { describe, it, expect, vi } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';

vi.mock('@google/generative-ai', () => {
  const mModel = {
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          reply: "Test reply"
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

describe('Generate FAQ API', () => {
  it('returns 400 if message is missing', async () => {
    const req = new Request('http://localhost/api/faq', {
      method: 'POST',
      body: JSON.stringify({}) // Missing message
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns valid JSON answer on success', async () => {
    const req = new Request('http://localhost/api/faq', {
      method: 'POST',
      body: JSON.stringify({ message: 'How to vote?' })
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toBe('Test reply');
  });
});
