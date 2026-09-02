export interface IntakeContext {
  age?: number;
  gender?: string;
  conditions?: string[];
  duration?: string;
}

export interface OrganizedIntake {
  symptoms: string[];
  duration: string;
  age?: number;
  gender?: string;
  conditions: string[];
}

export interface CarePathway {
  title: string;
  description: string;
  recommended: boolean;
}

export interface IntakeResult {
  organized: OrganizedIntake;
  suggestedSpecialty: string;
  suggestedDoctorIdHint?: string;
  followUpQuestions: string[];
  carePathways: CarePathway[];
  disclaimer: string;
}

export interface SummarizeConsultResult {
  summary: string[];
  keyObservations: string[];
  warnings: string[];
  suggestedFollowUp?: string;
}

export interface CarePathwayProfile {
  age: number;
  conditions: string[];
  recent: string;
}

export interface SuggestCarePathwayResult {
  recommended: string;
  options: string[];
  rationale: string;
}

export interface TestSuggestion {
  name: string;
  reason: string;
  priority: 'routine' | 'urgent';
}

export interface SuggestTestsInput {
  symptoms: string;
  findings?: string;
  history?: string[];
}

export interface SuggestTestsResult {
  tests: TestSuggestion[];
  disclaimer: string;
}

export interface AIService {
  intakeSymptoms(
    symptoms: string,
    context?: IntakeContext,
  ): Promise<IntakeResult>;

  summarizeConsult(
    notes: string,
    history?: string[],
  ): Promise<SummarizeConsultResult>;

  suggestCarePathway(
    profile: CarePathwayProfile,
  ): Promise<SuggestCarePathwayResult>;

  suggestTests(consult: SuggestTestsInput): Promise<SuggestTestsResult>;
}
