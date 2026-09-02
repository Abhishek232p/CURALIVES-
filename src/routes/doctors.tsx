import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ClinicCanvas } from "@/components/home/clinic-canvas";

export const Route = createFileRoute("/doctors")({ component: DoctorsPage });

function DoctorsPage() {
  const steps = [
    ["Find or register", "Name or phone. Duplicate warning. Consent before the record is stored."],
    ["Queue", "Waiting → with the doctor → done. Reorder without losing the day."],
    ["Voice capture", "Consent first. Local preserve. Survives a crash."],
    ["Draft & approve", "Edit every field. Optional prescription inside the note. AI never writes the Rx."],
    ["Bill & receipt", "Line items, export, paid or unpaid. No money moves through the app."],
  ];

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Doctor OS Lite</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy">
            Finish the note without becoming a typist.
          </h1>
          <p className="mt-4 text-slate">
            Four services. Offline-first. Low-end Android. AI drafts only. The doctor always approves.
          </p>
          <Link to="/book-demo" className="mt-7 inline-block">
            <Button size="lg">Book a clinic demo</Button>
          </Link>
        </div>
        <ClinicCanvas />
      </section>
      <section className="bg-page">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <ol className="grid gap-4 md:grid-cols-5">
            {steps.map(([t, b], i) => (
              <li key={t} className="rounded-2xl border border-grey bg-white p-5">
                <span className="text-xs font-bold text-teal">0{i + 1}</span>
                <h2 className="mt-2 font-display font-semibold text-navy">{t}</h2>
                <p className="mt-2 text-sm text-slate">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
