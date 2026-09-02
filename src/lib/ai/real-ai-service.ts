import type {
  AIService,
  IntakeContext,
  IntakeResult,
  SummarizeConsultResult,
  CarePathwayProfile,
  SuggestCarePathwayResult,
  SuggestTestsInput,
  SuggestTestsResult,
} from './types';
import { MockAIService } from './mock-ai-service';

export class RealAIService implements AIService {
  private mock: MockAIService;
  private apiKey: string | undefined;

  constructor() {
    this.mock = new MockAIService();
    this.apiKey = (import.meta as ImportMeta).env?.VITE_OPENAI_API_KEY as
      | string
      | undefined;
  }

  private ensureConfigured(): void {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error(
        'RealAIService not configured — no API key available in environment',
      );
    }
  }

  async intakeSymptoms(
    symptoms: string,
    context?: IntakeContext,
  ): Promise<IntakeResult> {
    this.ensureConfigured();
    return Promise.resolve(this.mock.intakeSymptoms(symptoms, context));
  }

  async summarizeConsult(
    notes: string,
    history?: string[],
  ): Promise<SummarizeConsultResult> {
    this.ensureConfigured();
    return Promise.resolve(this.mock.summarizeConsult(notes, history));
  }

  async suggestCarePathway(
    profile: CarePathwayProfile,
  ): Promise<SuggestCarePathwayResult> {
    this.ensureConfigured();
    return Promise.resolve(this.mock.suggestCarePathway(profile));
  }

  async suggestTests(
    consult: SuggestTestsInput,
  ): Promise<SuggestTestsResult> {
    this.ensureConfigured();
    return Promise.resolve(this.mock.suggestTests(consult));
  }
}
