import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/patients")({ component: PatientsPage });

function PatientsPage() {
  const loops = [
    ["Health space", "Timeline of visits, documents, medicines and follow-ups you actually own."],
    ["Document capture", "Camera or upload. Original stays original. Extracted details wait for your confirmation."],
    ["Medicines", "Plans from confirmed details. Taken, skipped, missed — recorded without nagging."],
    ["Sharing", "Pick the slice, pick the person, pick the duration. Revoke any time."],
    ["Family", "Scoped caregiver access. Never assumed permanent."],
    ["Reminders", "App or WhatsApp — only with explicit consent."],
  ];

  return (
    <div>
      <section className="bg-blue-tint">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">CuraLives Pocket</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold text-navy">
            Your health history should not live in a plastic bag.
          </h1>
          <p className="mt-4 max-w-xl text-slate">
            Capture, organise, remember, share, act, follow up. You stay in control. CuraLives is not a doctor.
          </p>
          <div className="mt-7 flex gap-3">
            <Link to="/book-demo">
              <Button size="lg">Join the waitlist</Button>
            </Link>
            <Link to="/identity">
              <Button size="lg" variant="secondary">
                NFC & QR
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loops.map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-grey bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-navy">{t}</h2>
              <p className="mt-2 text-sm text-slate">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-slate">
          Master loop: Discover → Join → Consent → Create health space → Capture → Organise → Understand → Remember → Share → Act → Follow up → Learn → Return.
        </p>
      </section>
    </div>
  );
}
