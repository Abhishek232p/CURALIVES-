import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, LayoutGrid, ChevronDown, UserRound, Stethoscope, Pill, Sparkles, CalendarCheck, TestTubeDiagonal, Clock, Shield } from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/content";
import { RoleSwitcher } from "@/components/curalives/role-switcher";
import { cn } from "@/lib/utils";

const PROTO_LINKS = [
  { to: "/dashboard/patient", label: "Patient Dashboard", Icon: UserRound },
  { to: "/dashboard/doctor", label: "Doctor Workbench", Icon: Stethoscope },
  { to: "/dashboard/pharmacy", label: "Pharmacy", Icon: Pill },
  { to: "/intake", label: "AI Intake", Icon: Sparkles },
  { to: "/book-appointment", label: "Book Appointment", Icon: CalendarCheck },
  { to: "/diagnostics", label: "Diagnostics", Icon: TestTubeDiagonal },
  { to: "/follow-up", label: "Follow-up", Icon: Clock },
  { to: "/consent", label: "Consent & Audit", Icon: Shield },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-grey bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src="/logo-mark.png" alt="" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-[17px] font-bold tracking-tight text-navy">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-[15px] font-medium text-slate hover:text-primary",
                pathname === item.to && "text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-grey bg-white px-3 py-2 text-[13px] font-semibold text-navy transition-colors hover:bg-blue-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <LayoutGrid className="h-4 w-4 text-teal" aria-hidden />
                Prototype
                <ChevronDown className="h-3.5 w-3.5 text-slate" aria-hidden />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-grey bg-white p-2 shadow-xl"
                align="end"
                sideOffset={8}
              >
                <div className="mb-1 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal">
                    Connected care journey
                  </p>
                  <p className="mt-0.5 text-xs text-slate">Pick any step in the experience</p>
                </div>
                {PROTO_LINKS.map(({ to, label, Icon }) => (
                  <DropdownMenu.Item key={to} asChild>
                    <Link
                      to={to}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-navy outline-none transition-colors hover:bg-blue-tint focus:bg-blue-tint data-[highlighted]:bg-blue-tint"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-bg text-teal">
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span className="font-medium">{label}</span>
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <RoleSwitcher />
          <Link to="/book-demo">
            <Button size="sm">Book a demo</Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-grey bg-white px-4 py-4 xl:hidden">
          <div className="mb-4 flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
              Role view
            </p>
            <RoleSwitcher size="md" />
          </div>
          <div className="mb-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
              Website
            </p>
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium text-navy hover:bg-blue-tint"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
              Prototype journey
            </p>
            <nav className="flex flex-col gap-1">
              {PROTO_LINKS.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-navy hover:bg-blue-tint"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-bg text-teal">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <Link to="/book-demo" onClick={() => setOpen(false)} className="mt-4 block">
            <Button className="w-full">Book a demo</Button>
          </Link>
        </div>
      ) : null}
    </header>
  );
}
