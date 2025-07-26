import axios, { AxiosError } from 'axios';
import { CONFIG } from '@/core/config';
import { sleep } from '@/util/sleep';
import { LOGGER } from '@/core/logger';

export const createAiChatClient = () => {
  const callGroq = async (prompt: string): Promise<string> => {
    const headers = {
      Authorization: `Bearer ${CONFIG.groq.apiKey}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.post(CONFIG.groq.chatUrl, payload, {
          headers,
        });
        return response.data.choices[0].message?.content?.trim();
      } catch (error: any) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.error?.message || error.message
            : error.message;

        if (message.includes('TPM')) {
          const wait = parseFloat(
            message.match(/try again in (\d+(\.\d+)?)s/)?.[1] || '10'
          );
          LOGGER.warn(`TPM limit reached. Waiting ${wait}s...`);
          await sleep(wait * 1000);
          continue;
        }

        if (message.includes('TPD') || message.includes('daily limit')) {
          throw new Error('GROQ daily limit reached');
        }

        LOGGER.error(`Groq error: ${message}`);
        throw new Error(`Groq error: ${message}`);
      }
    }

    throw new Error('Failed to get Groq response after multiple attempts.');
  };

  const callOpenRouter = async (prompt: string): Promise<string> => {
    const headers = {
      Authorization: `Bearer ${CONFIG.openrouter.apiKey}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      model: 'meta-llama/llama-3-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    };

    const response = await axios.post(CONFIG.openrouter.chatUrl, payload, {
      headers,
    });

    return response.data.choices[0].message?.content?.trim();
  };

  const chat = async (prompt: string): Promise<string> => {
    try {
      return await callGroq(prompt);
    } catch (err: any) {
      if (err.message.includes('daily limit')) {
        LOGGER.warn('Switching to OpenRouter...');
        return await callOpenRouter(prompt);
      }
      throw err;
    }
  };

  return {
    chat,
  };
};
