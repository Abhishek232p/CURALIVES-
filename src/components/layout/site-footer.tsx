import { Link } from "@tanstack/react-router";
import { site } from "@/lib/content";

const cols = [
  {
    title: "Product",
    links: [
      { to: "/doctors", label: "Doctor OS Lite" },
      { to: "/patients", label: "Patient app" },
      { to: "/identity", label: "NFC & QR" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/insights", label: "Insights" },
      { to: "/invest", label: "Invest" },
      { to: "/book-demo", label: "Book a demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/support", label: "Support" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms of use" },
      { to: "/refund", label: "Refund policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg font-bold">{site.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mint">{site.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            India-first healthcare continuity. The clinician decides. The patient stays in control.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-mint">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/80 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>AI assists. Doctors approve. Patients own their records.</p>
        </div>
      </div>
    </footer>
  );
}
