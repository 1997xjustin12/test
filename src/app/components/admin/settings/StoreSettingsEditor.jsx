"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Info, Lock, TriangleAlert } from "lucide-react";
import { redisGet, redisSet } from "@/app/lib/redis";
import {
  STORE_SETTINGS_FIELDS,
  STORE_SETTINGS_GROUPS,
  emptyStoreSettings,
} from "@/app/lib/store-settings";
import Button from "@/app/components/admin/Button";
import { Divider, Field, inputClass } from "@/app/components/admin/ui";

/**
 * Env vars that stay in env by design. Listed read-only so the split is
 * visible in the admin instead of being tribal knowledge.
 */
const ENV_ONLY = [
  { name: "STORE_ID", why: "Selects which brand's Redis keys to read — must be known before any setting can load." },
  { name: "NEXT_UPSTASH_REDIS_REST_URL / _TOKEN", why: "Credentials for the store that holds these settings." },
  { name: "NEXT_PUBLIC_SITE_BASE_URL", why: "Needed at build time for canonical URLs and server fetches." },
  { name: "NEXT_ES_URL / NEXT_ES_API_KEY", why: "Elasticsearch endpoint and secret." },
  { name: "NEXT_SOLANA_BACKEND_URL / _KEY", why: "Backend endpoint and secret." },
  { name: "NEXT_SOLANA_COLLECTIONS_KEY", why: "Backend secret." },
  { name: "RECAPTCHA_SECRET_KEY", why: "Secret half of the reCAPTCHA pair." },
  { name: "REVALIDATE_SECRET", why: "Guards the cache-bust endpoints." },
  { name: "MERCHANT_FEED_SHOPIFY_DOMAIN", why: "Build-time feed target." },
];

export default function StoreSettingsEditor({ storeId, settingsKey, envDefaults, theme }) {
  const [values, setValues] = useState(emptyStoreSettings);
  const [status, setStatus] = useState("loading");
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let cancelled = false;
    redisGet(settingsKey)
      .then((data) => {
        if (cancelled) return;
        setValues({ ...emptyStoreSettings(), ...(data && typeof data === "object" ? data : {}) });
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        // Key not existing yet is the normal first-run state.
        setValues(emptyStoreSettings());
        setStatus("ready");
      });
    return () => {
      cancelled = true;
    };
  }, [settingsKey]);

  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const patch = useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      // Store only what's actually set — blanks fall back to env at read time.
      const cleaned = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== "" && v != null),
      );
      const response = await redisSet(settingsKey, cleaned);
      if (response?.success) {
        setDirty(false);
        showAlert("success", "Store settings saved.");
        fetch("/api/revalidate-store-settings", { method: "POST" }).catch(() => {});
      } else {
        showAlert("error", "Failed to save. Please try again.");
      }
    } catch (error) {
      showAlert("error", "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [values, settingsKey, showAlert]);

  const overriddenCount = useMemo(
    () => Object.values(values).filter((v) => v !== "" && v != null).length,
    [values],
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Store Settings
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Per-brand configuration for{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{storeId}</span>.
          Saved to <code className="font-mono text-xs">{settingsKey}</code>.
          Blank fields fall back to the env value shown beneath them.
        </p>
      </div>

      {/* Save bar */}
      <div className="sticky top-16 z-10 -mx-4 flex flex-wrap items-center gap-3 border-y border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border dark:border-white/10 dark:bg-zinc-900/85">
        <div className="w-auto">
          <Button onClick={save} loading={isSaving || status === "loading"}>
            Save
          </Button>
        </div>
        {dirty ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {overriddenCount} of {STORE_SETTINGS_FIELDS.length} set in Redis
          </span>
        )}
        {alert && (
          <span
            role="status"
            className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              alert.type === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {alert.message}
          </span>
        )}
      </div>

      {STORE_SETTINGS_GROUPS.map((group) => {
        const fields = STORE_SETTINGS_FIELDS.filter((f) => f.group === group);
        if (!fields.length) return null;
        return (
          <section
            key={group}
            className="rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-white/10"
          >
            <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
              {group}
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                // Theme is derived from STORE_ID, not editable here.
                if (field.type === "theme") {
                  return (
                    <Field
                      key={field.key}
                      label={field.label}
                      htmlFor={`setting-${field.key}`}
                      hint={field.hint}
                    >
                      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                        <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="font-mono">{theme}</span>
                        <span className="ml-auto text-xs">from STORE_ID</span>
                      </div>
                    </Field>
                  );
                }

                const envValue = envDefaults?.[field.key];
                return (
                  <Field
                    key={field.key}
                    label={field.label}
                    htmlFor={`setting-${field.key}`}
                    hint={
                      <>
                        {field.hint && <span className="block">{field.hint}</span>}
                        {field.env && (
                          <span className="block font-mono text-[11px]">
                            {envValue
                              ? `env ${field.env} = ${envValue}`
                              : `env ${field.env} (unset)`}
                          </span>
                        )}
                      </>
                    }
                  >
                    <input
                      id={`setting-${field.key}`}
                      type="text"
                      value={values[field.key] ?? ""}
                      placeholder={envValue || "Not set"}
                      onChange={(e) => patch(field.key, e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                );
              })}
            </div>
          </section>
        );
      })}

      <Divider />

      <section className="rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-white/10">
        <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white">
          <Info className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          Stays in environment variables
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          These are secrets or bootstrap values — they can&apos;t live in Redis
          because they&apos;re needed before Redis can be read, or must never
          reach the browser.
        </p>
        <ul className="mt-4 space-y-2">
          {ENV_ONLY.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-0.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-white/5"
            >
              <code className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {item.name}
              </code>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.why}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
