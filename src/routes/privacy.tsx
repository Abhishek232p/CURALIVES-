import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

const sections = [
  ["Introduction", "This policy describes how CuraLives handles personal and health information on the website and product surfaces described here. It is a product-policy draft, not a claim of regulatory certification."],
  ["Information we collect", "Account identifiers (phone, optional email), clinic operational data, health documents you upload, consent events, and technical logs needed to run the service."],
  ["How we use it", "To provide clinic workflows, patient health space, reminders you enabled, and support. AI processing is used to draft or extract — never to silently create a clinical record."],
  ["AI and human oversight", "Drafts and extractions are shown as unconfirmed until a doctor or patient acts. We do not sell health information for advertising."],
  ["Sharing", "With the people and providers you authorise, for the duration you set, and with processors required to operate the platform. Legal requests are handled as required by applicable Indian law."],
  ["Your rights", "Access, correction, withdrawal of consent, and deletion requests where the law allows. Medical-record retention may legally outlast an account closure request."],
  ["Security", "Encryption in transit and at rest is specified for product surfaces. This website itself stores demo requests locally in your browser only."],
  ["Contact", "Use the Support page for privacy requests. We aim to acknowledge within a reasonable period."],
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Privacy policy</h1>
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
