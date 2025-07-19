import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const initializeGemini = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

export const getGeminiModel = (model = 'gemini-1.5-flash') => {
  const client = initializeGemini();
  return client.getGenerativeModel({ model });
};

export default () => initializeGemini();