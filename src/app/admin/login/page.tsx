import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin — Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 text-ink">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
          <span className="font-mono text-[0.66rem] uppercase tracking-label text-ink-soft">
            Studio — Console
          </span>
        </div>
        <div className="rounded-xl border border-rule bg-white p-8 shadow-[0_1px_2px_rgba(22,21,15,0.04),0_8px_24px_rgba(22,21,15,0.06)]">
          <h1 className="font-display text-2xl font-semibold">Sign in</h1>
          <p className="mt-1 font-mono text-xs text-ink-faint">Portfolio content management</p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[0.62rem] text-ink-faint">
          Protected area — authorized access only
        </p>
      </div>
    </div>
  );
}
