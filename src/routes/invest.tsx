import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/invest")({ component: InvestPage });

function InvestPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Invest</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold text-navy">
        Building the infrastructure for continuous healthcare, starting in India.
      </h1>
      <p className="mt-4 max-w-2xl text-slate">
        CuraLives is an AI-assisted healthcare operating layer connecting patients, families and clinics — with the clinician remaining responsible and the patient remaining in control.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[
          ["1", "Clinic OS", "Voice, queue, records, receipts."],
          ["2", "Patient platform", "Health space, consent, reminders."],
          ["3", "Identity", "NFC / QR, minimum-necessary share."],
          ["4", "Network", "Labs, pharmacy, hospitals — later phases."],
        ].map(([n, t, b]) => (
          <div key={n} className="rounded-2xl border border-grey bg-white p-5">
            <p className="text-xs font-bold text-teal">Step {n}</p>
            <h2 className="mt-1 font-display font-semibold text-navy">{t}</h2>
            <p className="mt-1 text-sm text-slate">{b}</p>
          </div>
        ))}
      </div>
      <form
        className="mt-12 max-w-lg rounded-2xl border border-grey bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <h2 className="font-display text-xl font-semibold text-navy">Introduce yourself</h2>
        <p className="mt-2 text-sm text-slate">
          This is an expression of interest, not an offer or solicitation.
        </p>
        {sent ? (
          <p className="mt-5 rounded-xl bg-mint-bg p-4 text-sm text-navy">Received. Materials are shared at CuraLives’ discretion.</p>
        ) : (
          <div className="mt-5 grid gap-3">
            <input required placeholder="Full name" className="h-11 rounded-lg border border-grey bg-page px-3" />
            <input required type="email" placeholder="Email" className="h-11 rounded-lg border border-grey bg-page px-3" />
            <input placeholder="Firm / affiliation" className="h-11 rounded-lg border border-grey bg-page px-3" />
            <Button type="submit">I’m interested</Button>
          </div>
        )}
      </form>
    </div>
  );
}
