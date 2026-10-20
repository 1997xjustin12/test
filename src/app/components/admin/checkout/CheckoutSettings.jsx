"use client";

import { useCallback, useEffect, useState } from "react";
import { Field, Pill, cardClass, inputClass } from "@/app/components/admin/ui";

/**
 * Enable or disable checkout — for this brand, and per domain.
 *
 * Staging and the live site of a brand share one record, so each domain can
 * carry its own switch ("Enable checkout on staging.outdoorkitchenoutlet.com")
 * over the brand-wide default. A deployment with CHECKOUT_CLOSED set is locked
 * shut whatever is saved here. When checkout is off, /checkout redirects to
 * /checkout-unavailable and the order API refuses; nothing is deleted, and
 * turning it back on is this screen and nothing else.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

const SOURCE = {
  env: "locked by CHECKOUT_CLOSED on this deployment",
  host: "this domain's own setting",
  brand: "the brand default",
  default: "nothing set anywhere",
};

export default function CheckoutSettings() {
  const [data, setData] = useState(null); // { host, closed, source, locked, defaultMessage }
  const [record, setRecord] = useState(null); // { closed, message, hosts }
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const take = (body) => {
    setData(body);
    setRecord({ closed: body.record.closed, message: body.record.message, hosts: { ...body.record.hosts }, updatedAt: body.record.updatedAt });
    setDirty(false);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout-availability");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Could not load the setting");
      take(body);
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = (next) => {
    setRecord(next);
    setDirty(true);
    setStatus(null);
  };

  // This domain: "brand" (no entry), "on" or "off".
  const hostMode = (host) => (record?.hosts?.[host] ? (record.hosts[host].closed ? "off" : "on") : "brand");
  const setHostMode = (host, mode) => {
    const hosts = { ...record.hosts };
    if (mode === "brand") delete hosts[host];
    else hosts[host] = { closed: mode === "off" };
    change({ ...record, hosts });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/checkout-availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closed: record.closed, message: record.message, hosts: record.hosts }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Save failed");
      take(body);
      setStatus({
        ok: true,
        message: body.closed
          ? `Saved. Checkout is off on ${body.host}.`
          : `Saved. Checkout is on for ${body.host}.`,
      });
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (!record || !data) {
    return (
      <div className="container mx-auto px-2 pt-2">
        <p className={`text-sm ${muted}`}>{status?.message ?? "Loading…"}</p>
      </div>
    );
  }

  const here = data.host;
  const others = Object.keys(record.hosts).filter((h) => h !== here).sort();

  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-5 px-2 pb-16 pt-2">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Checkout</h1>
        <p className={`mt-1 max-w-2xl text-sm ${muted}`}>
          Whether shoppers can check out. When it&apos;s off, <code>/checkout</code> sends them to a
          &ldquo;checkout isn&apos;t open yet&rdquo; page with your phone number, and no order can be
          placed. Browsing, search and the cart keep working either way.
        </p>
      </header>

      <div
        className={`rounded-xl border p-4 text-sm ${
          data.closed
            ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
            : "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
        }`}
      >
        <p className="font-semibold">
          On {here || "this domain"}, checkout is {data.closed ? "OFF" : "ON"} right now.
        </p>
        <p className="mt-0.5 text-xs opacity-80">Decided by {SOURCE[data.source] ?? data.source}.</p>
        {data.locked && (
          <p className="mt-2 text-xs">
            This deployment has <code>CHECKOUT_CLOSED</code> set, so checkout stays off here
            whatever you save below. Remove that environment variable in Vercel (and redeploy) to
            let this screen decide.
          </p>
        )}
      </div>

      <div className={`${cardClass} flex flex-col gap-3 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Enable checkout on this domain</h2>
          <p className={`text-xs ${muted}`}>
            <code>{here}</code> — overrides the brand default for this domain only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill active={hostMode(here) === "brand"} onClick={() => setHostMode(here, "brand")}>
            Follow brand default
          </Pill>
          <Pill active={hostMode(here) === "on"} onClick={() => setHostMode(here, "on")}>
            Enabled
          </Pill>
          <Pill active={hostMode(here) === "off"} onClick={() => setHostMode(here, "off")}>
            Disabled
          </Pill>
        </div>
      </div>

      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Brand default</h2>
          <p className={`max-w-xl text-xs ${muted}`}>
            Applies to every domain of this brand that has no setting of its own.
          </p>
        </div>
        <div className="flex gap-2">
          <Pill active={!record.closed} onClick={() => change({ ...record, closed: false })}>
            Enabled
          </Pill>
          <Pill active={record.closed} onClick={() => change({ ...record, closed: true })}>
            Disabled
          </Pill>
        </div>
      </div>

      {others.length > 0 && (
        <div className={`${cardClass} p-4`}>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Other domains with their own setting</h2>
          <ul className="mt-2 divide-y divide-zinc-100 dark:divide-white/5">
            {others.map((host) => (
              <li key={host} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <code className="text-zinc-700 dark:text-zinc-300">{host}</code>
                <div className="flex gap-2">
                  <Pill active={hostMode(host) === "on"} onClick={() => setHostMode(host, "on")}>Enabled</Pill>
                  <Pill active={hostMode(host) === "off"} onClick={() => setHostMode(host, "off")}>Disabled</Pill>
                  <Pill active={false} onClick={() => setHostMode(host, "brand")}>Use brand default</Pill>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`${cardClass} p-4`}>
        <Field
          label="Message shown to shoppers"
          hint="Leave this empty to use the standard wording. Shown under the heading “Checkout isn’t open yet”, with the phone number and a link back to the cart."
        >
          <textarea
            rows={4}
            value={record.message}
            placeholder={data.defaultMessage}
            onChange={(e) => change({ ...record, message: e.target.value })}
            className={inputClass}
          />
        </Field>
        {record.updatedAt && (
          <p className={`mt-3 text-xs ${muted}`}>Last changed {new Date(record.updatedAt).toLocaleString()}</p>
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
        <a
          href="/checkout"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
        >
          View checkout
        </a>
        {dirty && !status && <span className={`text-sm ${muted}`}>Unsaved changes</span>}
        {status && (
          <span className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
