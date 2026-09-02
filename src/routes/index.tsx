import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mic, QrCode, Shield, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClinicCanvas } from "@/components/home/clinic-canvas";
import { faqs, features, insights } from "@/lib/content";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            Healthcare continuity layer
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.12] tracking-tight text-navy sm:text-5xl">
            Your clinic.
            <br />
            Prepared, and quietly
            <br />
            connected.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate sm:text-lg">
            CuraLives runs the parts of care that should not restart from zero — records, consent, follow-ups, and the next visit. AI drafts. The doctor approves.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/book-demo">
              <Button size="lg">Start free</Button>
            </Link>
            <Link to="/doctors">
              <Button size="lg" variant="secondary">
                Request a demo
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              ["Voice note", "drafted in seconds"],
              ["NFC / QR", "consent first"],
              ["Offline", "clinic still runs"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-grey bg-white px-3 py-3">
                <p className="text-sm font-semibold text-navy">{k}</p>
                <p className="text-[11px] text-slate">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <ClinicCanvas />
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">The super-clinic era</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            Don’t just be a doctor. Be present with the patient.
          </h2>
          <p className="mt-4 max-w-2xl text-white/75">
            Automate the admin that steals the consult. Keep the clinical decision in human hands.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Superpowered speed", "Voice-draft consult notes. Approve in one tap. Audio deleted after sign-off."],
              ["Frictionless for patients", "Digital records, reminders, and a share that expires when you say so."],
              ["Clinic autopilot", "Queue, staff access, and patient timelines in one workspace — even offline."],
            ].map(([t, b]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">The modern clinic</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-navy">
          Because you didn’t study medicine to chase paper across a desk.
        </h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {["Paper files", "WhatsApp", "Spreadsheets", "Register book", "Missed calls", "Sticky notes"].map(
            (x) => (
              <span key={x} className="rounded-full border border-grey bg-white px-3 py-1.5 text-sm text-slate line-through">
                {x}
              </span>
            ),
          )}
          <span className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white">CuraLives</span>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["One record per patient", "History, notes, files and payments on one timeline."],
            ["One clinic, many rooms", "Doctors, staff and locations under one account."],
            ["One assistant", "AI that already knows the context — and never signs the note."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-grey bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-sm text-slate">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-tint">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">AI that actually saves time</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy">Speak. The draft is already written.</h2>
            <p className="mt-4 text-slate">
              CuraLives listens through the consultation, understands prior visits, and drafts the note before you reach for a pen. You still own every word.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Voice prescriptions in your own phrasing",
                "Live consultation draft, English / Hindi / city language",
                "Full patient context recalled automatically",
                "AI never diagnoses, never prescribes, never finalises the record",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-sm text-navy">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-grey bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-navy">
              <Mic className="size-4 text-teal" /> Voice capture
            </div>
            <p className="mt-4 rounded-xl bg-page p-4 text-sm text-slate">
              Patient has stomach ache. Abdominal X-ray shows diffuse bowel gas. और हां, मरीज को बुखार भी है.
            </p>
            <p className="mt-3 rounded-xl bg-mint-bg p-4 text-sm text-navy">
              CuraLives AI · Draft ready. Review, edit, then approve. This is not a clinical record yet.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">Approve note</span>
              <span className="rounded-lg border border-grey px-3 py-2 text-xs font-semibold text-navy">Edit manually</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Identity</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-navy">Tap. Scan. Consent. Then share.</h2>
        <p className="mt-4 max-w-2xl text-slate">
          NFC card or personal QR — two physical doors into the same identity. The entire record is never dumped. Only what the patient authorised, for as long as they said.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: QrCode, t: "QR health identity", b: "Show a code. The provider sees a time-bound slice after OTP." },
            { icon: WifiOff, t: "Works when the network does not", b: "Clinic workflows keep running. Sync when connectivity returns." },
            { icon: Shield, t: "Consent is the control", b: "Identity, authorisation, minimum necessary access, audit, revoke." },
          ].map(({ icon: Icon, t, b }) => (
            <div key={t} className="rounded-2xl border border-grey bg-white p-6">
              <Icon className="size-5 text-teal" />
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-sm text-slate">{b}</p>
            </div>
          ))}
        </div>
        <Link to="/identity" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          See NFC & QR <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="bg-page">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy">What you get back</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-grey bg-white p-6">
                <h3 className="font-display font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-navy">Insights</h2>
          <Link to="/insights" className="text-sm font-semibold text-primary">
            Read all
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {insights.map((p) => (
            <Link
              key={p.slug}
              to="/insights/$slug"
              params={{ slug: p.slug }}
              className="rounded-2xl border border-grey bg-white p-6 hover:border-teal"
            >
              <p className="text-xs text-slate">{p.date}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-navy">{p.title}</h3>
              <p className="mt-2 text-sm text-slate">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-mint-bg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">For patients</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy">Not a doctor?</h2>
            <p className="mt-4 text-slate">
              Get CuraLives Pocket. Keep documents, medicines, follow-ups and family access in one private health space.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/patients">
                <Button>Get the app</Button>
              </Link>
              <Link to="/doctors">
                <Button variant="secondary">Continue as doctor</Button>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-navy">Frequently asked</h3>
            <div className="mt-4 divide-y divide-grey rounded-2xl border border-grey bg-white">
              {faqs.map((f, i) => (
                <button
                  key={f.q}
                  type="button"
                  className="block w-full px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <p className="font-semibold text-navy">{f.q}</p>
                  {openFaq === i ? <p className="mt-2 text-sm leading-relaxed text-slate">{f.a}</p> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Free to start. Set up in an afternoon.</h2>
            <p className="mt-2 text-white/80">Your evenings. Your patients. Your practice.</p>
          </div>
          <div className="mt-6 flex gap-3 md:mt-0">
            <Link to="/book-demo">
              <Button variant="teal" size="lg">
                Register your clinic
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="secondary" size="lg">
                Talk to us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
