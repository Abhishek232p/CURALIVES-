export const site = {
  name: "CuraLives",
  tagline: "Care for Every Life",
  description:
    "CuraLives is an India-first healthcare continuity platform. Patients keep their records. Clinics run without paper. Care never starts from zero.",
};

export const nav = [
  { to: "/doctors", label: "For Doctors" },
  { to: "/patients", label: "For Patients" },
  { to: "/identity", label: "NFC & QR" },
  { to: "/pricing", label: "Pricing" },
  { to: "/insights", label: "Insights" },
] as const;

export const pricing = {
  individual: [
    {
      name: "Solo",
      price: "₹1,499",
      period: "/ month",
      note: "1 doctor · 30-day start",
      badge: "Most chosen",
      features: [
        "Voice capture & clinical-note draft",
        "Patient records & 2-second context",
        "Daily queue, offline-first",
        "Simple billing & receipts",
        "Public doctor page with QR",
        "Consent logging",
        "English, Hindi + city language",
      ],
    },
    {
      name: "Multi",
      price: "₹3,499",
      period: "/ month",
      note: "Up to 5 doctors",
      badge: "Best value",
      features: [
        "Everything in Solo",
        "Role-based staff access",
        "Shared live queue",
        "Medication & follow-up reminders",
        "Consent-based record sharing",
        "WhatsApp reminder channel",
        "Priority onboarding",
      ],
    },
    {
      name: "Enterprise",
      price: "₹6,999+",
      period: "/ month",
      note: "Clinics & hospital groups",
      badge: null,
      features: [
        "Everything in Multi",
        "Multi-location accounts",
        "NFC / QR identity rollout",
        "Custom workflows",
        "Dedicated success manager",
        "Security review support",
        "Volume pricing",
      ],
    },
  ],
};

export const faqs = [
  {
    q: "What is CuraLives?",
    a: "CuraLives is a healthcare continuity platform. For clinics it is Doctor OS Lite — voice notes, queue, records and receipts that work offline. For patients it is a private health space: documents, medicines, follow-ups, and controlled sharing.",
  },
  {
    q: "Does AI diagnose or prescribe?",
    a: "No. AI drafts notes, extracts document details, translates, and reminds. A doctor must review and approve every clinical record. Patients confirm extracted details. CuraLives never acts as a doctor.",
  },
  {
    q: "Do I need internet in the clinic?",
    a: "The clinic app is offline-first. Queue, records, notes and receipts continue with zero connectivity and sync when the network returns.",
  },
  {
    q: "What is NFC and QR identity?",
    a: "A CuraLives NFC card or personal QR lets a provider request only the information you have already authorised. It is not a full medical dump. Consent still controls every share.",
  },
  {
    q: "Is this connected to ABDM?",
    a: "Records are structured for future ABDM / FHIR compatibility. Live ABHA integration is a later phase and is not required to start.",
  },
  {
    q: "Can family members help?",
    a: "Yes. A patient can grant a caregiver scoped, revocable access. Access is never assumed permanent.",
  },
];

export const insights = [
  {
    slug: "care-should-not-restart-from-zero",
    title: "Healthcare should not restart from zero",
    date: "12 Aug 2026",
    excerpt:
      "Every new visit still begins with the same questions. Continuity is not a feature. It is the missing layer.",
    body: [
      "A patient walks into a clinic carrying papers, a phone full of WhatsApp reports, and a memory of last month’s medicines. The doctor starts from a blank page. That is not care. That is reconstruction.",
      "CuraLives exists because that reconstruction is expensive — in time, in missed context, and in trust. The clinic needs a working copy of the visit that survives a power cut. The patient needs a place that holds the original document and the confirmed details separately.",
      "We do not ask doctors to become typists. We ask them to approve a draft. We do not ask patients to become medical archivists. We ask them to confirm what is already on the page.",
    ],
  },
  {
    slug: "voice-notes-doctor-still-decides",
    title: "Voice notes that the doctor still owns",
    date: "4 Aug 2026",
    excerpt:
      "AI can draft a consult note in seconds. It cannot sign it. That boundary is the product.",
    body: [
      "The fastest way to lose a clinic is to let software pretend it is a clinician. CuraLives drafts. The doctor edits every field. Only then does the note enter the record — and the raw audio is deleted.",
      "That is slower than a fully automatic scribe. It is also the only way a serious clinic will keep using the tool after week two.",
    ],
  },
  {
    slug: "nfc-is-not-the-product",
    title: "NFC is a door, not the house",
    date: "21 Jul 2026",
    excerpt:
      "A tap should open authorised context. It should never dump a lifetime of records onto a stranger’s phone.",
    body: [
      "Hardware is tempting. Cards feel like a moat. They are not. The moat is consent, minimum-necessary access, and a record the patient can revoke.",
      "CuraLives ships NFC and QR as identity surfaces on top of that control layer — not instead of it.",
    ],
  },
];

export const features = [
  {
    title: "Voice capture, doctor approval",
    body: "Speak through the consult. A live draft appears. You edit every field. The note is not a record until you approve it.",
  },
  {
    title: "Queue that survives a blackout",
    body: "Waiting, with the doctor, done. Offline. Almost no training. The day keeps running.",
  },
  {
    title: "Context in two seconds",
    body: "Name or phone. Prior notes and prescriptions. The doctor does not re-ask what the clinic already knows.",
  },
  {
    title: "Receipts without a payment gateway",
    body: "Itemise, export, mark paid or unpaid. Money stays in the clinic’s own rails.",
  },
  {
    title: "NFC & QR identity",
    body: "Tap or scan. Consent first. Only the authorised slice of the record is shown.",
  },
  {
    title: "Patient-owned health space",
    body: "Original documents stay original. Extracted details stay unconfirmed until the patient says so.",
  },
];
