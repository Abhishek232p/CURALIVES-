import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">About</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-navy">Care for Every Life</h1>
      <div className="mt-6 space-y-4 text-slate leading-relaxed">
        <p>
          CuraLives is an India-first healthcare technology company. We build a patient-controlled continuity layer and a clinic operating system that works on the worst afternoon of the week — heat, queue, and no network.
        </p>
        <p>
          We are not a chatbot. We are not a super-app on day one. The wedge is Doctor OS Lite: records, queue, voice notes with doctor approval, and simple receipts. The consumer surface opens only after clinics actually stay.
        </p>
        <p>
          AI assists documentation, translation and reminders. It does not diagnose, prescribe, or finalise a clinical record. Consent, audit and revocation sit under every share.
        </p>
      </div>
    </div>
  );
}
