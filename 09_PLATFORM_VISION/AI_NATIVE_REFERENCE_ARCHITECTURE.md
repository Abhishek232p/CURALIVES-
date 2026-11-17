# AI-Native Health Network — Reference Architecture

**Status:** Proposed logical architecture; implementation choices require technical review.

## 1. Architecture overview

The platform should be organized as a set of governed capabilities, not one giant AI agent with unrestricted database access.

Logical layers:
1. Experience layer — provider workspace, patient/caregiver app, partner portal, operations console.
2. Identity and trust — authentication, organization membership, professional credentials, patient identity, caregiver delegation.
3. Consent and authorization — purpose, scope, duration, policy evaluation, revocation and emergency access rules.
4. Care domain services — patient, encounter, record, medication, prescription, appointment, referral, diagnostic order/result, follow-up and fulfilment.
5. Network services — provider directory, branch/location, serviceability, availability, catalogue, order routing and partner status.
6. AI orchestration — intent router, retrieval planner, tool registry, model gateway, structured extraction, summarization, speech and evaluation.
7. Data and interoperability — canonical domain model, document store, event log, terminology mappings, FHIR-compatible boundaries and approved national/partner adapters.
8. Platform operations — audit, observability, security monitoring, data governance, reliability and incident response.

## 2. AI orchestration pattern

Every AI request should pass through this controlled sequence:

**User intent → identity/session → policy check → scoped retrieval → task plan → approved tools → structured result → validation → human confirmation where required → audit event.**

The AI layer should never receive blanket access to all patient records. Tools should enforce authorization independently, even if the model asks for data outside scope.

### Tool classes
- Read-only: find authorized patient, retrieve selected records, list appointments, summarize permitted history.
- Drafting: create a draft note, draft patient instructions, draft prescription fields.
- Administrative action: request appointment, route refill request, create support ticket.
- High-impact action: sign prescription, change medication, diagnose, close a clinical alert. These must not be autonomously executed by a general-purpose model.

### Example command

"Summarize the last three years of records relevant to hypertension."

The orchestrator:
1. Confirms active provider and patient context.
2. Checks purpose and permission.
3. Retrieves only records in permitted scope and date range.
4. Groups source facts by encounter, medication, test and care plan.
5. Detects missing periods, conflicting medication lists and uncertain extraction.
6. Produces a short summary with source links.
7. Offers audio playback.
8. Records the access and summary generation event.

The model must not infer that an undocumented period means the patient received no care.

## 3. Core platform services

### Identity service
- Patient and provider identities.
- Organization and branch memberships.
- Professional credential verification state.
- Authentication and recovery.
- Delegated caregiver relationship.
- Opaque QR/NFC credential lifecycle.

### Consent and policy service
- Resource, requester, purpose, scope and expiry.
- Consent capture and evidence.
- Role-based and attribute-based authorization.
- Revocation and re-evaluation.
- Emergency access policy with break-glass reason, elevated audit and retrospective review, only where legally permitted.

### Longitudinal record service
- Encounter-linked records.
- Documents, reports, notes, prescriptions and observations.
- Source provenance and timestamps.
- Patient-reported versus clinician-authored distinction.
- Duplicate detection and reconciliation workflow.
- Versioning and correction history.

### Care orchestration service
- Appointment and encounter lifecycle.
- Referral and diagnostic order lifecycle.
- Prescription lifecycle.
- Follow-up tasks and reminders.
- Patient notifications and acknowledgements.
- Explicit workflow states and idempotent transitions.

### Provider network service
- Verified provider directory.
- Specialty and service catalogue.
- Branches, geography and serviceability.
- Opening hours and appointment availability.
- Pharmacy/lab licences and verification status.
- Partner integration health and fulfilment reliability.

### AI platform service
- Model gateway and provider abstraction.
- Prompt and policy versioning.
- Retrieval and tool registry.
- Context minimization.
- Structured output validation.
- Evaluation datasets and release gates.
- Human feedback and error reporting.
- Cost, latency and quality telemetry.

## 4. Data model boundaries

Core entities:
- Person, Patient, Provider, PractitionerCredential, Organization, Branch.
- CaregiverDelegation, ConsentGrant, AccessPolicy, AuditEvent.
- Encounter, ClinicalNote, Condition, AllergyIntolerance, MedicationStatement, MedicationRequest, Observation, DiagnosticReport, DocumentReference.
- Appointment, Referral, ServiceRequest, DiagnosticOrder, Prescription, Dispense, FulfilmentOrder, FollowUpTask.
- ProviderCatalogue, PharmacyBranch, LabBranch, AvailabilitySlot.
- AIJob, AIArtifact, SourceCitation, HumanApproval.

Use stable IDs, tenant boundaries, source identifiers and explicit timestamps. Avoid using phone number or email as a permanent patient key. Model clinical facts with provenance and status, not just free-text blobs.

## 5. Interoperability strategy

Design adapters around recognized healthcare data models and standards where appropriate, including FHIR-compatible resources and terminology mappings. Do not claim ABDM/ABHA integration until official sandbox/production integration, consent artefacts, security review and certification/approval requirements are met.

Maintain a canonical internal model while retaining source payload and mapping provenance. External systems remain authoritative for their own records until a formal data-sharing agreement and reconciliation model exist.

## 6. Security and privacy baseline

- Tenant isolation at every query and storage boundary.
- Least-privilege service identities.
- Encryption in transit and at rest.
- Short-lived, scoped access tokens.
- Secrets management and rotation.
- Tamper-evident audit trails.
- Sensitive-data minimization in prompts, traces and logs.
- No patient data used for model training without a lawful, explicit governance basis.
- Data retention, correction, export and deletion processes aligned with applicable law.
- Threat modelling for QR/NFC, account recovery, caregiver delegation, partner APIs and AI prompt injection.

## 7. Reliability and graceful degradation

- Core patient and provider workflows must remain understandable when AI is unavailable.
- AI failure should fall back to manual search, review and entry.
- Partner outages should show last verified status and timestamp, not fake live availability.
- Retry operations must be idempotent.
- Queue asynchronous jobs with status and dead-letter handling.
- Separate clinical record writes from non-critical analytics.
- Establish backup, restore and disaster recovery objectives before production.

## 8. Evaluation and monitoring

Evaluate each AI workflow separately:
- Patient matching precision and false-match rate.
- Summary factuality and source citation coverage.
- Omission of critical allergies/medication facts.
- Contradiction detection.
- Voice transcription correction rate.
- Draft note edit distance and clinician acceptance.
- Tool authorization violations (target zero).
- Unsupported medical advice rate.
- Latency, cost and failure rate.
- Human override and escalation rate.

A model update must pass regression tests on synthetic and appropriately governed evaluation data before release.
