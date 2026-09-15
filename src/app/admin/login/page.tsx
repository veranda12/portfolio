import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin — Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-console px-6 text-paper">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
            <span className="font-mono text-[0.66rem] uppercase tracking-label text-paper/60">
              Studio — Console
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold">Sign in</h1>
          <p className="mt-2 font-mono text-xs text-paper/50">Portfolio content management</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
