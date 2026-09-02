import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({ component: RefundPage });

function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Refund policy</h1>
      <p className="mt-2 text-sm text-slate">Last updated August 2026</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate">
        <p>
          Payments for CuraLives subscriptions are generally final. A refund may be considered within 30 days if a written deliverable was not provided and the failure is attributable to CuraLives, not to connectivity, configuration, or change of mind.
        </p>
        <p>
          Actively used subscriptions, unused preference for a different workflow, and third-party outages are not refundable. Cancel future renewals at any time; the current period is not automatically refunded.
        </p>
        <p>
          Prefer a fix to a refund. Use{" "}
          <Link to="/support" className="font-semibold text-primary">
            Support
          </Link>{" "}
          first.
        </p>
      </div>
    </div>
  );
}
