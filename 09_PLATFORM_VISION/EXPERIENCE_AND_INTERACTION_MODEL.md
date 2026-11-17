# Experience and Interaction Model — Calm Surface, Powerful Network

**Status:** PROPOSED UX architecture.

## 1. Experience promise

A patient should be able to reach the next appropriate action with minimal effort. A doctor should be able to understand the relevant patient context without hunting through disconnected systems.

Avoid:
- Dense dashboards with dozens of equal-priority cards.
- Repeated data entry.
- Chatbot-only navigation.
- Unexplained AI recommendations.
- Hidden access and sharing states.
- Decorative AI animations and unnecessary notifications.

Prefer:
- One obvious primary action per screen.
- Progressive disclosure.
- Short, scannable summaries.
- Strong direct links to original records.
- Clear status and next action.
- Calm typography, whitespace and restrained color.
- Voice where it saves time, not as a forced interaction.

## 2. Provider journey

1. **Arrive** — secure sign-in, clinic context and role.
2. **Find patient** — search by authorized identifiers, scan a patient-presented QR, or tap NFC.
3. **Verify** — show patient identity match and the permission request before any protected record is disclosed.
4. **Orient** — concise patient briefing: reason for visit, relevant history, active conditions, medication list, allergies, latest relevant investigations and care gaps.
5. **Inspect** — open original notes, reports and prescriptions directly from each summary fact.
6. **Consult** — voice or text note capture; visible transcript; edit and correct.
7. **Draft** — AI structures the clinician's words into a note or prescription draft.
8. **Approve** — clinician reviews, edits, signs and authorizes; no silent auto-send.
9. **Coordinate** — send authorized prescription/referral to selected eligible provider, where integration and legal requirements allow.
10. **Close loop** — follow-up, fulfilment status and patient instructions.

## 3. Patient journey

1. **Describe** — voice or text, with language and accessibility options.
2. **Clarify** — AI asks only necessary questions and reflects back what it understood.
3. **Navigate** — provide safe information and options; urgent symptoms follow validated escalation protocols.
4. **Choose** — patient selects provider or care option, sees price/availability/location.
5. **Authorize** — consent for the chosen provider and purpose.
6. **Attend** — appointment details and preparation.
7. **Receive plan** — clinician-authored instructions and signed prescription, if issued.
8. **Fulfil** — compare eligible nearby pharmacy branches, delivery or pickup; show stock/availability only when verified.
9. **Track** — diagnostics, medicine and follow-up status.
10. **Continue** — reminders, care plan and record sharing controls.

## 4. QR/NFC identity and permission model

The Instagram analogy is useful only for ease of discovery—not for access to private health information.

Recommended pattern:
- Patient controls a revocable, opaque identity token or presents a QR/NFC credential.
- QR/NFC resolves to a secure session or identity reference, not a readable health record URL.
- Provider authenticates and states purpose.
- Patient sees provider identity, requested data categories, reason and access duration.
- Patient grants, declines or narrows access.
- Authorization service issues a short-lived, scoped access token.
- Every read and action is logged.
- Patient can revoke future access; already lawfully accessed information may have retention obligations under applicable law.
- Lost card/device flow supports credential revocation and re-issuance.

Do not encode names, phone numbers, diagnoses, ABHA numbers or record contents in a static QR code. Avoid globally searchable patient profiles.

## 5. Summary and audio design

A patient briefing should be layered:
- **10-second orientation:** why here, key safety facts, active medication/allergies, most relevant recent result.
- **60-second briefing:** timeline and disease-specific history over selected time range.
- **Deep review:** original source documents and complete record.

Every summary fact should include:
- Date or date range.
- Source organization and record type.
- Whether it is patient-reported, clinician-authored, imported or AI-extracted.
- Confidence/ambiguity where meaningful.
- Link to original record.

Audio playback should:
- Read a short summary, not every raw record.
- Pause, repeat, skip sections and change speed.
- Avoid speaking sensitive information aloud by default in public settings.
- Offer a private listening prompt/headphone reminder where appropriate.
- Keep the text visible and accessible.

## 6. Navigation and visual hierarchy

Use two primary product spaces:
- Provider Workspace.
- Patient & Caregiver.

Shared infrastructure should not create a confusing third experience. Pharmacy/lab partners should receive focused partner portals or APIs rather than being forced into doctor/patient navigation.

The top-level navigation should remain small. Put less-frequent tools behind contextual menus and direct links. Preserve deep links to a patient, visit, report, prescription, referral or order, but require fresh authorization when a protected resource is opened.

## 7. Accessibility and resilience

- Voice, typing, touch and keyboard alternatives.
- Large touch targets and readable contrast.
- Low-bandwidth and interrupted-network states.
- Clear draft/saved/synced state.
- Language support designed for actual target regions.
- Caregiver access with explicit relationship and scope.
- Error messages that say what happened and what to do next.
- No reliance on color alone for status.
