import type { AIService } from './types';
import { MockAIService } from './mock-ai-service';
import { RealAIService } from './real-ai-service';

export * from './types';
export { MockAIService } from './mock-ai-service';
export { RealAIService } from './real-ai-service';

export function createAIService(): AIService {
  return new MockAIService();
  // const env = (import.meta as ImportMeta).env;
  // if (env?.VITE_OPENAI_API_KEY && env.VITE_OPENAI_API_KEY.trim().length > 0) {
  //   return new RealAIService();
  // }
  // return new MockAIService();
}
