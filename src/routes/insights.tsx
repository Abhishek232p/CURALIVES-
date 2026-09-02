import { createFileRoute, Link } from "@tanstack/react-router";
import { insights } from "@/lib/content";

export const Route = createFileRoute("/insights")({ component: InsightsPage });

function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Insights</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-navy">Notes from the clinic floor</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {insights.map((p) => (
          <Link
            key={p.slug}
            to="/insights/$slug"
            params={{ slug: p.slug }}
            className="rounded-2xl border border-grey bg-white p-6 hover:border-teal"
          >
            <p className="text-xs text-slate">{p.date}</p>
            <h2 className="mt-2 font-display text-lg font-semibold text-navy">{p.title}</h2>
            <p className="mt-2 text-sm text-slate">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
