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

export class MockAIService implements AIService {
  async intakeSymptoms(
    symptoms: string,
    context?: IntakeContext,
  ): Promise<IntakeResult> {
    const lowerSymptoms = symptoms.toLowerCase();
    let specialty = 'General Medicine';
    let doctorHint: string | undefined;

    if (lowerSymptoms.includes('chest') || lowerSymptoms.includes('palpitation')) {
      specialty = 'Cardiology';
      doctorHint = 'cardio-dr-001';
    } else if (
      lowerSymptoms.includes('rash') ||
      lowerSymptoms.includes('skin') ||
      lowerSymptoms.includes('itching') ||
      lowerSymptoms.includes('eczema')
    ) {
      specialty = 'Dermatology';
      doctorHint = 'derm-dr-001';
    } else if (
      lowerSymptoms.includes('headache') ||
      lowerSymptoms.includes('fever')
    ) {
      specialty = 'General Medicine';
      doctorHint = 'genmed-dr-001';
    }

    const symptomsList = symptoms
      .split(/[,;.\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return {
      organized: {
        symptoms: symptomsList.length > 0 ? symptomsList : ['Reported symptoms'],
        duration: context?.duration ?? 'Not specified',
        age: context?.age,
        gender: context?.gender,
        conditions: context?.conditions ?? [],
      },
      suggestedSpecialty: specialty,
      suggestedDoctorIdHint: doctorHint,
      followUpQuestions: [
        'Is the pain worse at specific times of day?',
        'Any medications currently being taken?',
        'Any known allergies?',
        'Recent travel or sick contacts?',
      ],
      carePathways: [
        {
          title: 'In-Person Consultation',
          description: 'Book a face-to-face visit with a specialist for a thorough physical examination and diagnosis.',
          recommended: true,
        },
        {
          title: 'Telehealth Video Visit',
          description: 'Connect with a provider remotely via secure video call for initial assessment and guidance.',
          recommended: false,
        },
        {
          title: 'At-Home Self-Care Monitoring',
          description: 'Track symptoms with our guided self-care checklist and follow up if condition worsens.',
          recommended: false,
        },
      ],
      disclaimer:
        'This is an informational care-navigation prototype and does not provide a medical diagnosis.',
    };
  }

  async summarizeConsult(
    notes: string,
    history?: string[],
  ): Promise<SummarizeConsultResult> {
    void notes;
    void history;

    return {
      summary: [
        'Patient presented with primary complaints as documented in consult notes.',
        'Vital signs and physical findings recorded as per examination.',
        'Initial differential considerations noted for further workup.',
      ],
      keyObservations: [
        'Chief complaint documented and correlated with reported duration.',
        'Relevant past medical history and allergies reviewed.',
        'Physical examination findings summarized for clinical record.',
      ],
      warnings: ['Verify before clinical use'],
      suggestedFollowUp:
        'Schedule follow-up appointment in 2 weeks to reassess and review test results.',
    };
  }

  async suggestCarePathway(
    profile: CarePathwayProfile,
  ): Promise<SuggestCarePathwayResult> {
    void profile;

    return {
      recommended: 'In-Person Specialist Consultation',
      options: [
        'In-Person Specialist Consultation',
        'Primary Care Follow-Up Visit',
        'Telehealth Triage Appointment',
        'Chronic Care Management Program',
      ],
      rationale:
        'Based on the patient profile and recent clinical activity, an in-person specialist consultation provides the most comprehensive assessment to address the reported conditions and ensure appropriate diagnostic workup.',
    };
  }

  async suggestTests(
    consult: SuggestTestsInput,
  ): Promise<SuggestTestsResult> {
    void consult;

    return {
      tests: [
        {
          name: 'Complete Blood Count (CBC)',
          reason: 'To evaluate overall blood health, detect infections, anemia, or other abnormalities.',
          priority: 'routine',
        },
        {
          name: 'Basic Metabolic Panel (BMP)',
          reason: 'To assess kidney function, electrolyte balance, and blood glucose levels.',
          priority: 'routine',
        },
        {
          name: 'C-Reactive Protein (CRP)',
          reason: 'To measure inflammation levels and aid in identifying underlying inflammatory conditions.',
          priority: 'urgent',
        },
      ],
      disclaimer: 'Suggestions only — clinician decides final orders.',
    };
  }
}
