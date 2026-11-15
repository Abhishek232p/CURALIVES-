# Requirements Traceability Baseline

**Status:** Framework only; not a verified implementation audit.

| ID | Requirement | Priority | Evidence needed to close | Owner |
|---|---|---:|---|---|
| REQ-001 | Doctor reviews and explicitly approves AI-generated clinical documentation | Critical | UI test, API authorization test, audit event, clinical workflow sign-off | Product + clinical safety |
| REQ-002 | No autonomous diagnosis or prescription in prototype | Critical | Product boundary tests, UI copy review, API guard tests | Engineering |
| REQ-003 | Patient consent is explicit, scoped, recorded and revocable | Critical | Consent model, authorization tests, audit evidence | Privacy + engineering |
| REQ-004 | Role-based access is enforced server-side | Critical | Negative authorization tests for every role/resource | Security |
| REQ-005 | Prototype uses synthetic data only | Critical | Fixture scan, environment controls, data handling review | Engineering |
| REQ-006 | Voice capture has visible transcript and correction path | High | UX test, accessibility test, failure-state test | Product |
| REQ-007 | Offline/poor-network states communicate sync status and conflict handling | High | Offline test matrix and reconciliation evidence | Engineering |
| REQ-008 | Every critical action returns a clear confirmation | High | End-to-end tests for save, submit, cancel, consent and prescription draft | Product + QA |
| REQ-009 | Audit events exist for sensitive access and changes | Critical | Event schema, retention policy, tamper-resistance review | Security |
| REQ-010 | Deployment secrets are never committed to source control | Critical | Secret scanning and deployment configuration review | DevOps |

## Closure rule
A requirement is not DONE because a screen or file exists. Closure requires a named owner, acceptance criteria, test evidence, security/privacy review where applicable, and a release reference. Use BLOCKED or UNKNOWN when evidence is missing.
