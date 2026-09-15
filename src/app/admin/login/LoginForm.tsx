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
        <label className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-label text-paper/60">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full border border-console-line bg-console-2 px-4 py-3 text-sm text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none"
          placeholder="admin@studio.dev"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-label text-paper/60">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-console-line bg-console-2 px-4 py-3 text-sm text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p className="border border-signal/40 bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-signal px-4 py-3 font-mono text-xs uppercase tracking-label text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in →"}
      </button>
    </form>
  );
}
