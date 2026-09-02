import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book-demo")({ component: BookDemoPage });

function BookDemoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Live demo</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-navy">
          Transform practice operations with CuraLives
        </h1>
        <p className="mt-4 text-slate">
          See voice notes, queue, receipts, NFC/QR identity and the patient health space in one sitting.
        </p>
        <ul className="mt-8 space-y-4 text-sm text-navy">
          <li>
            <strong>AI-assisted notes.</strong> Draft in seconds. Doctor still signs.
          </li>
          <li>
            <strong>Offline clinic OS.</strong> Queue and records without a network.
          </li>
          <li>
            <strong>Patient continuity.</strong> Book → consent → provider already prepared.
          </li>
        </ul>
      </div>
      <form
        className="rounded-2xl border border-grey bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <h2 className="font-display text-xl font-semibold text-navy">Schedule a live demo</h2>
        {sent ? (
          <p className="mt-6 rounded-xl bg-mint-bg p-4 text-sm text-navy">
            Request received. A specialist will confirm a slot. This is a demo request, not a contract.
          </p>
        ) : (
          <div className="mt-5 grid gap-4">
            {[
              ["name", "Full name", "text"],
              ["phone", "Phone number", "tel"],
              ["email", "Email", "email"],
              ["city", "City", "text"],
              ["date", "Preferred date", "date"],
            ].map(([id, label, type]) => (
              <label key={id} className="block text-sm font-medium text-navy">
                {label} *
                <input
                  required
                  id={id}
                  name={id}
                  type={type}
                  className="mt-1 h-11 w-full rounded-lg border border-grey bg-page px-3 text-navy outline-none focus:border-primary"
                />
              </label>
            ))}
            <label className="block text-sm font-medium text-navy">
              Message
              <textarea
                name="message"
                rows={3}
                className="mt-1 w-full rounded-lg border border-grey bg-page px-3 py-2 text-navy outline-none focus:border-primary"
              />
            </label>
            <Button type="submit" className="w-full">
              Book demo call
            </Button>
            <p className="text-xs text-slate">By submitting you agree to be contacted about CuraLives. No medical advice is provided on this form.</p>
          </div>
        )}
      </form>
    </div>
  );
}
