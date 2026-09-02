# Curalives MVP - Product Requirements Document

## Overview
- **Summary**: A complete end-to-end working prototype of Curalives — an AI-native healthcare infrastructure platform connecting patients, doctors, clinics, pharmacies, diagnostics, health records, AI orchestration, and follow-up into one continuous healthcare journey.
- **Purpose**: Demonstrate the "One solution. One platform. One connected healthcare journey." concept as a polished, production-quality prototype that is fully functional with synthetic data and publicly deployable.
- **Target Users**: Patients, doctors/clinics, pharmacists, diagnostics labs, platform evaluators, and investors.

## Goals
1. Build a fully navigable, responsive web application with 10 integrated user experiences
2. Demonstrate the entire connected care journey using mock/synthetic data
3. Implement role-based dashboards (Patient, Doctor, Pharmacist) with real state transitions
4. Provide AI as an orchestration layer (not a diagnosis tool) with appropriate disclaimers
5. Build with a clean, premium healthcare-tech aesthetic (trustworthy, calm, human, simple)
6. Deploy publicly to a production URL
7. Pass build, typecheck, and browser-smoke QA with zero errors

## Non-Goals
- Real medical diagnosis or treatment recommendations
- Real ABHA/ABDM integration (architected for future integration only)
- Real prescription processing or real patient health data
- Real payment processing or billing integration
- Real user authentication accounts (auth is OFF per §0.5; role switching is simulated)
- Real NFC hardware communication (simulated prototype only)
- Real email/SMS delivery (simulated)

## Background & Context
The project is scaffolded with:
- **Stack**: TanStack Start (full-stack React meta-framework), React 19, TypeScript 5.7
- **Styling**: Tailwind CSS v4 with existing design tokens (navy #173b55, primary #1f557d, teal #57958f, mint #94c2ae, mint-bg #eaf4f0, blue-tint #eaf2f7, slate #4f6573)
- **Typography**: Montserrat (display) + Inter (body) via Google Fonts
- **UI**: Radix UI primitives (accordion, dialog, tabs, dropdown, select, etc.), lucide-react icons, recharts, sonner toasts, date-fns
- **State**: Zustand stores (to be added) + React hooks
- **Routing**: TanStack Router (file-based in `src/routes/`)
- **Existing pages**: `/` (landing), `/doctors`, `/patients`, `/identity`, `/pricing`, `/insights`, `/insights/$slug`, `/about`, `/book-demo`, `/support`, `/privacy`, `/terms`, `/refund`, `/invest`
- **Existing components**: SiteShell (header + footer), ClinicCanvas, Button
- **Build target**: Vercel (nitro output), dev server on `0.0.0.0:8080`

## Functional Requirements

### FR-1: Landing Page
- Upgrade/rework the existing landing page to include: Hero, How it works, Connected journey, Patient experience, Doctor/Clinic experience, Pharmacy experience, Diagnostics, AI intelligence layer, Trust/Security, CTA
- Premium, serious healthcare-tech aesthetic; no generic SaaS template feel
- Mobile responsive; anchor-linked sections

### FR-2: Patient Dashboard
- Route: `/dashboard/patient`
- Display: Patient name, profile summary, care status badge
- Care journey timeline with ordered stages (Booked → Consulted → Prescribed → Pharmacy Verified → Dispatched → Diagnostic Scheduled → Follow-up Due)
- Upcoming appointment card (with doctor, date/time, type, status)
- Recent consultation card (summary, date, doctor)
- Prescriptions list (medication, dosage, duration, refills)
- Medicines list with fulfillment status
- Diagnostics (scheduled tests + recent results)
- Follow-up (next date, reminder)
- Health records summary (count, recent)
- Timeline events are state-connected: actions in other views update this timeline

### FR-3: AI Health Intake
- Route: `/intake`
- Patient enters: symptoms description, duration, basic info (age, gender, any pre-existing conditions via checkboxes)
- AI interface shows: organized information card, suggested next step, relevant follow-up questions, possible care pathway options
- Prominent disclaimer: "This is an informational care-navigation prototype and does not provide a medical diagnosis."
- CTA: "Book appointment with suggested specialist" → pre-fills booking flow
- AI service uses `MockAIService` via `AIService` abstraction

### FR-4: Appointment Booking
- Route: `/book-appointment`
- Step 1: Select specialty (Cardiology, General Medicine, Pediatrics, Dermatology, Orthopedics, etc.)
- Step 2: Browse doctors (avatar, name, specialty, experience, rating, clinic, consultation fee, next available slot)
- Step 3: Select date/time availability (calendar view with time slots)
- Step 4: Choose consultation type (In-clinic, Video call, Phone call)
- Step 5: Confirmation (summary, booking ID, add to calendar action)
- After booking: patient timeline updates with "Appointment booked" event and appointment appears in patient dashboard upcoming section

### FR-5: Doctor Dashboard
- Route: `/dashboard/doctor`
- Today's appointments list (patient name, time, type, status: waiting/ongoing/completed)
- Patient overview (demographics, vitals, allergies, key conditions)
- Patient timeline (visit history, events)
- Previous consultations (last 3 summaries)
- Relevant records (lab results, prescriptions)
- AI-generated record summary with explicit banner: "AI-generated summary — verify before clinical use."
- Prescription section (add medication, dosage, frequency, duration, notes; pharmacy selection)
- Follow-up section (set date, type, notes)
- Doctor remains responsible for clinical decisions

### FR-6: Prescription → Pharmacy Workflow
- Doctor completes prescription → triggers status pipeline: Created → Pharmacy verification → Order confirmed → Packing → Out for delivery → Delivered
- Route: `/dashboard/pharmacy` (Pharmacist dashboard)
- Pharmacist sees: incoming orders list with patient, doctor, medicines, status
- Order detail view: prescription review (drug, dosage, quantity, refills, doctor notes, patient info)
- Pharmacist actions: Verify order, Mark packing, Mark out-for-delivery, Mark delivered
- Each status transition updates: patient timeline, patient dashboard medicines section, prescription tracking card
- Realistic mock prescription data

### FR-7: Diagnostics Workflow
- Route: `/diagnostics`
- Recommended tests (by doctor or AI suggestion) with description, price, lab, preparation instructions
- Schedule a test (select lab, date/time slot, home collection / walk-in)
- Test status tracking: Scheduled → Sample Collected → In Progress → Report Ready
- Mock results view: test name, value, reference range, unit, interpretation (Normal / Borderline / High)
- Result flows back into patient's healthcare timeline and records

### FR-8: Follow-up Workflow
- Route: `/follow-up` (accessible from both patient and doctor dashboards)
- Follow-up card: date, doctor, purpose, status (Upcoming / Overdue / Completed)
- Reminder toggle (email, app notification — simulated)
- Doctor review section: summary of what to check
- Diagnostic result review: link to relevant test reports
- Next care step: recommendation (routine follow-up, escalate, discharge, repeat test, refer specialist)
- Continuity is visible on the patient timeline

### FR-9: NFC / QR Experience Prototype
- Route: `/identity` (enhance existing)
- Prototype screen: "Tap or scan your Curalives Card" with visual NFC/QR illustration
- Animated flow: Identity verified → Consent required → Patient chooses scope → Authorized provider sees relevant info
- Consent scope selection: checkboxes for what to share (Basic Info, Consultation History, Prescriptions, Diagnostics, Allergies & Conditions)
- Provider view after authorization: limited-scope view with "Temporary access, expires in 2 hours" banner
- Clear "Prototype simulation" banner

### FR-10: Consent + Security
- Consent dialog (reusable modal component): Who is requesting access, What info, Why needed, How long access lasts, Allow / Decline actions
- Route: `/consent` — access & audit history table
- Audit entries: timestamp, requester (doctor/clinic/pharmacy/lab), info accessed, purpose, scope, duration, action (Granted / Declined / Revoked)
- Revoke access action from the history page

### FR-11: Data Model & Mock Layer
- Entities with TypeScript interfaces: Patient, Doctor, Clinic, Appointment, Prescription, Medicine, Pharmacy, DiagnosticTest, DiagnosticResult, HealthRecord, CareJourneyEvent, ConsentRequest, ConsentAuditEntry, Notification
- Synthetic/mock data with realistic Indian context (names, clinics, labs, fees in INR)
- Zustand store (`useCuralivesStore`) holds all state, exposes actions for role-based operations
- Store actions are the single source of truth — every UI component reads/writes via the store

### FR-12: AI Service Abstraction
- `AIService` interface: `intakeSymptoms(symptoms, context)`, `summarizeConsult(notes, history)`, `suggestCarePathway(profile)`, `suggestTests(consult)`
- `MockAIService`: implements interface with deterministic, controlled mock responses (no randomness that breaks QA)
- `RealAIService` placeholder class with same interface, not wired; reads from env vars if available
- No API keys in frontend code

### FR-13: Role Switching & Navigation
- Top-level role selector (Patient / Doctor / Pharmacist) in the header — visible as part of the prototype experience
- Role selector switches the dashboard view and updates which navigation items are visible
- Persists selection in localStorage

### FR-14: Navigation & Routing
- All 10 experiences reachable via URL routes and via in-app navigation
- No broken links; back/forward navigation works
- Mobile nav drawer works on existing responsive breakpoints

## Non-Functional Requirements
- **NFR-1 (Responsive)**: All views render correctly at 390×844 (mobile) and 1440×900 (desktop); no horizontal scroll; touch targets ≥44px
- **NFR-2 (Build)**: `npm run build` exits with code 0; `npm run typecheck` exits with code 0
- **NFR-3 (No Errors)**: Browser-smoke script reports zero uncaught errors; console is clean
- **NFR-4 (Accessibility)**: Semantic HTML; keyboard-navigable modals/tabs; `aria-label` on icon-only buttons; focus states visible
- **NFR-5 (Loading/Empty States)**: Components have loading skeletons or fallback empty states where data would appear
- **NFR-6 (Performance)**: No infinite re-renders; Zustand selectors used; interactions feel snappy
- **NFR-7 (Security)**: All synthetic data only; no hardcoded secrets; inputs validated (zod schemas for forms); role separation enforced via store selectors
- **NFR-8 (Design Fidelity)**: Consistent tokens, spacing, typography across all views; no traffic-light color coding per user preferences; calm/premium aesthetic
- **NFR-9 (Deployable)**: Builds with Vercel nitro preset; routing works on deployed static+SSR output
- **NFR-10 (AI Labeling)**: All AI-generated content has explicit disclaimer banners; never presented as clinical truth without human review

## Constraints
- **Technical**: TanStack Start + React 19 + Tailwind v4 is fixed; cannot swap to Next.js or other frameworks
- **Technical**: No `npm install` scripts by default; if native modules needed, use `GROK_ALLOW_INSTALL_SCRIPTS=1`
- **Business**: Mock/SYNTHETIC data ONLY; no real PHI; explicit prototype labeling
- **Dependencies**: No external LLM API keys available (use MockAIService)
- **Dependencies**: Pre-wired libs only (add any new JS packages via npm install as needed)

## Assumptions
1. Role switching in the prototype is done via UI toggle (not real auth) — acceptable because this is a demo prototype
2. Zustand + localStorage is sufficient for state persistence across sessions in the prototype
3. No real backend needed; mock data layer handles everything until the store is swapped
4. Browser-smoke.mjs can be run against dev server for QA
5. Vercel deployment uses existing `.vercel` output structure
6. A 30-second visitor should understand "connected journey" from landing page + patient dashboard alone

## Acceptance Criteria

### AC-1: Landing page has all required sections
- **Type**: `rule`
- **Given**: User loads `/`
- **When**: User scrolls through the page
- **Then**: Hero, How it works, Connected journey, Patient experience, Doctor experience, Pharmacy experience, Diagnostics, AI layer, Trust/Security, and final CTA sections are all visible with content
- **Pass Condition**: All sections render with non-empty content; no section throws during render
- **Evidence**: browser-smoke screenshot of landing; console error count = 0

### AC-2: Patient dashboard shows connected timeline
- **Type**: `rule`
- **Given**: User navigates to `/dashboard/patient`
- **When**: View renders
- **Then**: Patient name, care timeline (≥7 stages), upcoming appointment, recent consultation, prescriptions list, medicines status, diagnostics list, follow-up card, and records summary are all visible
- **Pass Condition**: All 8 components render with non-empty mock data
- **Evidence**: browser-smoke screenshot of patient dashboard; console error count = 0

### AC-3: AI intake flow works with disclaimer
- **Type**: `rule`
- **Given**: User opens `/intake`
- **When**: User fills symptoms ("headache for 3 days, mild fever"), duration "3 days", checks "no known conditions", submits
- **Then**: AI-organized info card + suggested next step ("See General Medicine") + relevant follow-up questions + care pathway appear; diagnosis disclaimer is prominently visible
- **Pass Condition**: 4 AI sections render; disclaimer text contains "does not provide a medical diagnosis"; submit does not throw
- **Evidence**: Screenshot of intake result; console error count = 0

### AC-4: Booking flow updates patient timeline
- **Type**: `rule`
- **Given**: Fresh store state; user at `/book-appointment`
- **When**: User selects Cardiology → picks Dr. Sharma → picks next available date/time → In-clinic → confirms
- **Then**: New appointment appears in patient dashboard "Upcoming appointment"; "Appointment booked" event added to care timeline
- **Pass Condition**: Store `appointments` array length increases by 1; patient timeline includes new booking event; no errors
- **Evidence**: Timeline item count diff; screenshot pre/post

### AC-5: Doctor dashboard shows appointments and AI summary banner
- **Type**: `rule`
- **Given**: User at `/dashboard/doctor`
- **When**: Renders
- **Then**: Today's appointments list shows ≥1 patient; patient overview visible; AI summary card shows banner text "AI-generated summary — verify before clinical use."; prescription + follow-up sections present
- **Pass Condition**: All 5 sub-sections render; AI banner text present verbatim
- **Evidence**: Screenshot of doctor dashboard; grep for banner text returns match

### AC-6: Pharmacy pipeline status transitions
- **Type**: `rule`
- **Given**: Prescription in "Created" status; user at `/dashboard/pharmacy`
- **When**: Pharmacist clicks Verify → Packing → Out for delivery → Delivered in sequence
- **Then**: Each status change updates the order card; patient timeline gains corresponding event; medicines status in patient dashboard updates to match
- **Pass Condition**: Final status === "Delivered"; 4 new timeline events logged; no console errors during transitions
- **Evidence**: Status field value === "Delivered" after sequence; timeline event count diff

### AC-7: Diagnostics scheduling and result flow
- **Type**: `rule`
- **Given**: User at `/diagnostics`
- **When**: User schedules CBC test → then (via store action or UI) moves status Scheduled → Collected → In Progress → Report Ready → views results
- **Then**: Patient timeline records each diagnostic stage; result card shows values with reference ranges; diagnostics section on patient dashboard shows "Completed"
- **Pass Condition**: 4+ timeline events for diagnostics; results table has ≥3 rows with value/range columns
- **Evidence**: Results screenshot; event count

### AC-8: Follow-up continuity visible on timeline
- **Type**: `rule`
- **Given**: Post-consultation follow-up exists
- **When**: User views `/follow-up` and patient dashboard timeline
- **Then**: Follow-up card shows date, doctor, status, reminder toggle; timeline has a "Follow-up due" event; "Next care step" section displays a recommendation
- **Pass Condition**: Card renders all 5 fields; timeline contains follow-up event; next-step text non-empty
- **Evidence**: Screenshots

### AC-9: NFC/QR prototype screens render in sequence
- **Type**: `rule`
- **Given**: User at `/identity`
- **When**: User triggers the prototype flow (tap/scan button)
- **Then**: Flow steps animate or advance through: Identity verified → Consent required → Patient chooses scope → Provider view with access expiry banner; prototype banner always visible
- **Pass Condition**: 4 screens navigable; scope selector has ≥5 checkboxes; "Prototype simulation" banner present
- **Evidence**: Screenshot of provider view with banner

### AC-10: Consent dialog + audit history
- **Type**: `rule`
- **Given**: Consent dialog triggered (from identity flow or consent page)
- **When**: User sees dialog then navigates to `/consent`
- **Then**: Dialog shows requester name, info requested, purpose, duration, Allow/Decline; audit history table ≥5 columns (timestamp, requester, info, purpose, action) with ≥3 mock entries
- **Pass Condition**: All 5 consent-dialog fields present; audit table renders rows; Allow/Decline buttons present
- **Evidence**: Dialog screenshot + audit page screenshot

### AC-11: Data model & state integrity
- **Type**: `rubric`
- **Dimension**: Architectural cleanliness — separation of concerns, store as single source of truth
- **Scale**: 1-5
- **Anchors**: 1 = everything in one component, no types, hardcoded strings; 3 = types exist but store leaky, some direct component-to-component props for state; 5 = strict TS interfaces per entity, all state via Zustand actions, components are pure renderers, store selectors used
- **Pass Threshold**: >= 4
- **Evidence**: Code review of `src/lib/curalives/types.ts`, `src/lib/curalives/store.ts`, and representative dashboards

### AC-12: AI service abstraction
- **Type**: `rule`
- **Given**: Codebase structure
- **When**: Inspecting AI code
- **Then**: `AIService` interface exists; `MockAIService` and `RealAIService` classes both implement it; no dashboard imports `MockAIService` directly (only via factory/DI)
- **Pass Condition**: 3 files/exports present; grep shows only factory creates concrete service
- **Evidence**: Grep + file listing

### AC-13: Role switching + navigation integrity
- **Type**: `rule`
- **Given**: Any page
- **When**: User toggles role Patient → Doctor → Pharmacist → Patient
- **Then**: Header role indicator updates; dashboards route correctly; no stuck states; all top-nav links resolve to 200
- **Pass Condition**: Route transitions all succeed; console error count remains 0; nav links non-404
- **Evidence**: Curl/list of all routes; role toggle screenshots

### AC-14: Responsive mobile layout
- **Type**: `rubric`
- **Dimension**: Mobile viewport quality (390×844) across landing + 4 key dashboards (patient, doctor, pharmacy, identity)
- **Scale**: 1-5
- **Anchors**: 1 = horizontal scroll everywhere, overlap, text cut off; 3 = usable but cramped; 5 = no overflow, tap targets ≥44px, all content reachable without horizontal scroll
- **Pass Threshold**: >= 4
- **Evidence**: Mobile smoke screenshots + visual inspection for horizontal scrollbars

### AC-15: Build & typecheck pass
- **Type**: `rule`
- **Given**: Clean project state
- **When**: `npm run build` and `npm run typecheck` run
- **Then**: Both exit 0
- **Pass Condition**: Exit codes both 0
- **Evidence**: Terminal output of both commands

### AC-16: Security & prototype labeling
- **Type**: `rule`
- **Given**: All views
- **When**: App is browsed
- **Then**: No real patient names/DOB/contact; prototype/AI banners present on AI, intake, identity pages; input forms have validation (empty submit shows error, not crash)
- **Pass Condition**: Visual check of banners; form validation test on 2 forms; grep for any strings matching real PHI patterns (Indian phone, Aadhaar) returns 0
- **Evidence**: Banner screenshots; form validation test

### AC-17: Vercel deploy succeeds
- **Type**: `rule`
- **Given**: Build passes (AC-15)
- **When**: Deployed via Vercel
- **Then**: Production URL returns 200 on all defined routes; no MIME type issues on module scripts
- **Pass Condition**: All routes return 200; browser-smoke on preview build matches dev baseline
- **Evidence**: Deployment URL; production browser-smoke JSON

### AC-18: First-time concept clarity (30-second test)
- **Type**: `rubric`
- **Dimension**: Concept transmission — landing + patient dashboard together communicate "connected continuous healthcare journey"
- **Scale**: 1-5
- **Anchors**: 1 = random screens, no narrative, no journey visible; 3 = timeline exists but isolated, Curalives value not obvious; 5 = landing's "connected journey" copy + visible patient timeline with 7+ stages + status badges make the product narrative instantly clear
- **Pass Threshold**: >= 4
- **Evidence**: Landing + dashboard screenshots; copy/timeline visual inspection

## Open Questions
- [x] Auth? No — §0.5 (no sign-in/per-user ask); role switching via UI toggle instead. (Decided)
- [x] Database? No — §0.5 (local data + Zustand + localStorage; shared durable backend not required for prototype single-user demo). (Decided)
- [x] Real LLM? No — MockAIService only, abstraction for future. (Decided — no keys configured)
