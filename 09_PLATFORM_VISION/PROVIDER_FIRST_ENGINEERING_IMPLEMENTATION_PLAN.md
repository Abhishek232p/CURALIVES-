# Provider-First Engineering Plan — Curalives AI-Native Health Network

**Decision:** DEC-007 — Provider-first initial engineering direction  
**Decision status:** FOUNDER-CONFIRMED (2026-11-17)  
**Implementation status:** PLANNED — no application implementation is claimed by this document  
**Target repository:** `Abhishek232p/CURALIVES-`  
**Branch:** `governance/knowledge-system-v1`  
**Architecture posture:** modular monolith first; explicit service boundaries; extraction to distributed services only when justified by scale, isolation or partner requirements.

---

## 0. Executive decision

Build the **Provider Workspace first**, backed by a small but real foundation for identity, consent, patient context, record provenance, audit and AI orchestration.

Do not build an unrestricted "Jarvis" agent, a public patient lookup network or a broad marketplace first. Build a safe, fast clinical command surface whose first job is:

> Help an authenticated, authorized clinician identify the right patient, understand relevant longitudinal context quickly, inspect source records, and prepare accurate clinical documentation for the clinician to review and approve.

The provider-first wedge is an entry point into the long-term Curalives network. It must not become a dead-end doctor-only application. Its domain model and APIs should anticipate patient/caregiver access, clinics, pharmacies, laboratories and interoperable health systems without implementing all of those channels in the first release.

### 0.1 What provider-first means

**Build first**
- Provider authentication and clinic/organization context.
- Patient search with strong matching and ambiguity handling.
- Patient-presented QR/NFC secure handoff simulation initially.
- Consent and purpose-limited authorization.
- Longitudinal record timeline and source-linked summaries.
- Voice/text command bar with a constrained tool registry.
- Audio playback of short summaries.
- Consultation note drafting from clinician speech/text.
- Human review, edit, sign/approve and audit.
- Follow-up task creation and status.

**Design now, integrate later**
- Patient/caregiver application and consent controls.
- Pharmacy and diagnostics partner directory and fulfilment APIs.
- Branch-level availability and serviceability.
- FHIR-compatible interoperability adapters and jurisdiction-specific integrations.
- ABDM/ABHA integration only after a separately scoped, approved and tested programme.

**Explicitly not in first provider release**
- Autonomous diagnosis or treatment.
- AI-authored prescription sent without clinician approval.
- General symptom checker that decides a patient is safe to self-treat.
- Publicly searchable patient profiles.
- Real QR/NFC hardware access to health records.
- Live pharmacy stock, payment, delivery or lab integrations without partner contracts and verified APIs.
- Production use of real patient data before security, privacy, legal, clinical and operational gates are passed.

---

## 1. Evidence and existing-repository constraints

The current MVP specification in `.trae/specs/curalives-mvp/spec.md` describes a connected-care prototype with patient, doctor, pharmacy, diagnostics, intake, appointments, follow-up, identity and consent experiences. It also explicitly describes prototype constraints: synthetic data, no real diagnosis, no real prescription processing, no real PHI, simulated role switching, simulated NFC and no real payment or messaging integrations.

The current `.trae/specs/curalives-mvp/tasks.md` begins with a mock data layer, Zustand store, mock AI service and shared UI components; the task entries inspected were marked pending. Treat this as an existing planning baseline, not proof that those tasks have been implemented.

The technical files named in earlier uploads (for example frontend architecture, authentication, API/domain, data model, authorization, NFC/QR and AI/MCP governance) were not found at the repository root on `main` during this inspection. They may exist in the archive or elsewhere; reconcile them before implementation. Do not assume their content from filenames.

### Existing technology direction found in repository spec
- TanStack Start / TanStack Router
- React 19
- TypeScript 5.7
- Tailwind CSS v4
- Radix UI primitives
- Vite
- Vercel/Nitro deployment target
- Existing mock-data and AI abstraction proposal
- Zustand is proposed in the spec/tasks, but package installation and actual use must be verified in the live codebase before relying on it.

**Rule:** preserve existing stack unless a documented technical audit demonstrates a reason to change it. No framework rewrite.

---

## 2. Product experience architecture

### 2.1 Primary surface: Provider Workspace

The provider's default landing view should answer three questions:
1. What needs my attention now?
2. Which patient am I looking at?
3. What is the safest next action?

Keep global navigation intentionally small:
- Today
- Patients
- Inbox / Tasks
- Records (contextual)
- Settings

Avoid a dense dashboard of equal-weight cards. The primary interaction should be a persistent, keyboard-accessible command/search entry, with voice as an optional input method.

### 2.2 Patient workspace information architecture

A patient workspace should use a stable patient header and a few predictable sections:
- Overview
- Timeline
- Records
- Medications
- Investigations
- Encounters
- Sharing / Access history

The default Overview should be a compact, source-linked briefing:
- Patient identity and match confidence/status.
- Visit reason / encounter context.
- Safety-critical facts (allergies and relevant active medication information, where available).
- Active and historical conditions, clearly distinguished.
- Most relevant recent observations and reports.
- Current care plan / follow-up status.
- Missing, stale or conflicting data warnings.

Every summary fact that can influence care must link to the original source record. The clinician must be able to open the original report in one action.

### 2.3 Interaction design rules

- One primary action per screen or panel.
- Direct links to original report, encounter, medication or task.
- Progressive disclosure: short summary first, details on demand.
- Voice is optional; typing, keyboard and touch remain fully supported.
- No command executes a high-impact action without a confirmation/review step.
- Display saved/draft/signed/sent states clearly.
- Show source and timestamp for AI-generated context.
- Use calm visual hierarchy and restrained notifications.
- No engagement loops, unnecessary animations or chat clutter.

---

## 3. Provider command environment

### 3.1 Command UX

The command environment is an intent interface, not a general-purpose free-agent shell.

Examples:
- "Find patient by this appointment."
- "Open this patient's last three visits."
- "Summarize the last three years of records relevant to hypertension."
- "Read the latest HbA1c report."
- "Draft today's consultation note from my dictation."
- "Show outstanding follow-up tasks."

Each response should show:
- What the system understood.
- Which patient and encounter it is operating on.
- Whether access is authorized.
- Which records were consulted.
- The generated result and uncertainty.
- Direct links to underlying records.
- The next permitted action.

### 3.2 Intent and tool pipeline

Every command passes through:

`Input → Speech/Text normalization → Intent classification → Entity resolution → Session/patient context → Authorization policy → Tool plan → Tool execution → Output validation → UI confirmation → Audit event`

The model may propose a tool call. The application and domain services independently authorize and validate it. A model response is never itself an authorization decision.

### 3.3 Initial tool registry

**Read-only tools**
- `search_patients(query, permitted_scope)`
- `get_patient_identity(patient_id)`
- `get_patient_timeline(patient_id, date_range, filters)`
- `get_records(patient_id, record_types, date_range)`
- `get_record(record_id)`
- `get_active_medications(patient_id)`
- `get_allergies(patient_id)`
- `get_recent_observations(patient_id, codes, date_range)`
- `get_encounter_history(patient_id, date_range)`
- `get_follow_up_tasks(patient_id)`

**Draft-only tools**
- `create_note_draft(encounter_id, structured_content)`
- `update_note_draft(note_id, patch)`
- `create_prescription_draft(encounter_id, medication_fields)`
- `create_follow_up_draft(encounter_id, task_fields)`

**Explicitly gated tools**
- `sign_note(note_id)` — clinician action and compliant authentication.
- `authorize_prescription(prescription_id)` — clinician action and applicable legal workflow.
- `send_prescription(prescription_id, destination)` — only after signed/authorized status and approved integration.
- `grant_access(...)` — consent/policy workflow, not model discretion.

Do not expose a generic SQL tool, unrestricted database tool or arbitrary HTTP request tool to the model.

### 3.4 Tool contract

Every tool definition must declare:
- Name and version.
- Input schema and validation.
- Output schema.
- Required identity and role.
- Resource scope.
- Permitted purpose.
- Side-effect classification.
- Idempotency requirements.
- Audit event type.
- Timeout and retry behavior.
- Error codes and safe user-facing fallback.

### 3.5 Context boundaries

The agent context should contain only what is required for the current task:
- Authenticated actor ID and active organization.
- Active patient/encounter IDs after verified selection.
- Consent and policy decision reference.
- Retrieved source facts and record references.
- Tool output, not unrestricted database contents.

Never place broad patient records, secrets, tokens or unnecessary identifiers into model prompts, analytics or traces.

---

## 4. Patient identity, search and QR/NFC

### 4.1 Patient search

Support exact identifiers and carefully constrained search. Fuzzy search must return candidate matches, not silently choose a patient. Require a second identifier or human confirmation when confidence is insufficient.

Track:
- Match method.
- Match confidence.
- Duplicate candidates.
- Merge/reconciliation state.
- Who confirmed the match.

A false patient match is a critical safety event.

### 4.2 QR/NFC flow

Initial development should use a simulated QR/NFC handoff and synthetic records.

Production pattern:
1. Patient presents an opaque, revocable credential.
2. Scan resolves to a secure handoff session, not a public profile or record URL.
3. Provider authenticates and selects the care purpose.
4. Patient is shown requester identity, requested scope and duration.
5. Consent is captured or a legally valid alternate basis is evaluated.
6. Authorization service issues short-lived, scoped access.
7. Every protected read and action is audited.
8. Session expires; access can be revoked subject to legal retention obligations.

Do not encode medical details, names, phone numbers or permanent health identifiers in a static QR code. QR/NFC discovery never equals authorization.

---

## 5. Longitudinal patient context and summary engine

### 5.1 Record ingestion and provenance

Support records from:
- Native Curalives encounters.
- Uploaded documents/reports.
- Partner/provider integrations.
- Standards-based adapters where implemented.
- Patient-reported information, explicitly labelled.

Each item must preserve:
- Source organization/system.
- Source record identifier.
- Patient identity mapping and match state.
- Author/issuer where available.
- Clinical or event date and ingestion date.
- Record type and status.
- Original document/payload reference.
- Transformation/extraction version.
- Correction and supersession history.

Do not treat ingestion time as clinical event time.

### 5.2 Summary pipeline

1. Resolve patient and permitted date range.
2. Retrieve only authorized records.
3. Normalize metadata and clinically relevant fields.
4. Identify duplicate and conflicting entries.
5. Group by condition, medication, encounter, investigation and care plan.
6. Generate a short summary from retrieved facts.
7. Attach source citations/links to each factual claim.
8. Flag missing intervals, stale medication lists and uncertainty.
9. Validate structured output.
10. Store summary artifact metadata and access audit.

### 5.3 Summary layers

- **10-second briefing:** visit context, safety-critical known facts, key current issues and latest relevant result.
- **60-second briefing:** chronological summary for selected condition and date range.
- **Deep review:** full timeline and original documents.

Do not claim a condition persisted continuously merely because it appears in two distant records. Say "documented on these dates" unless continuity is established. Never infer that absence of a record means absence of disease, medication or treatment.

### 5.4 Summary quality metrics

- Factual claim citation coverage.
- Unsupported claim rate.
- Critical omission rate (allergy, medication, important result).
- Contradiction detection precision/recall.
- Patient match false-positive rate.
- Clinician correction/edit rate.
- Summary usefulness rating.
- Latency and cost per summary.

A summary that omits a critical safety fact must fail the release gate even if its overall language quality is high.

---

## 6. Voice and audio architecture

### 6.1 Voice input
- Explicit start/stop recording.
- Visible recording indicator.
- Applicable consent and notice.
- Streaming or completed transcript with confidence/uncertainty.
- Medical terminology correction affordance.
- Speaker attribution only when reliable and needed.
- Text entry fallback.
- No silent/background recording.

### 6.2 Voice output
- Read only a short summary by default.
- Pause, repeat, skip sections and change speed.
- Keep synchronized text visible.
- Protect sensitive content in shared/public settings.
- Do not read full records automatically.

### 6.3 Clinical dictation
- Transcribe clinician speech.
- Structure into note sections.
- Preserve uncertain words for review.
- Distinguish clinician statements from model-generated phrasing.
- Require clinician edit/review and sign-off.
- Preserve original transcript and final signed note with version lineage, subject to approved retention policy.

---

## 7. Prescription and follow-up workflow

### 7.1 Prescription lifecycle

`Draft → Clinician Review → Clinician Authorized/Signed → Secure Transmission → Pharmacy Review → Dispense/Fulfilment Status`

The exact states and legal signature/transmission requirements must be validated for the operating jurisdiction.

AI may:
- Populate a draft from explicit clinician instructions.
- Check completeness.
- Flag missing fields or possible inconsistencies for review.
- Format and route a signed prescription.

AI may not:
- Independently select a treatment or change medication.
- Resolve clinical conflicts without clinician decision.
- Sign, authorize or transmit an unapproved draft.
- Bypass pharmacist duties or legal requirements.

### 7.2 Minimum prescription fields

- Patient and encounter reference.
- Prescriber identity and authorization.
- Medication concept/product, strength and formulation.
- Dose, route, frequency and timing.
- Duration and quantity.
- Refill count where permitted.
- Instructions and warnings.
- Issue date, status and signature evidence.
- Pharmacy destination and transmission status.

### 7.3 Follow-up

Follow-up should be a task with owner, due date, purpose, status, source encounter and patient communication status. Do not silently convert AI suggestions into clinical orders.

---

## 8. Technical architecture and code boundaries

### 8.1 Deployment posture

Start as a **modular monolith** using the repository's existing TanStack Start/React/TypeScript direction. This keeps deployment and debugging simple while enforcing domain boundaries in code. Extract services only when there is a clear scaling, security, independent release or integration reason.

### 8.2 Proposed logical modules

The exact paths must be reconciled with the current source tree before creation.

```text
src/
  routes/
    provider/
      index.tsx
      patients/
        index.tsx
        $patientId.tsx
      inbox.tsx
      encounters/
        $encounterId.tsx
  components/
    provider/
      command-bar/
      patient-header/
      patient-briefing/
      patient-timeline/
      record-viewer/
      encounter-workspace/
      note-editor/
      access-consent/
      audio-player/
  domains/
    identity/
    organizations/
    patients/
    consent/
    records/
    encounters/
    medications/
    prescriptions/
    follow-up/
    audit/
  application/
    commands/
    queries/
    workflows/
  ai/
    orchestration/
    model-gateway/
    prompts/
    tools/
    retrieval/
    summaries/
    speech/
    evaluations/
  infrastructure/
    database/
    repositories/
    storage/
    integrations/
    telemetry/
  shared/
    contracts/
    validation/
    errors/
    security/
    config/
tests/
  unit/
  integration/
  authorization/
  ai-evaluations/
  e2e/
```

Do not copy this tree mechanically if the repository already has an established equivalent. Keep one authoritative module per domain and avoid duplicate competing stores.

### 8.3 Domain boundaries

- Identity owns principals, sessions and authentication.
- Organization owns clinic, branch and membership.
- Patient owns demographic identity and patient matching.
- Consent owns grants, purpose, scope, expiry and revocation.
- Records owns source records and provenance.
- Encounters owns visit lifecycle and clinical notes.
- Medication/prescription owns medication request and authorization state.
- AI owns orchestration and AI artifact metadata, not clinical source-of-truth records.
- Audit owns immutable access and action events.
- Network owns partner directory and fulfilment only when that phase is approved.

### 8.4 Persistence

Before production:
- Use a transactional relational database with migrations.
- Keep structured clinical/domain state separate from large binary document storage.
- Use object storage for source files with access controls and integrity metadata.
- Use an append-only or tamper-evident audit design.
- Apply tenant/organization scoping in repository/service boundaries and database policies where supported.
- Define backup, restore, retention, export, correction and deletion workflows.
- Do not rely on browser localStorage as a security boundary or clinical source of truth.

The existing prototype may use mock data/local persistence. That must remain explicitly synthetic and isolated from production environments.

---

## 9. API and event contracts

Prefer explicit application commands and queries over generic CRUD exposure.

### Initial query endpoints (illustrative)
- `GET /api/provider/me`
- `GET /api/provider/organizations`
- `GET /api/patients/search?q=...`
- `GET /api/patients/:patientId/overview`
- `GET /api/patients/:patientId/timeline?from=...&to=...`
- `GET /api/patients/:patientId/records?type=...&from=...&to=...`
- `GET /api/records/:recordId`
- `GET /api/encounters/:encounterId`
- `GET /api/patients/:patientId/access-history`

### Initial command endpoints (illustrative)
- `POST /api/patient-access/sessions`
- `POST /api/consents/requests`
- `POST /api/consents/:requestId/decision`
- `POST /api/ai/commands`
- `POST /api/encounters/:encounterId/note-drafts`
- `PATCH /api/note-drafts/:noteId`
- `POST /api/note-drafts/:noteId/sign`
- `POST /api/encounters/:encounterId/prescription-drafts`
- `POST /api/follow-up-tasks`

All endpoints require authentication, authorization, schema validation, rate limiting appropriate to risk, structured errors, request correlation IDs and audit where sensitive.

### Domain events (illustrative)
- `PatientAccessRequested`
- `ConsentGranted`
- `ConsentDeclined`
- `ConsentRevoked`
- `PatientRecordViewed`
- `PatientSummaryGenerated`
- `EncounterOpened`
- `NoteDraftCreated`
- `NoteSigned`
- `PrescriptionDraftCreated`
- `PrescriptionAuthorized`
- `FollowUpTaskCreated`

Events must be emitted by trusted server-side domain operations, not fabricated by frontend state.

---

## 10. Security, authorization and audit

### 10.1 Authorization dimensions

Every protected operation evaluates:
- Actor identity and authentication assurance.
- Professional role and verified credential state.
- Organization/clinic membership.
- Patient relationship or permitted care context.
- Purpose of use.
- Consent or other lawful basis.
- Resource and field scope.
- Time-bound session validity.
- Applicable jurisdiction and emergency rules.

RBAC alone is insufficient for health data. Combine role permissions with relationship, purpose, scope and context checks.

### 10.2 Required controls
- Deny by default.
- Server-side authorization on every protected read and write.
- Tenant/organization isolation.
- Short-lived access tokens and secure session handling.
- Strong account recovery and privileged-user controls.
- Encryption in transit and at rest.
- Secrets manager; no secrets in source, browser bundle or logs.
- Sensitive-data redaction in telemetry and model traces.
- Audit of access, export, consent, signing and administrative changes.
- Rate limits and anomaly detection for patient search and record access.
- Security review of QR replay, stolen device, session fixation, prompt injection and cross-tenant access.
- Incident response and breach notification workflow defined with counsel.

### 10.3 Audit event minimum
- Event ID and timestamp.
- Actor and active organization.
- Patient/resource reference.
- Action and purpose.
- Consent/policy decision reference.
- Scope and result.
- Source IP/device/session metadata as legally appropriate.
- Correlation ID and AI/tool execution reference where applicable.
- Reason for break-glass access, if applicable.
- Integrity protection and retention classification.

Do not place raw clinical text in audit events unless strictly necessary.

---

## 11. Testing and release gates

### 11.1 Unit tests
- Patient matching and ambiguity handling.
- Consent scope and expiry.
- Policy decision engine.
- Record provenance mapping.
- Timeline ordering.
- Summary citation binding.
- Tool schema validation.
- Idempotent workflow transitions.

### 11.2 Integration tests
- Authenticated provider with valid clinic membership.
- Provider without membership is denied.
- Wrong-tenant patient access is denied.
- Expired/revoked consent is denied.
- QR token replay and expiry are denied.
- AI tool cannot access out-of-scope records.
- Note draft cannot be signed by an unauthorized actor.
- Prescription cannot be transmitted before authorization.
- Audit event exists for each protected read/write.
- Partner/system outage returns a safe degraded state.

### 11.3 AI evaluation suite
Create synthetic, clinician-reviewed test cases for:
- Correct patient context.
- Correct date-range filtering.
- Source citation completeness.
- Contradictory records.
- Missing records and gaps.
- Medication status ambiguity.
- Allergy and critical result recall.
- Hallucination and unsupported inference.
- Prompt injection inside uploaded documents.
- Tool misuse and authorization bypass attempts.
- Voice transcription of names, doses and units.

Hard release gate: zero unauthorized tool actions; zero fabricated source references; no known critical omission in the approved evaluation set. Define numerical thresholds with clinical safety reviewers before live pilot.

### 11.4 E2E acceptance scenarios
1. Provider signs in and selects an authorized clinic.
2. Provider searches a synthetic patient and resolves ambiguous matches safely.
3. Provider initiates QR handoff and sees the consent request.
4. Patient grants narrow scope in simulation.
5. Provider opens the patient overview.
6. Provider generates a three-year condition-specific summary.
7. Every summary fact links to a source record.
8. Provider plays the short audio briefing.
9. Provider opens the original report directly.
10. Provider dictates a note and corrects the transcript.
11. AI produces a draft; provider edits and approves it.
12. Audit history shows the access and actions.
13. Provider can no longer access after session expiry or revocation.

### 11.5 Prototype versus production
Prototype tests must use synthetic records and simulated integrations. Passing prototype tests is not clinical validation or permission to process real patient data.

---

## 12. Phased implementation backlog

### Phase P0 — Repository and architecture audit
- Inspect current source tree, package scripts, dependency versions, route conventions, auth state, database adapters and tests.
- Reconcile current spec/tasks with uploaded technical architecture documents.
- Identify existing code to preserve and duplicate abstractions to avoid.
- Record actual state: implemented, partial, missing, broken, unknown.
- Create an architecture decision record for modular monolith and domain boundaries.

**Exit:** reviewed repo map, dependency inventory, baseline build/typecheck/test output, implementation gap list.

### Phase P1 — Secure provider foundation (synthetic data first)
- Provider shell and minimal navigation.
- Authentication boundary and organization context (prototype clearly simulated if auth remains off).
- Synthetic patient search and identity resolution.
- Patient workspace shell and record timeline.
- Consent simulation with explicit scope and expiry.
- Audit event model for every simulated access.
- Role-aware server-side service boundary even if prototype data is local.

**Exit:** provider can securely simulate a complete patient access flow; no public record lookup.

### Phase P2 — Record context and AI summaries
- Canonical record types and provenance.
- Timeline query and filters.
- Deterministic mock AI summary first.
- Summary output schema with citations.
- Missing/conflicting data warnings.
- Short audio playback.
- Direct source record navigation.

**Exit:** all facts in summary are traceable to synthetic source records; summary evaluations pass.

### Phase P3 — Command and voice interface
- Text command bar.
- Intent router and constrained tool registry.
- Patient context confirmation.
- Speech-to-text adapter behind interface; mock/transcript fixture first.
- Text correction and confidence flags.
- Audio output adapter.
- Tool execution audit.

**Exit:** read-only commands work end-to-end; all tools enforce scope; graceful fallback when speech/model unavailable.

### Phase P4 — Encounter documentation
- Encounter workspace.
- Structured note template.
- Dictation-to-draft.
- Edit, correction and version history.
- Clinician approval/sign simulation in prototype.
- Real signing integration only after legal and identity design.

**Exit:** no note becomes final without explicit clinician approval; draft and signed states are distinct.

### Phase P5 — Prescription draft and follow-up
- Medication catalogue interface and jurisdiction review.
- Prescription draft schema and completeness checks.
- Clinician review/authorization gate.
- Follow-up task and status.
- Patient-facing instructions prepared for later app.
- No live pharmacy transmission until approved integration and compliance gate.

**Exit:** full simulated workflow and negative authorization tests pass.

### Phase P6 — Pilot readiness
- Threat model and privacy/data-flow review.
- Clinical hazard analysis.
- Qualified regulatory/legal review for target geography.
- Data processing agreements and provider onboarding.
- Support, training, incident response and rollback runbooks.
- Security testing and independent review.
- Defined pilot protocol, metrics and consent.

**Exit:** accountable clinical, legal, security and business owners approve a bounded pilot. No automatic progression.

### Phase P7 — Patient and partner network expansion
- Patient/caregiver experience.
- Consent dashboard and sharing controls.
- Provider directory and verified branches.
- Pharmacy/lab partner APIs and manual fallback.
- Fulfilment tracking and diagnostics.
- Standards-based interoperability adapters.
- Scale and multi-region controls.

**Exit:** each partner integration passes its own safety, security, quality and commercial gates.

---

## 13. Delivery ownership and working agreements

Suggested accountable roles (names to be assigned):
- Founder / product owner — strategy, customer segment, scope and commercial decisions.
- Technical lead — architecture, code quality, security engineering and delivery.
- Clinical safety lead — clinical workflow, hazard analysis and approval criteria.
- Privacy/legal lead — data protection, contracts and jurisdiction-specific compliance.
- Product designer — information architecture, accessibility and usability.
- QA/evaluation lead — test coverage, AI evaluation and release evidence.
- Partner operations lead — provider/pharmacy/lab onboarding and service quality.

One person may hold multiple roles in an early team, but accountability must remain explicit. Do not imply a qualified reviewer exists until appointed.

### Definition of Ready
- Problem and user are explicit.
- Workflow and edge cases mapped.
- Data classification and permissions known.
- Acceptance criteria written.
- Clinical/privacy/security review identified.
- Design and failure states documented.

### Definition of Done
- Code reviewed.
- Tests pass.
- Authorization tests pass for protected data.
- Telemetry and audit behavior verified.
- Accessibility and responsive behavior checked.
- AI evaluation passes where applicable.
- Documentation and runbook updated.
- Release owner and rollback path named.

---

## 14. Key architecture decisions to record

| ADR | Decision | Current proposal | Revisit when |
|---|---|---|---|
| ADR-001 | Application topology | Modular monolith | Independent scaling/security boundary is proven |
| ADR-002 | AI authority | AI proposes; domain services enforce; clinician approves clinical actions | Never remove clinical accountability |
| ADR-003 | Patient identity | Opaque identifiers + verified matching | Standards adapter needs additional identifiers |
| ADR-004 | Consent | Purpose/scope/time-bound policy | Jurisdiction-specific lawful basis requires variants |
| ADR-005 | Record truth | Source records authoritative; summaries derived | Formal source reconciliation process approved |
| ADR-006 | AI tools | Allowlisted typed tools only | New tool class passes security review |
| ADR-007 | Voice | Optional input/output with visible correction | Accessibility/user research indicates changes |
| ADR-008 | QR/NFC | Secure handoff, not public record URL | Hardware and credential threat model approved |
| ADR-009 | Integrations | Adapters behind domain interfaces | A partner contract and integration readiness exist |
| ADR-010 | Deployment | Existing repository stack retained | Technical audit justifies a documented change |

---

## 15. First 10 engineering tickets

1. **AUDIT-001** — Map repository routes, packages, auth, database, state and tests.
2. **ARCH-001** — Publish actual-vs-target architecture map and ADR-001.
3. **DOMAIN-001** — Define typed patient, provider, organization, encounter, record and provenance contracts.
4. **SEC-001** — Define actor, organization, patient relationship, purpose and scope policy model.
5. **CONSENT-001** — Implement synthetic consent request/grant/expiry/revocation workflow.
6. **AUDIT-001A** — Implement append-only access/action event interface and test assertions.
7. **PATIENT-001** — Implement patient search with ambiguity and no silent auto-match.
8. **RECORD-001** — Implement source-linked patient timeline and original-record viewer.
9. **AI-001** — Implement constrained read-only tool registry with typed schemas and policy enforcement.
10. **SUMMARY-001** — Implement deterministic summary pipeline with date filtering, citations and missing/conflict warnings.

Tickets 1–6 are the initial engineering priority. Do not start with a flashy voice animation before the identity, authorization, record and audit foundations exist.

---

## 16. Success measures for the first provider pilot

Set baselines before testing. Candidate measures:
- Median time to retrieve relevant patient context.
- Time to prepare a consultation note.
- Clinician correction rate for generated summaries and notes.
- Critical fact omission rate.
- Patient-match false-positive rate.
- Percentage of summary claims linked to source records.
- Follow-up task completion.
- Provider weekly active usage and cohort retention.
- Support requests per clinic.
- Unauthorized access/tool-action count (must be zero).

Do not optimize for number of AI conversations, voice minutes or screens viewed. Optimize for safe, completed clinical workflows and reduced administrative burden.

---

## 17. Open questions that block production design

1. Initial customer segment: independent clinics, specialty clinics, hospitals or another provider type?
2. Initial clinical specialty and workflow?
3. First geography and applicable professional, prescription, privacy and health-data rules?
4. Source systems and record formats available at pilot clinics?
5. Provider authentication and credential verification method?
6. Is the first pilot strictly synthetic, shadow-mode with de-identified data, or real clinical use after formal approvals?
7. Who is the accountable clinical safety reviewer?
8. What is the minimum commercial buyer and pricing hypothesis?

Do not silently answer these with assumptions. Resolve them through founder decisions and discovery.

---

## 18. Release status language

Use these labels in project tracking:
- **PLANNED:** described but not implemented.
- **IN PROGRESS:** code exists and is being worked on.
- **IMPLEMENTED:** code exists; not necessarily validated.
- **TESTED:** specified tests passed with evidence.
- **PILOT-READY:** clinical, legal, privacy, security and operational gates approved.
- **PRODUCTION:** deployed with monitoring, support and accountable operations.

A screen, mock response or passing build does not make a workflow production-ready.

**End of plan.**
