"use client";

import { useCallback, useEffect, useState } from "react";
import { Field, Pill, cardClass, inputClass } from "@/app/components/admin/ui";

/**
 * Open or close online ordering for this brand.
 *
 * Nothing is deleted when it closes: the checkout, its components and the
 * payment routes all stay where they are, and the shopper meets a notice
 * instead of the payment form. Reopening is this switch and nothing else.
 */

const muted = "text-zinc-500 dark:text-zinc-400";

export default function CheckoutSettings() {
  const [record, setRecord] = useState(null);
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout-availability");
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Could not load the setting");
      setRecord(body.checkout);
      setFallbackMessage(body.defaultMessage ?? "");
      setDirty(false);
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

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/checkout-availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Save failed");
      setRecord(body.checkout);
      setDirty(false);
      setStatus({
        ok: true,
        message: body.checkout.closed
          ? "Saved. Online ordering is closed for this brand."
          : "Saved. Online ordering is open for this brand.",
      });
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (!record) {
    return (
      <div className="container mx-auto px-2 pt-2">
        <p className={`text-sm ${muted}`}>{status?.message ?? "Loading…"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-5 px-2 pb-16 pt-2">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Checkout</h1>
        <p className={`mt-1 max-w-2xl text-sm ${muted}`}>
          Whether this brand takes orders online. Closing it leaves the whole checkout in place —
          shoppers meet a notice instead of the payment form, and nothing is charged. This setting
          is for this brand only.
        </p>
      </header>

      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Online ordering</h2>
          <p className={`max-w-xl text-xs ${muted}`}>
            Browsing, search, the basket and every other page keep working either way.
          </p>
        </div>
        <Pill active={!record.closed} onClick={() => change({ ...record, closed: !record.closed })}>
          {record.closed ? "Closed — not taking orders" : "Open — taking orders"}
        </Pill>
      </div>

      <div className={`${cardClass} p-4`}>
        <Field
          label="Message shown to shoppers"
          hint="Leave this empty to use the standard wording. Shown on the checkout page, with the phone number and a link back to the basket."
        >
          <textarea
            rows={4}
            value={record.message}
            placeholder={fallbackMessage}
            onChange={(e) => change({ ...record, message: e.target.value })}
            className={inputClass}
          />
        </Field>
        {record.updatedAt && (
          <p className={`mt-3 text-xs ${muted}`}>
            Last changed {new Date(record.updatedAt).toLocaleString()}
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
          <span
            className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
}
