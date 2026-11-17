# Clinical Safety, Prescriptions and Care Navigation Guardrails

**Status:** Proposed safety requirements. Qualified clinical, legal, privacy and regulatory review is mandatory before real-world use.

## 1. Care navigation is not autonomous treatment

The patient may describe symptoms by voice or text. AI may:
- Transcribe and organize the patient's account.
- Ask clarifying questions.
- Explain how to access care.
- Present verified provider options.
- Route to a clinician or emergency service under validated, approved protocols.
- Summarize patient-provided information for the clinician.

AI must not independently conclude that a condition is minor or safe to self-treat, rule out emergencies, diagnose, prescribe, change dosage or recommend stopping medication. A general-purpose model must not be the sole triage decision-maker.

Any symptom urgency workflow requires clinician-designed protocols, validation, local emergency information, monitoring and clear escalation. If a user reports potentially urgent symptoms, the system should not delay urgent care while collecting more information.

## 2. Doctor voice workflow

1. Doctor selects or verifies patient and encounter.
2. System checks access permission and displays patient context.
3. Doctor starts recording with clear indicator and applicable consent/legal controls.
4. Speech-to-text produces a visible transcript.
5. Doctor can correct transcript and mark uncertain terms.
6. AI drafts structured note fields.
7. Doctor reviews and edits.
8. Doctor signs/approves.
9. Signed record is stored with author, time, version and provenance.

No silent recording, hidden transcription, auto-finalization or unreviewed clinical note publication.

## 3. Prescription workflow

1. Doctor selects medication from a verified catalogue appropriate to jurisdiction.
2. AI may populate a draft from the doctor's explicit instructions.
3. System checks completeness and flags possible conflicts for clinician review; it does not silently resolve clinical conflicts.
4. Doctor reviews medicine, strength, dose, route, frequency, duration, quantity, refills and instructions.
5. Doctor signs/authorizes using compliant identity and signature workflow.
6. Prescription is transmitted only through an approved, secure and legally valid channel.
7. Pharmacy receives the authorized prescription and performs required pharmacist verification.
8. Substitution, clarification or exception follows applicable professional rules and requires the appropriate approval.
9. Patient sees status, price and fulfilment choices.
10. Dispensing and delivery/pickup events are recorded.

The word "automatically" should mean automation of data entry and routing after explicit authorization—not autonomous clinical authorization.

## 4. Pharmacy and laboratory partner network

Partner onboarding requires:
- Legal entity and branch verification.
- Applicable licence/registration verification.
- Professional responsibility and escalation contacts.
- Service catalogue and geographic coverage.
- Pricing and availability freshness.
- Order acknowledgement and status APIs or an auditable manual fallback.
- Data processing and confidentiality agreements.
- Incident, complaint, recall and service failure processes.
- Quality monitoring and partner suspension controls.

Do not show "in stock", "available now" or a delivery promise unless a trusted source has recently confirmed it. Label estimated versus confirmed fulfilment.

## 5. Longitudinal record summary safety

A generated summary must:
- State selected date range.
- Identify records included and source systems.
- Distinguish documented diagnosis from patient-reported concern.
- Show current versus historical medication status.
- Flag conflicting or missing information.
- Link to original record.
- Avoid inventing continuity between sparse records.
- Avoid converting correlation into causation.
- Support correction and feedback.

"Patient suffered from X for 20 years" must not be inferred merely because a condition appears in old and recent records. Use wording such as "X is documented in records dated..." unless continuous duration is explicitly established.

## 6. QR/NFC and emergency access

QR/NFC is an identity and consent initiation mechanism, not a bearer key to a complete health record. Use cryptographically protected, opaque, revocable tokens and short-lived sessions.

Emergency access, if permitted by applicable law, requires a defined break-glass process, reason capture, restricted scope, alerting and retrospective audit. Do not use a generic "emergency" button to bypass all controls.

## 7. Human accountability

For every workflow, name the responsible professional or operational role. The AI system should disclose what it generated, what source data it used, what it could not verify and what requires human action.
