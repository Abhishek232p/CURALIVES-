import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/support")({ component: SupportPage });

function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Support</h1>
      <p className="mt-4 text-slate">
        Technical support for Android, iOS and web. For clinic onboarding, book a demo. This page does not provide medical advice.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Android", "iOS", "Web"].map((p) => (
          <div key={p} className="rounded-xl border border-grey bg-white p-5 text-center font-semibold text-navy">
            {p}
          </div>
        ))}
      </div>
      <form
        className="mt-8 space-y-4 rounded-2xl border border-grey bg-white p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="block text-sm font-medium text-navy">
          Email
          <input required type="email" className="mt-1 h-11 w-full rounded-lg border border-grey bg-page px-3" />
        </label>
        <label className="block text-sm font-medium text-navy">
          How can we help?
          <textarea required rows={4} className="mt-1 w-full rounded-lg border border-grey bg-page px-3 py-2" />
        </label>
        <Button type="submit">Send request</Button>
      </form>
      <p className="mt-6 text-sm text-slate">
        Prefer a walkthrough?{" "}
        <Link to="/book-demo" className="font-semibold text-primary">
          Book a demo
        </Link>
        .
      </p>
    </div>
  );
}
