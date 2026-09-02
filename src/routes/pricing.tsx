import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pricing } from "@/lib/content";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Pricing</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-navy">Plans for the clinic you actually run</h1>
      <p className="mt-4 max-w-2xl text-slate">
        Listed monthly SaaS for independent clinics. Final commercial terms are confirmed after a live demo. GST extra where applicable.
      </p>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {pricing.individual.map((p) => (
          <article
            key={p.name}
            className="relative flex flex-col rounded-2xl border border-grey bg-white p-7 shadow-sm"
          >
            {p.badge ? (
              <span className="absolute right-5 top-5 rounded-full bg-mint-bg px-2.5 py-1 text-[11px] font-semibold text-primary">
                {p.badge}
              </span>
            ) : null}
            <h2 className="font-display text-xl font-semibold text-navy">{p.name}</h2>
            <p className="mt-4 font-display text-4xl font-bold text-navy">
              {p.price}
              <span className="text-base font-medium text-slate">{p.period}</span>
            </p>
            <p className="mt-1 text-sm text-slate">{p.note}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-navy">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/book-demo" className="mt-8">
              <Button className="w-full">{p.name} · Proceed</Button>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-12 rounded-2xl bg-navy p-8 text-white md:flex md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Hospital & multi-speciality groups</h2>
          <p className="mt-2 text-sm text-white/75">Custom identity, security review, and volume pricing.</p>
        </div>
        <Link to="/book-demo" className="mt-5 inline-block md:mt-0">
          <Button variant="teal">Talk to sales</Button>
        </Link>
      </div>
    </div>
  );
}
