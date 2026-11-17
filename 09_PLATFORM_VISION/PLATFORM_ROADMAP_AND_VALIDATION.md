# Platform Roadmap and Validation Gates

**Status:** Proposed sequence; not an approved commitment or delivery estimate.

## 1. Strategic sequencing

Do not attempt to launch the entire health network at once. Prove one high-frequency, high-friction workflow with one provider segment, then expand the network around real demand.

### Stage 0 — Strategy and evidence
- Decide initial customer segment and first commercial workflow.
- Interview doctors, clinic staff, patients and caregivers.
- Observe current record retrieval, documentation, prescription and follow-up workflows.
- Map current tools, handoffs, workarounds, time and failure costs.
- Establish baseline metrics and willingness-to-pay evidence.
- Complete clinical safety, privacy, regulatory and threat-model discovery.

**Exit gate:** a repeated, costly problem with a named buyer, user, measurable baseline and credible pilot partner.

### Stage 1 — Provider command workspace
Potential first wedge to validate:
- Secure patient lookup and consent.
- Read-only patient record aggregation for authorized sources.
- Cited short patient summary and audio playback.
- Voice-to-text consultation draft.
- Clinician review and approval.
- Follow-up task creation.

**Exit gate:** clinician time saved without increased error, clear user adoption, safe handling of missing/conflicting records and acceptable workflow reliability.

### Stage 2 — Patient care companion
- Patient identity and profile.
- Share-by-consent flow.
- Appointments and care timeline.
- Clinician-approved instructions and record access.
- Follow-up and support requests.
- Accessibility and language improvements.

**Exit gate:** patient comprehension, successful sharing, follow-up completion and low support burden.

### Stage 3 — Prescription and fulfilment network
- Legally valid e-prescription integration.
- Pharmacy partner verification.
- Branch/serviceability discovery.
- Price and stock freshness.
- Pickup/delivery choice.
- Pharmacist verification and fulfilment status.

**Exit gate:** reliable order completion, partner economics, compliance and exception handling.

### Stage 4 — Diagnostics and broader care network
- Verified lab partners and branches.
- Referral/order workflow.
- Sample collection and result status.
- Report return with provenance.
- Follow-up coordination.

**Exit gate:** reliable partner coverage, result integrity, patient safety and sustainable economics.

### Stage 5 — Interoperability and network scale
- Standards-based adapters.
- Hospital/clinic integrations.
- Approved national infrastructure integrations where available.
- Multi-region operations, partner quality and platform governance.

**Exit gate:** proven security, interoperability conformance, operational reliability and repeatable unit economics.

## 2. North-star metric

Candidate north star: **verified care journeys completed with the appropriate next step and follow-up**, not app opens, chatbot sessions or time spent.

Define a journey completion event only when:
- The intended care action occurred.
- Its status is confirmed by a trusted source or accountable human.
- The patient has a clear next step.
- Required follow-up is completed or explicitly closed.
- The measure excludes duplicate, test and synthetic events.

## 3. Supporting metrics

Provider:
- Time to retrieve relevant patient context.
- Documentation time and correction rate.
- Percentage of AI draft content edited or rejected.
- Clinician approval rate.
- Missing/conflicting record detection rate.
- Workflow completion and reliability.

Patient:
- Time to find next appropriate care option.
- Consent comprehension and revocation success.
- Appointment completion.
- Prescription fulfilment success.
- Follow-up completion.
- Support request resolution time.

Network:
- Verified active providers and branches.
- Serviceability coverage.
- Partner acknowledgement latency.
- Stock/price freshness.
- Order cancellation and exception rate.
- Lab result turnaround and report reconciliation.

Business:
- Active clinics and cohort retention.
- Paid conversion and expansion.
- Gross margin by workflow.
- Support cost per completed journey.
- Partner acquisition and servicing cost.
- Revenue concentration and cash runway.

## 4. Validation method

- Do not rely on likes, social posts or broad market reports as proof of demand.
- Use observed workflow studies and interviews.
- Prototype the smallest end-to-end workflow.
- Run synthetic-data usability testing before any live-data pilot.
- Use a governed pilot only after legal, clinical, security and privacy readiness.
- Compare pre/post metrics with explicit cohorts and denominators.
- Record adverse events, near misses, false matches and data access exceptions.

## 5. Go/no-go questions

- Does the user have a frequent and painful problem?
- Is there a buyer with budget and urgency?
- Does the workflow reduce effort without moving hidden work elsewhere?
- Can we obtain data lawfully and reliably?
- Can the system prove who accessed what and why?
- Can AI output be checked against source records?
- Is there a safe manual fallback?
- Can the business make money without compromising patient trust?
