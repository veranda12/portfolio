"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type ActionResult } from "../actions";

const initial: ActionResult = { ok: false };

export function LoginForm() {
  const params = useSearchParams();
  const from = params.get("from") || "/admin";
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="from" value={from} />

      <div>
        <label className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-label text-ink-soft">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-rule bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:bg-white focus:outline-none focus:ring-2 focus:ring-signal/15"
          placeholder="admin@studio.dev"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-label text-ink-soft">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-rule bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:bg-white focus:outline-none focus:ring-2 focus:ring-signal/15"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p className="rounded-lg border border-signal/40 bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-signal px-4 py-3 font-mono text-xs uppercase tracking-label text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in →"}
      </button>
    </form>
  );
}
