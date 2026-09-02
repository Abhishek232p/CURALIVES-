# Curalives MVP - Implementation Plan

## Task 1: Foundation — Data Models, Mock Data Layer, and Zustand Store
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Create `src/lib/curalives/types.ts` with TS interfaces for all entities: Patient, Doctor, Clinic, Appointment, Prescription, Medicine, Pharmacy, DiagnosticTest, DiagnosticResult, HealthRecord, CareJourneyEvent, ConsentRequest, ConsentAuditEntry, Notification, CareStatus, AppointmentStatus, PrescriptionStatus, DiagnosticStatus, FollowUpStatus, ConsentScope, UserRole
  - Create `src/lib/curalives/mock-data.ts` with rich synthetic data (Indian context, realistic names, 3 patients, 8 doctors across specialties, 3 pharmacies, 2 diagnostic labs, 5-8 care journey events per patient, 2 active prescriptions, 1 upcoming appointment, 1 recent consultation, 3 consent audit entries)
  - Create `src/lib/curalives/store.ts` with Zustand store (persisted via localStorage middleware):
    - State slices: patient, doctors, appointments, prescriptions, diagnostics, records, timeline, consents, notifications, currentRole, currentPatientId, currentDoctorId
    - Actions: `bookAppointment`, `completeConsultation`, `createPrescription`, `updatePrescriptionStatus`, `scheduleDiagnostic`, `updateDiagnosticStatus`, `addFollowUp`, `updateFollowUpStatus`, `grantConsent`, `revokeConsent`, `addTimelineEvent`, `switchRole`
  - Create `src/lib/curalives/index.ts` barrel export
- **Acceptance Criteria Addressed**: AC-2 (partial), AC-4 (partial), AC-5 (partial), AC-6 (partial), AC-7 (partial), AC-8 (partial), AC-10 (partial), AC-11
- **Test Requirements**:
  - `rule` TR-1.1: Running `node -e "const s=require('./src/lib/curalives/store.ts'); console.log(s.getState().timeline.length >= 5)"` (after build) returns truthy; store hydrates from mock data
  - `rule` TR-1.2: `bookAppointment` action increases appointment array length by 1 AND pushes a "Appointment booked" CareJourneyEvent to timeline
  - `rule` TR-1.3: `updatePrescriptionStatus("prescription-1", "Delivered")` calls 4x for statuses → ends with status Delivered AND 4 timeline events added
  - `rubric` TR-1.4: Architectural separation; scale 1-5; anchors (1=monolith,3=split files but no clear boundaries,5=strict types, clean actions, immutable updates via immer-like patterns); threshold >= 4; evidence = code review
- **Notes**: Use existing design tokens and CN utility. Import zod if validation wanted on action payloads.

## Task 2: AI Service Abstraction Layer
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Create `src/lib/ai/types.ts`: `AIService` interface with methods `intakeSymptoms(symptoms, context)`, `summarizeConsult(notes, history)`, `suggestCarePathway(profile)`, `suggestTests(consult)`
  - Create `src/lib/ai/mock-ai-service.ts`: `MockAIService` class implementing AIService; returns deterministic mock responses (symptom organizing + suggested specialty + follow-up questions + pathway options for intake; structured bullet-point summary for consultation; suggested tests list)
  - Create `src/lib/ai/real-ai-service.ts`: `RealAIService` class with same interface; throws `new Error("RealAIService not configured")` for each method unless env vars exist (read via `import.meta.env` / server-side VITE_ prefixed); no API keys in frontend
  - Create `src/lib/ai/index.ts`: factory `createAIService()` that returns MockAIService by default (prototype mode); commented-out gate for switching based on env
  - Create intake/summary response text with mandatory disclaimers embedded in return payload (not just UI)
- **Acceptance Criteria Addressed**: AC-3 (partial), AC-5 (partial), AC-12
- **Test Requirements**:
  - `rule` TR-2.1: `createAIService()` returns an object with all 4 methods; typeof each === "function"
  - `rule` TR-2.2: `MockAIService.intakeSymptoms("headache 3 days fever", {})` response object contains `disclaimer` property matching `/does not provide a medical diagnosis/i`
  - `rule` TR-2.3: Grep across `src/routes/` and `src/components/` returns zero matches for direct import of MockAIService (only AIService interface + createAIService factory)
  - `rule` TR-2.4: `summarizeConsult` return value contains `warnings` array with at least one string containing "verify" or "review"

## Task 3: Shared UI Component Library
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (for types used in components)
- **Description**:
  - Create `src/components/ui/card.tsx`: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter (follow Radix-adjacent pattern from existing Button)
  - Create `src/components/ui/badge.tsx`: Badge with variants (default, primary, teal, navy, success, outline, warning, emergency)
  - Create `src/components/ui/avatar.tsx`: Avatar, AvatarImage, AvatarFallback (use Radix Avatar if available, else CSS-only)
  - Create `src/components/ui/tabs.tsx`: Re-export or wrap Radix Tabs
  - Create `src/components/ui/dialog.tsx`: Re-export or wrap Radix Dialog + Drawer via vaul
  - Create `src/components/ui/input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx`: Styled form primitives
  - Create `src/components/ui/progress.tsx`: Re-export Radix Progress + custom ProgressSteps (vertical)
  - Create `src/components/curalives/care-timeline.tsx`: Vertical timeline component taking `CareJourneyEvent[]` + icons per stage (stages: booked, consulted, prescribed, pharmacy_verified, dispatched, diagnostic_scheduled, diagnostic_completed, followup_due, completed)
  - Create `src/components/curalives/role-switcher.tsx`: Role toggle (Patient / Doctor / Pharmacist) in header area; calls `switchRole` action; persists to localStorage
  - Create `src/components/curalives/prototype-banner.tsx`: Reusable disclaimer banner "This is a Curalives prototype demonstration. All data is synthetic. Not a substitute for real medical care." (shown conditionally with close-but-dismisses-per-session)
  - Create `src/components/curalives/ai-disclaimer.tsx`: "AI-generated content — human review required" banner with variant options
- **Acceptance Criteria Addressed**: AC-2 (partial), AC-5 (partial), AC-13, AC-16
- **Test Requirements**:
  - `rule` TR-3.1: `<CareTimeline events={mockEvents} />` renders ≥7 stages with correct icon/label per stage; completed steps use check-circle style, active uses dot-pulse, pending uses outline
  - `rule` TR-3.2: `<RoleSwitcher />` toggles Patient→Doctor→Pharmacist; store.currentRole updates on each click
  - `rule` TR-3.3: All new UI components render without throwing (React test via import and smoke render)
  - `rule` TR-3.4: Prototype banner contains the exact text "All data is synthetic"

## Task 4: Routes, Navigation Shell, and Role-Based Header
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - Add new routes to `src/routes/`: `dashboard/patient.tsx` (createFileRoute("/dashboard/patient")), `dashboard/doctor.tsx`, `dashboard/pharmacy.tsx`, `intake.tsx`, `book-appointment.tsx`, `diagnostics.tsx`, `follow-up.tsx`, `consent.tsx`
  - Update `SiteShell` / `SiteHeader` to include role switcher (after login-nav slot) and additional nav links in a secondary "Prototype menu" dropdown: Patient Dashboard, Doctor Dashboard, Pharmacy, AI Intake, Book Appointment, Diagnostics, Follow-up, Consent
  - Add `<PrototypeBanner />` to SiteShell (top of page, dismissible)
  - Ensure existing `/identity` route is enriched with a placeholder heading (actual UI in Task 12)
  - Update router.tsx routeTree import (auto-generated, but confirm `routeTree.gen.ts` regenerates — TanStack Start does this automatically)
- **Acceptance Criteria Addressed**: AC-13, AC-14
- **Test Requirements**:
  - `rule` TR-4.1: All 8 new routes return 200 when navigated (via curl to dev server or router preview)
  - `rule` TR-4.2: Prototype menu dropdown contains links matching all 8 new dashboard/flow pages
  - `rule` TR-4.3: Mobile viewport (390px) header nav collapses into mobile drawer correctly (no horizontal overflow)

## Task 5: Patient Dashboard (End-to-End)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 3, 4
- **Description**:
  - Build `/dashboard/patient` route component
  - Layout: 2-column (lg) / stacked (md/sm)
  - Left (wide):
    - Patient header card (avatar, name, age, blood group, care-status badge via Badge)
    - Care Timeline (`<CareTimeline>` with all 8 stages; dynamic — reads from store)
    - Recent consultation card (summary, date, doctor with avatar, "View notes" link)
  - Right (narrow cards stack):
    - Upcoming appointment card (doctor name+avatar, specialty, date, time, type, status; "Join call" or "Directions" CTA based on type)
    - Prescriptions list (medicine name, dosage, duration, pharmacy fulfillment status badge, 2-3 entries)
    - Diagnostics card (scheduled test countdown, recent result summary with badge Normal/Borderline)
    - Follow-up card (next date, days-until, reminder toggle via Radix switch, "View plan" link)
    - Health records summary (count + 3 most recent file titles with download icon)
  - All data sourced from Zustand store via selectors (no hardcoded data in component)
- **Acceptance Criteria Addressed**: AC-2, AC-11, AC-18
- **Test Requirements**:
  - `rule` TR-5.1: On initial render (mock data), care timeline shows ≥7 stages with at least 1 "active" step and at least 3 "completed" steps
  - `rule` TR-5.2: Upcoming appointment card shows non-empty doctor name, date, time, and type; clicking type-appropriate CTA does not crash
  - `rule` TR-5.3: Prescriptions list shows ≥2 entries with distinct fulfillment status badges (Verified / Dispatched / Delivered)
  - `rubric` TR-5.4: Information hierarchy; scale 1-5; anchors (1=no hierarchy, 3=ok but crowded, 5=primary info in header/timeline, secondary in right-column cards, scannable); threshold >= 4
  - `rubric` TR-5.5: Mobile (390px) layout; scale 1-5; anchors (1=overlap/scroll, 3=usable with long scroll, 5=stacked cleanly, touch targets ok, no horiz overflow); threshold >= 4

## Task 6: AI Health Intake Flow
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3, 4
- **Description**:
  - Build `/intake` route
  - Step 1 form (controlled via react-hook-form + zod):
    - "What are you experiencing?" (textarea, required, min 10 chars, max 2000)
    - Duration (select: <1 day, 1-3 days, 4-7 days, 1-2 weeks, >2 weeks, chronic)
    - Age (number input, 0-120)
    - Gender (radio: Female / Male / Other / Prefer not to say)
    - Known pre-existing conditions (checkbox group: Diabetes, Hypertension, Asthma, Heart disease, Thyroid, None of these)
    - Submit button with loading state
  - Step 2 (AI response card, appears after submit with 400-600ms loading skeleton):
    - Organized information: structured "What you told us" card with symptoms/duration/age/conditions bullets
    - Suggested next step: primary specialty recommendation (e.g., "General Medicine") with bold + CTA "Book this specialist"
    - Relevant questions: 3-4 bulleted questions a doctor would ask
    - Possible care pathway: 2-3 bullet options (1. See GP in-person, 2. Video consult today, 3. Monitor at home with follow-up in 48h)
    - Prominent disclaimer at bottom
  - "Book appointment with suggested specialist" CTA → navigates to `/book-appointment` pre-selecting the specialty (pass via query param or store temporary state)
- **Acceptance Criteria Addressed**: AC-3, AC-12, AC-16
- **Test Requirements**:
  - `rule` TR-6.1: Submitting empty form → validation errors on required fields; no crash
  - `rule` TR-6.2: Valid submission ("headache for 3 days with mild fever") → AI card shows all 4 sections (info / next-step / questions / pathway) and disclaimer
  - `rule` TR-6.3: Clicking "Book this specialist" routes to `/book-appointment` with specialty pre-selected
  - `rule` TR-6.4: Loading skeleton visible during 400ms-600ms mock processing delay
  - `rubric` TR-6.5: AI disclaimer prominence; scale 1-5; anchors (1=hidden/disclaimer in tooltip, 3=visible in footer small, 5=colored banner above CTA, explicit, non-dismissible on this page); threshold >= 4

## Task 7: Appointment Booking Flow
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 3, 4
- **Description**:
  - Build `/book-appointment` route with 4-step wizard (state via local component or store temp)
  - Step 1: Specialty grid cards (General Medicine, Cardiology, Pediatrics, Dermatology, Orthopedics, Gynecology, ENT, Ophthalmology) — supports pre-selection from intake via store state
  - Step 2: Doctors list filtered by specialty — each row: avatar + name + experience years + rating star + clinic name + consultation fee + next-available slot badge → select
  - Step 3: Calendar + time slot picker (use react-day-picker, show 7 days forward from today; 30-min slots 9:00-17:30; some slots marked unavailable; disable past dates)
  - Step 4: Consultation type segmented control (In-clinic / Video / Phone) + patient note textarea + confirm button
  - Confirmation screen: Booking ID (generated ULID-ish), summary, "Go to my dashboard" CTA + "Book another"
  - On confirm: dispatch `bookAppointment(...)` store action → timeline updates automatically → Patient dashboard shows new appointment
- **Acceptance Criteria Addressed**: AC-4, AC-11, AC-16
- **Test Requirements**:
  - `rule` TR-7.1: Booking a Cardiology appointment with Dr. Sharma, tomorrow 10:30 In-clinic → store appointments count +1; patient dashboard's upcoming-appointment card reflects new doctor+time
  - `rule` TR-7.2: Patient timeline now has new top entry with title "Appointment booked" and correct doctor/specialty
  - `rule` TR-7.3: Validation — no slot picked → error displayed, no crash
  - `rule` TR-7.4: All 4 steps forward + back navigation preserves selections; Back from step 4 to 3 keeps selected date/time

## Task 8: Doctor Dashboard
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3, 4
- **Description**:
  - Build `/dashboard/doctor` route (for Dr. Aarav Sharma, General Medicine — from mock data)
  - Layout: 3-column on xl, 2-column on lg, stacked mobile
    - Left column: Doctor profile header (avatar, name, reg number, clinic, specialty switcher dropdown for demo)
    - Left column lower: Today's appointments list (scrollable) — each item: patient avatar, name, time, type, status pill (Waiting / Ongoing / Completed); clickable to load patient into center
    - Center column (patient workbench):
      - Patient overview (demographics, BP/HR/temp vitals badges, allergies, conditions)
      - Tabs: Timeline (CareTimeline for selected patient), Previous Consults (last 3 cards with doctor/date/summary), Records (lab result list + file icons, click to view mock)
      - AI Summary card (yellow-ish warning border) with `<AIDisclaimer>` banner at top — structured: "Key observations from history + today's vitals... (verify before clinical use)"
      - Prescription builder: add-medicine row form (name, dosage dropdown, frequency, duration days, PRN switch, notes), preview list, "Issue prescription" button
      - Follow-up setter: date picker, type (routine / review-test / specialist-referral), notes, "Set follow-up" button
  - On issue prescription → `createPrescription()` action → patient timeline updates → auto-visible in pharmacy dashboard pipeline (Task 9)
- **Acceptance Criteria Addressed**: AC-5, AC-11
- **Test Requirements**:
  - `rule` TR-8.1: Dashboard loads with ≥3 today's-appointment entries with distinct statuses
  - `rule` TR-8.2: AI Summary card contains exact banner text "AI-generated summary — verify before clinical use."
  - `rule` TR-8.3: Adding 2 medicines then "Issue prescription" → new Prescription entity in store + care timeline gains "Prescription generated" event
  - `rule` TR-8.4: Setting follow-up date 7 days forward → Follow-up appears on patient dashboard (Task 5)
  - `rubric` TR-8.5: Clinical-workbench ergonomics; scale 1-5; anchors (1=messy, 3=functional, 5=quick scan, form inputs clean, tabs not cluttered); threshold >= 4

## Task 9: Prescription → Pharmacy Fulfillment Pipeline
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 3, 4, 8 (Task 8 creates initial prescriptions)
- **Description**:
  - Build `/dashboard/pharmacy` route ("Wellness Pharmacy" logged in — mock)
  - Left: Incoming orders list (status filters: All / Created / Verified / Packing / Out for delivery / Delivered)
  - Right: Order detail panel — shows:
    - Patient (name, age, contact — mock)
    - Doctor (name, clinic, reg no.)
    - Prescription items table (medicine, dosage, frequency, duration, quantity, refill count)
    - Doctor notes
    - Status pipeline stepper (Created → Verified → Confirmed → Packing → Out for delivery → Delivered) with each step actionable via button
    - Pharmacist notes field + "Verify order" / "Mark packing" / "Mark dispatched" / "Mark delivered" action buttons per stage
  - Each status transition: `updatePrescriptionStatus()` action → patient timeline events → patient dashboard medicines card updates
  - Summary stats top row: Pending verification, Out for delivery, Delivered today
- **Acceptance Criteria Addressed**: AC-6, AC-11
- **Test Requirements**:
  - `rule` TR-9.1: Initial dashboard shows at least 1 prescription in "Created" status from mock data
  - `rule` TR-9.2: Clicking Verify, then (after confirming) Packing → Out for delivery → Delivered on the same order → final status === "Delivered"; timeline gains 4 distinct events (verification, order confirmed, out-for-delivery, delivered)
  - `rule` TR-9.3: Patient dashboard medicines list updates status badge to "Delivered" after final step
  - `rule` TR-9.4: Pharmacy summary cards numbers reflect current state (Delivered today +1 after successful flow)

## Task 10: Diagnostics Workflow
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 1, 3, 4
- **Description**:
  - Build `/diagnostics` route with tabs: Recommended / Scheduled / Results
  - Recommended: Grid of test cards (Complete Blood Count, Lipid Profile, HbA1c, Thyroid Profile, Liver Function Test, ECG, X-Ray Chest — each with: test name, description, price (₹), lab partner, TAT, preparation instructions, "Schedule" CTA)
  - Schedule dialog: Lab selector, date/time (30-min slots 7:00-19:00), home-collection toggle (+₹99 if on), address (mock), confirm
  - Scheduled tab: list of upcoming tests with countdown to appointment, status Scheduled / Sample Collected / In Progress
  - Results tab: table of completed tests (Test name, Date, Lab, Status — "Report Ready" with "View Report" CTA)
  - Report view mock: table with rows Test Name, Value, Reference Range, Unit, Interpretation badge (Normal/Borderline/High/Low) + doctor comment line + "Share with doctor" action
  - Flow: schedule → move through pipeline (via UI buttons or store action shortcuts) → report → results flow to patient dashboard and timeline
- **Acceptance Criteria Addressed**: AC-7, AC-11
- **Test Requirements**:
  - `rule` TR-10.1: Recommended tab shows ≥7 tests with price non-empty
  - `rule` TR-10.2: Scheduling CBC → new entry in diagnostics store; patient timeline gains "Diagnostic test scheduled"
  - `rule` TR-10.3: Advancing CBC through Scheduled → Collected → In Progress → Report Ready → results table shows ≥6 result rows with reference ranges and interpretation badges
  - `rule` TR-10.4: "Diagnostic result available" event added to patient timeline; patient dashboard diagnostics card reflects completed

## Task 11: Follow-up Workflow
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 1, 3, 4
- **Description**:
  - Build `/follow-up` route (also accessible as a tab/link from patient & doctor dashboards)
  - Header: "Continuity of Care" with copy "This is not a one-time visit. Follow-ups keep you healthy between consultations."
  - Active follow-up card: big date tile, doctor name, purpose, countdown days, status pill (Upcoming / Overdue / Completed)
  - Reminder settings: Radix switches for App notification / Email / WhatsApp — all mock toggles with "Simulated" badge
  - Doctor review section: "What to check at this visit" bullet list (from Task 8 doctor notes)
  - Test review section: If linked diagnostic results available → inline cards with "Review with doctor"
  - Next care step options: radiogroup-style cards (Continue routine follow-up in 4 weeks / Escalate to specialist / Consider discharge if stable / Repeat test in 2 weeks + Continue) — selection saves to store
  - Timeline block at bottom: shows how follow-up fits overall care journey
- **Acceptance Criteria Addressed**: AC-8, AC-11
- **Test Requirements**:
  - `rule` TR-11.1: Page shows at least 1 active follow-up with non-empty date / doctor / purpose / status
  - `rule` TR-11.2: Toggling all 3 reminder switches → state persists (store); page reload shows same state
  - `rule` TR-11.3: Selecting "Continue routine follow-up in 4 weeks" → next-care-step updates in store; patient dashboard follow-up card shows new date
  - `rule` TR-11.4: "Follow-up due" event present on patient timeline

## Task 12: NFC / QR Identity Prototype
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 1, 3, 4
- **Description**:
  - Enhance `/identity` route (replace existing placeholder)
  - Prototype flow, 4 screens, carousel or stepper:
    - Screen 1 "Tap or scan your Curalives Card": visual NFC card mock (rounded rectangle with gradient + chip icon) + QR code illustration, "Prototype mode" banner, primary button "Start simulation"
    - Screen 2 "Identity verified": Green check, patient name (mock), "Identity confirmed. Waiting for consent request..." auto-advance 2s or "Continue"
    - Screen 3 "Consent required": Card with requester (Dr. Aarav Sharma / Sunrise Clinic), Purpose: "Today's consultation", Access duration: "Temporary · 2 hours from grant". Scope selector checkboxes (Basic Info, Consultation History, Prescriptions, Diagnostics Reports, Allergies & Chronic Conditions) — all checked by default. Primary "Allow access" and Secondary "Decline"
    - Screen 4 "Authorized view (Dr. Sharma)": Shows selected-scope patient info (if only Basic + Prescriptions checked → show those 2 cards only). Banner: "Temporary access · Expires in 2 hours · Consent granted 2 min ago" with "End session now" link
  - All steps can go backward (prev button)
  - Explicit disclaimer top of every screen: "This is a Curalives identity prototype. Not a real ABHA/ABDM integration."
- **Acceptance Criteria Addressed**: AC-9, AC-10 (consent dialog portion), AC-16
- **Test Requirements**:
  - `rule` TR-12.1: Prototype disclaimer text "Not a real ABHA/ABDM integration" present verbatim on screen 1
  - `rule` TR-12.2: Navigating flow 1→2→3→4 works; back 4→3→2 preserves selections (scope checkboxes state preserved)
  - `rule` TR-12.3: On Screen 3, unchecking Diagnostics Reports → Screen 4 does NOT render Diagnostics card
  - `rule` TR-12.4: Clicking "Allow access" on Screen 3 → writes a ConsentAuditEntry to store; `/consent` audit history table includes new row (Task 13 verifies)

## Task 13: Consent + Audit History
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 1, 3, 4, 12
- **Description**:
  - Build reusable ConsentDialog component (`src/components/curalives/consent-dialog.tsx`): accepts requester, scope[], purpose, duration props; shows structured layout with Allow / Decline; dispatches consent store actions on user decision; used by identity flow and as general-purpose modal (accessible via button anywhere for demo)
  - Build `/consent` route: Page title "Consent & Access History"
    - Section 1 "Current active access grants": card list of active consents (requester, scope, purpose, expires-in) with "Revoke" action per row
    - Section 2 "Access & Audit History": full data table (columns: Date & time, Requester, Requested info, Purpose, Duration, Action, By) with ≥5 mock rows (Granted / Declined / Revoked); sortable by date
    - Section 3 "Consent principles": 4 info cards (Minimum necessary access, Time-bound, Patient-controlled, Full audit trail)
  - Revoke action → moves consent to revoked; adds audit entry; triggers toast via sonner
- **Acceptance Criteria Addressed**: AC-10, AC-11, AC-16
- **Test Requirements**:
  - `rule` TR-13.1: ConsentDialog renders 5 fields (requester name, requested info scope list, purpose, duration, Allow/Decline buttons); no fields empty
  - `rule` TR-13.2: Audit history table initial state ≥3 mock rows; after Task 12 "Allow access" → +1 row with correct requester/action
  - `rule` TR-13.3: Clicking "Revoke" on an active-consent row → toasts "Access revoked"; action changes to Revoked in audit table
  - `rule` TR-13.4: Decline on consent dialog → audit row with Declined; no data access shown

## Task 14: Landing Page Upgrade to Premium Healthcare-Tech
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 3 (reusable Card/Badge), 4 (nav)
- **Description**:
  - Rework `/` (index.tsx) to match spec; reuse existing structure as starting point but expand sections
  - Hero: bigger headline "One solution. One platform. One connected healthcare journey." sub-headline, dual CTA ("Explore patient journey" → scrolls to journey section; "See how it works for clinics" → scrolls to doctors section)
  - How Curalives works (3 numbered cards: 1. Intake & triage AI assist, 2. Doctor consult & prescription, 3. Pharmacy + diagnostics + follow-up continuity)
  - Connected healthcare journey: Visual 8-step horizontal flow (desktop) / vertical (mobile): Appointment booked → AI pre-consult summary → Doctor consults → Prescription generated → Pharmacy verifies & dispenses → Diagnostics collected → Reports returned → Follow-up → Ongoing care (animated status dots)
  - Patient experience section: Screenshot-like mockup card (show Patient Dashboard's timeline visually represented — via SVG/CSS, not screenshot) + bulleted benefits
  - Doctor/Clinic experience: Benefits cards + "Voice capture" demo like existing (keep current Mic demo but polish)
  - Pharmacy experience: 3 fulfillment pipeline stage illustrations (cards) with 3 benefits
  - Diagnostics: Test scheduling / results flow illustration + benefits
  - AI intelligence layer: "AI is the orchestrator, never the decider" with 4 bullet boundaries (never diagnoses, never prescribes unsupervised, never signs record, always labellable)
  - Trust & Security: 6 principle cards (Consent-first, Indian data residency-ready, Role-based access, Audit everything, Synthetic-first prototype, Minimum-necessary share)
  - Final CTA: same primary section as current but stronger copy
  - Remove any traffic-light (red/amber/green) status badges per user preference preferences — use teal/navy/slate only for status tones unless emergency (already have emergency token but use only for actual emergencies, not routine statuses)
- **Acceptance Criteria Addressed**: AC-1, AC-14, AC-18
- **Test Requirements**:
  - `rule` TR-14.1: All 10 sections (Hero, How it works, Connected journey, Patient, Doctor, Pharmacy, Diagnostics, AI layer, Trust/Security, CTA) have non-empty visible content when page is fully rendered
  - `rule` TR-14.2: Hero headline matches "One solution. One platform. One connected healthcare journey." verbatim or close semantic match
  - `rule` TR-14.3: Connected journey visualization shows 8 stages with distinct step markers
  - `rubric` TR-14.4: Premium healthcare-tech aesthetic; scale 1-5; anchors (1=generic SaaS gradient-hell, 3=ok generic, 5=calm/trustworthy, mint/navy/teal tokens, no over-animation, feels serious not gimmicky); threshold >= 4
  - `rubric` TR-14.5: Mobile layout; scale 1-5; anchors (1=broken, 3=scrollable ok, 5=stacked clean, journey visual converts to vertical cleanly); threshold >= 4
  - `rule` TR-14.6: No RAG (red/amber/green) statuses except the `emergency` token for actual emergency callouts — audit all pages

## Task 15: Build, Typecheck, and Build-Time QA
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 5-14 (all feature work)
- **Description**:
  - Run `npm run typecheck` — fix 100% of TS errors
  - Run `npm run build` — fix 100% of build errors (Vite SSR, TanStack route generation, import paths)
  - Verify `routeTree.gen.ts` auto-generated correctly for all new routes
  - Ensure no missing component exports, unused imports, stray console.log
  - Run eslint where relevant
  - Fix any runtime errors that surface during build's SSR hydration step
- **Acceptance Criteria Addressed**: AC-15
- **Test Requirements**:
  - `rule` TR-15.1: `npm run typecheck` exit code 0 (record output)
  - `rule` TR-15.2: `npm run build` exit code 0 (record output)
  - `rule` TR-15.3: `.vercel/output/` generated with all routes listed in config
  - `rubric` TR-15.4: Code cleanliness; scale 1-5; anchors (1=many TS anys / eslint warnings, 3=minor anys, 5=no anys, strict nulls honored, clean exports); threshold >= 4

## Task 16: Browser QA + Flow Testing (Critical Path)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 15
- **Description**:
  - Start dev server via `startup.sh`
  - Run `node scripts/browser-smoke.mjs` against dev server (127.0.0.1:8080)
  - Manually drive browser via MCP/integrated browser to test critical flows:
    1. Landing → all sections visible → no console errors
    2. Intake → fill form → submit → AI card + disclaimer → Book specialist arrives at booking step 2 with specialty selected
    3. Complete booking → verify Patient dashboard timeline gains "Appointment booked"
    4. Doctor dashboard → select patient → issue prescription → verify Prescription in Pharmacy dashboard Created
    5. Pharmacy: advance status to Delivered → verify Patient dashboard medicines status
    6. Diagnostics: schedule CBC → verify scheduled → simulate report → results on patient dashboard
    7. Identity: simulate flow → Allow → verify `/consent` gains audit entry
    8. Mobile view: open each dashboard at 390x844, check no horizontal scroll
  - All bugs found → fix immediately, add to "Bugs found and fixed" list
  - Second QA pass specifically for: broken flows, poor UX, inconsistent states, a11y, security, loading/empty states, mobile problems
- **Acceptance Criteria Addressed**: AC-1 through AC-10, AC-13, AC-14, AC-16, AC-18
- **Test Requirements**:
  - `rule` TR-16.1: browser-smoke.mjs JSON verdict shows consoleErrors=0 for both desktop and mobile
  - `rule` TR-16.2: All 8 critical-path manual flows complete without crashes or stuck states
  - `rule` TR-16.3: Mobile 390x844 5 screens (landing, patient-dash, doctor-dash, pharmacy, identity) — zero horizontal scrollbars / overflow
  - `rubric` TR-16.4: Second-pass QA bug count; scale 1-5; anchors (1=>10 bugs, 3=3-9, 5=0-2 minor UX); threshold >= 4

## Task 17: Production Build Verification + Deploy to Vercel
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 16
- **Description**:
  - Run `npm run build` (again after QA fixes)
  - Run `npm run preview` (strict 8081)
  - Run browser-smoke against preview with --baseline to confirm no prod-only divergence
  - Deploy via Vercel integration (`deploy_to_remote` tool)
  - Open live URL and verify routing and key dashboards render correctly
  - Verify no "Failed to load module script MIME type text/html" errors in prod (§8 of AGENTS.md)
- **Acceptance Criteria Addressed**: AC-17
- **Test Requirements**:
  - `rule` TR-17.1: Production build browser-smoke matches dev baseline (no divergent routes; no MIME module errors)
  - `rule` TR-17.2: Deployed URL returns 200 on /, /dashboard/patient, /dashboard/doctor, /dashboard/pharmacy, /intake, /book-appointment, /diagnostics, /follow-up, /identity, /consent; no 404s
  - `rule` TR-17.3: Live site has zero console uncaught errors on first paint for landing
  - `rule` TR-17.4: No secrets in deployed bundle (grep .vercel output for sk-/pk-like strings)

## Task 18: Final Polish Pass and Engineering Summary
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 17
- **Description**:
  - Final copy pass for consistent "Curalives" spelling and tone (trustworthy, calm, human)
  - Confirm all disclaimers: prototype banners on identity/intake, AI labels on AI summaries, "not medical advice" general disclaimer visible globally
  - Ensure `startup.sh` idempotent and updated with `npm run dev` (already exists — verify)
  - Update public brand assets if needed (favicon, og)
  - Generate final engineering summary output for user: What was built, Architecture, Key product decisions, Security decisions, AI decisions, Tests performed, Bugs found & fixed, Deployment result, Live URL, Recommended next steps
- **Acceptance Criteria Addressed**: AC-16, AC-18, NFR (general polish)
- **Test Requirements**:
  - `rule` TR-18.1: All pages have prototype/AI disclaimers where AC specifies
  - `rule` TR-18.2: `startup.sh` exists and is executable; running it twice doesn't double-start (idempotency)
  - `rubric` TR-18.3: Overall product polish; scale 1-5; anchors (1=buggy/incomplete, 3=MVP functional, 5=production-quality demo ready for investor walkthrough); threshold >= 4
