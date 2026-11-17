# Enterprise Risk Register — Seed

Scores and statuses must be reviewed by accountable owners. This is a starter register, not a formal clinical, legal or security assessment.

| ID | Risk | Severity | Likelihood | Mitigation / evidence gate | Owner |
|---|---|---:|---:|---|---|
| R-001 | AI-generated clinical content is mistaken for clinician-approved advice | Critical | Medium | Draft-only state, clinician approval, provenance, UI warnings, tests | Clinical safety |
| R-002 | Unauthorized access to health information | Critical | Medium | Least privilege, server-side authorization, encryption, audit, penetration test | Security |
| R-003 | Real patient data enters prototype or logs | Critical | Medium | Synthetic-only policy, redaction, access controls, data-flow review | Privacy |
| R-004 | Product scope expands before a validated customer problem | High | High | Explicit strategy decision, discovery evidence, stage gates | Founder / product |
| R-005 | Conflicting PRDs cause inconsistent build decisions | High | High | Decision register, canonical scope, traceability, change control | Product |
| R-006 | Offline sync creates duplicate or stale clinical records | High | Medium | Idempotency, conflict policy, reconciliation tests, audit trail | Engineering |
| R-007 | Regulatory obligations are misunderstood | Critical | Medium | Qualified India-specific legal/regulatory assessment before launch | Legal / compliance |
| R-008 | Third-party integrations fail or expose data | High | Medium | Vendor diligence, contracts, scoped credentials, sandbox testing | Engineering / legal |
| R-009 | Founder dependency / key-person bottleneck | High | High | Written decisions, runbooks, delegation, access recovery plan | Founder |
| R-010 | No repeatable commercial acquisition or retention | High | Unknown | Paid discovery, pilot criteria, cohort metrics, unit economics | Commercial lead |

## Escalation
Any critical clinical safety, privacy, security or regulatory incident pauses affected release/workflow until triaged by accountable owners. Do not use this register as a substitute for incident response or professional advice.
