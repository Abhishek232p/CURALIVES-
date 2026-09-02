import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({ component: TermsPage });

const sections = [
  ["Nature of service", "CuraLives is a technology intermediary. It does not create a doctor–patient relationship with you. It does not provide medical advice, diagnosis or treatment."],
  ["Eligibility", "Clinic users must be licensed practitioners or authorised staff. Patients must provide accurate identity information."],
  ["AI", "AI outputs are drafts or explanations. Clinical records require explicit doctor approval. Patient-facing AI is not a doctor."],
  ["Accounts", "You are responsible for devices and OTP access. We may suspend accounts that violate these terms or applicable law."],
  ["Payments", "Subscription fees are billed as agreed in an order form or in-product plan. The clinic app does not collect clinical visit payments in Phase 1."],
  ["Limitation", "To the extent permitted by law, CuraLives is not liable for clinical outcomes, third-party networks, or user misuse."],
  ["Governing law", "These terms are governed by the laws of India."],
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Terms of use</h1>
      <p className="mt-2 text-sm text-slate">Last updated August 2026</p>
      <div className="mt-8 space-y-6">
        {sections.map(([t, b]) => (
          <section key={t}>
            <h2 className="font-display text-lg font-semibold text-navy">{t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">{b}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
