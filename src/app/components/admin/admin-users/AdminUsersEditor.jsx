"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock, ShieldCheck, Trash2, TriangleAlert } from "lucide-react";
import { cardClass, inputClass } from "@/app/components/admin/ui";

/**
 * Who may use /admin.
 *
 * Two lists, shown separately because they behave differently: the names in
 * ADMIN_USERNAMES cannot be revoked here — they are the way back in if this
 * screen is ever used carelessly — and the granted ones can.
 *
 * The username is the one used to sign in. There is no user directory to pick
 * from: the storefront's accounts live in the Django backend and this app never
 * lists them, so the name is typed, and it only means anything once that person
 * signs in with it.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

function Row({ name, locked, isYou, onRemove }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-3 py-2.5 dark:border-white/10">
      <span className="flex min-w-0 items-center gap-2">
        {locked ? (
          <Lock className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
        )}
        <span className="truncate text-sm text-zinc-800 dark:text-zinc-200">{name}</span>
        {isYou && (
          <span className="shrink-0 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            you
          </span>
        )}
      </span>
      {locked ? (
        <span className={`shrink-0 text-xs ${muted}`}>set in the environment</span>
      ) : (
        <button
          type="button"
          onClick={() => onRemove(name)}
          aria-label={`Remove admin access for ${name}`}
          className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </li>
  );
}

export default function AdminUsersEditor() {
  const [data, setData] = useState(null);
  const [granted, setGranted] = useState([]);
  const [draft, setDraft] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-users");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Could not load the list");
      setData(body);
      setGranted(body.granted ?? []);
      setDirty(false);
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = () => {
    const name = draft.trim().toLowerCase();
    if (!name) return;
    if (granted.includes(name) || (data?.env ?? []).includes(name)) {
      setStatus({ ok: false, message: `${name} already has access.` });
      setDraft("");
      return;
    }
    setGranted([...granted, name]);
    setDraft("");
    setDirty(true);
    setStatus(null);
  };

  const remove = (name) => {
    setGranted(granted.filter((n) => n !== name));
    setDirty(true);
    setStatus(null);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: granted }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Save failed");
      setData(body);
      setGranted(body.granted ?? []);
      setDirty(false);
      setStatus({ ok: true, message: "Saved. Access changes on their next request." });
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="container mx-auto px-2 pt-2">
        <p className={`text-sm ${muted}`}>
          {status?.message ?? "Loading…"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-5 px-2 pb-16 pt-2">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Admin access</h1>
        <p className={`mt-1 max-w-2xl text-sm ${muted}`}>
          Who can open the admin for this brand. Access is by the username someone signs in with,
          and it applies to this brand only — granting it here does not grant it on the others.
        </p>
      </header>

      <div className={`${cardClass} p-4`}>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Add someone</h2>
        <p className={`mt-1 text-xs ${muted}`}>
          They need an account on the storefront already. Access starts the next time they sign in.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={draft}
            spellCheck={false}
            autoComplete="off"
            placeholder="username"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className={`${inputClass} max-w-xs`}
          />
          <button
            type="button"
            onClick={add}
            disabled={!draft.trim()}
            className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 disabled:opacity-40 dark:border-white/10 dark:text-zinc-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className={`${cardClass} p-4`}>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Has access ({data.env.length + granted.length})
        </h2>

        {granted.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {granted.map((name) => (
              <Row key={name} name={name} isYou={name === data.you} onRemove={remove} />
            ))}
          </ul>
        )}

        {data.env.length > 0 && (
          <>
            <p className={`mt-4 text-xs font-semibold uppercase tracking-wide ${muted}`}>
              From the environment
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {data.env.map((name) => (
                <Row key={name} name={name} locked isYou={name === data.you} />
              ))}
            </ul>
            <p className={`mt-3 flex items-start gap-2 text-xs ${muted}`}>
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                These come from <code>ADMIN_USERNAMES</code> and cannot be removed here. They are
                the way back in if this list is ever saved wrong — changing them means changing the
                deployment&apos;s environment.
              </span>
            </p>
          </>
        )}

        {granted.length === 0 && data.env.length === 0 && (
          <p className={`mt-3 text-sm ${muted}`}>
            Nobody has access. With no <code>ADMIN_USERNAMES</code> set and nothing granted, the
            admin is closed to everyone.
          </p>
        )}
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-zinc-200 bg-white/95 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : dirty ? "Save" : "Saved"}
        </button>
        {dirty && !status && <span className={`text-sm ${muted}`}>Unsaved changes</span>}
        {status && (
          <span
            className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {status.message}
          </span>
        )}
        {data.updatedAt && !dirty && !status && (
          <span className={`text-sm ${muted}`}>
            Last changed {new Date(data.updatedAt).toLocaleString()}
            {data.updatedBy ? ` by ${data.updatedBy}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
