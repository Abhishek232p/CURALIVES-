import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Nfc, QrCode } from "lucide-react";

export const Route = createFileRoute("/identity")({ component: IdentityPage });

function IdentityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">NFC & QR</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold text-navy">
        Two physical doors. One consent layer.
      </h1>
      <p className="mt-4 max-w-2xl text-slate">
        Tap an NFC card or show a QR. CuraLives asks who is requesting, what is needed, why, for how long — then shares only that.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-grey bg-white p-7">
          <Nfc className="size-8 text-teal" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-navy">NFC flow</h2>
          <ol className="mt-4 space-y-2 text-sm text-slate">
            <li>1. Patient taps the CuraLives card</li>
            <li>2. Secure identity link</li>
            <li>3. Authenticate</li>
            <li>4. Consent check</li>
            <li>5. Authorised health context only</li>
          </ol>
        </article>
        <article className="rounded-2xl border border-grey bg-white p-7">
          <QrCode className="size-8 text-teal" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-navy">QR flow</h2>
          <ol className="mt-4 space-y-2 text-sm text-slate">
            <li>1. Patient shows personal QR in the app</li>
            <li>2. Same identity as NFC</li>
            <li>3. Authenticate</li>
            <li>4. Consent check</li>
            <li>5. Authorised health context only</li>
          </ol>
        </article>
      </div>
      <div className="mt-8 rounded-2xl bg-navy p-8 text-white">
        <h2 className="font-display text-2xl font-semibold">Forgot the card?</h2>
        <p className="mt-2 text-white/75">
          Offline QR in the app still works. Emergency access is an exception path — CuraLives does not replace ambulance services.
        </p>
        <Link to="/book-demo" className="mt-6 inline-block">
          <Button variant="teal">Ask about identity rollout</Button>
        </Link>
      </div>
    </div>
  );
}
