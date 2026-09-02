import { Mic } from "lucide-react";

export function ClinicCanvas() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey bg-white shadow-[0_20px_60px_rgba(23,59,85,0.12)]">
      <div className="flex items-center justify-between border-b border-grey bg-page px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal" />
          <span className="text-xs font-semibold text-slate">CuraLives · Doctor OS Lite</span>
        </div>
        <span className="text-xs text-slate">Offline ready</span>
      </div>
      <div className="grid gap-0 md:grid-cols-[1fr_220px]">
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Consultation recording</p>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-bg text-primary">
              <Mic className="size-4" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-navy">Anita Rao · 34</p>
              <p className="text-xs text-slate">Follow-up · hypertension · 3rd visit</p>
            </div>
          </div>
          <blockquote className="mt-4 rounded-xl bg-blue-tint px-4 py-3 text-sm leading-relaxed text-navy">
            “Continue amlodipine 5mg once daily, add a low-salt diet note, and review BP in two weeks.”
          </blockquote>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              ["Amlodipine 5mg", "1-0-0 · 14 days"],
              ["Diet advice", "Low sodium · attached"],
              ["Review", "Auto-reminder in 14 days"],
            ].map(([t, s]) => (
              <div key={t} className="rounded-lg border border-grey bg-page px-3 py-2">
                <p className="text-xs font-semibold text-navy">{t}</p>
                <p className="text-[11px] text-slate">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-navy px-4 py-2.5 text-white">
            <span className="text-xs">Draft ready · waiting for doctor approval</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-[11px] font-semibold">Approve</span>
          </div>
        </div>
        <aside className="border-t border-grey bg-page p-4 md:border-l md:border-t-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Queue</p>
          <ul className="mt-3 space-y-2">
            {[
              ["R. Mehta", "11:00", "waiting"],
              ["S. Iyer", "11:20", "with doctor"],
              ["K. Das", "11:40", "waiting"],
            ].map(([n, t, s]) => (
              <li key={n} className="rounded-lg bg-white px-3 py-2 text-xs">
                <div className="flex justify-between font-semibold text-navy">
                  <span>{n}</span>
                  <span className="text-slate">{t}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-teal">{s}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
