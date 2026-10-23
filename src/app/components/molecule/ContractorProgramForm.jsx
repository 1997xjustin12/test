"use client";

// The Professional Program application form: the behaviour, shared by all
// three brands. Each brand's form/ContractorProgramForm.jsx passes its own
// `classes`; this file only uses layout classes so it looks right in every
// build. Fields, Zoho settings and validation live in
// lib/contractor-program-form.js.

import { useEffect, useRef, useState } from "react";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import {
  CAPTCHA_FIELD,
  CONTRACTOR_FIELDS,
  CONTRACTOR_FORM_DONE_PATH,
  CONTRACTOR_GROUPS,
  ZOHO_FORM,
  emptyContractorValues,
  validateContractorField,
  validateContractorForm,
} from "@/app/lib/contractor-program-form";

const SUBMIT_TIMEOUT_MS = 30000;
const REJECT_GRACE_MS = 3000;
const FRAME_NAME = "contractorProgramFrame";

const fieldId = (name) => `cpf-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const COLS = { full: "sm:col-span-6", third: "sm:col-span-2" };

const AlertIcon = ({ className = "" }) => (
  <svg className={`h-4 w-4 shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </svg>
);

const CheckIcon = ({ className = "" }) => (
  <svg className={`h-6 w-6 shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.8 2.8L16 10" />
  </svg>
);

const ReloadIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
  </svg>
);

/**
 * @param {object} props.classes  Brand styles: form, section, legend, optional,
 *   label, required, hint, input, inputError, error, captchaImage, iconButton,
 *   button, note, summary, summaryTitle, summaryLink, failure, success,
 *   successIcon, successTitle, successText. A legend inside a bordered
 *   section needs `float-left w-full` to sit inside the border; the content
 *   after it clears the float.
 */
export default function ContractorProgramForm({ classes: c }) {
  const formRef = useRef(null);
  const frameRef = useRef(null);
  const summaryRef = useRef(null);
  const successRef = useRef(null);
  const captchaInputRef = useRef(null);
  const pendingRef = useRef(false);
  const timeoutRef = useRef(null);

  const [values, setValues] = useState(emptyContractorValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // idle | invalid | submitting | failed | success
  const [status, setStatus] = useState("idle");
  const [captchaSrc, setCaptchaSrc] = useState(ZOHO_FORM.captchaSrc);
  const [returnUrl, setReturnUrl] = useState("");
  const [visitorId, setVisitorId] = useState("");
  // A fresh frame for each attempt: after a rejection the old one holds
  // Zoho's page, and a second post into it never starts.
  const [frameKey, setFrameKey] = useState(0);

  // The origin is only known in the browser, and must be this exact one for
  // the frame to be readable after Zoho redirects it.
  useEffect(() => {
    setReturnUrl(window.location.origin + CONTRACTOR_FORM_DONE_PATH);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const reloadCaptcha = () => setCaptchaSrc(`${ZOHO_FORM.captchaSrc}&d=${Date.now()}`);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Once a field has shown an error, re-check it as the visitor types so the
    // message clears the moment it's fixed.
    if (touched[name]) setErrors((er) => ({ ...er, [name]: validateContractorField(name, value) }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    // Leaving an untouched empty field isn't an error yet.
    if (!value.trim() && !touched[name]) return;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateContractorField(name, value) }));
  };

  const focusField = (name) => document.getElementById(fieldId(name))?.focus();

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    const found = validateContractorForm(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    if (Object.keys(found).length) {
      setStatus("invalid");
      // After the summary renders, and again on every failed attempt.
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    // Zoho SalesIQ links the lead to the chat visitor, as the embed did.
    try { setVisitorId(window.$zoho?.salesiq?.visitor?.uniqueid?.() || ""); } catch {}
    setStatus("submitting");
    pendingRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!pendingRef.current) return;
      pendingRef.current = false;
      setStatus("failed");
    }, SUBMIT_TIMEOUT_MS);
    // After the visitor-id render, so it's in the post.
    setTimeout(() => formRef.current?.submit(), 0);
  };

  // The frame loads once Zoho has answered. A good post ends on our own done
  // page, which this window can read; anything else stays on Zoho's origin and
  // reading it throws. Zoho may pass through a page of its own on the way to
  // the done page, so a Zoho load only counts as a rejection (in practice a
  // wrong captcha) if the done page doesn't follow shortly.
  const onFrameLoad = () => {
    if (!pendingRef.current) return;
    let landedHome = false;
    try {
      landedHome = frameRef.current.contentWindow.location.pathname === CONTRACTOR_FORM_DONE_PATH;
    } catch {}
    clearTimeout(timeoutRef.current);
    if (landedHome) {
      pendingRef.current = false;
      setStatus("success");
      return;
    }
    timeoutRef.current = setTimeout(onRejected, REJECT_GRACE_MS);
  };

  const onRejected = () => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    setValues((v) => ({ ...v, [CAPTCHA_FIELD.name]: "" }));
    setErrors((er) => ({ ...er, [CAPTCHA_FIELD.name]: "That code didn't match. Enter the new code shown and submit again." }));
    reloadCaptcha();
    setFrameKey((k) => k + 1);
    setStatus("idle");
    captchaInputRef.current?.focus();
  };

  if (status === "success") {
    return (
      <div className={c.success} role="status">
        <CheckIcon className={c.successIcon} />
        <div>
          <h3 ref={successRef} tabIndex={-1} className={`${c.successTitle} outline-none`}>
            Application received
          </h3>
          <p className={c.successText}>
            Thank you{values["First Name"] ? `, ${values["First Name"].trim()}` : ""}. Our team reviews
            applications within 1–2 business days and will contact you at {values.Email.trim()}.
          </p>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors).filter(([, m]) => m);

  const renderField = (f) => {
    const id = fieldId(f.name);
    const error = touched[f.name] && errors[f.name];
    const describedBy = [f.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
    return (
      <div key={f.name} className={`col-span-6 ${COLS[f.cols] || "sm:col-span-3"}`}>
        <label htmlFor={id} className={c.label}>
          {f.label}
          {f.required && (
            <>
              <span className={c.required} aria-hidden="true"> *</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        <input
          id={id}
          name={f.name}
          type={f.type === "email" || f.type === "tel" || f.type === "url" ? f.type : "text"}
          inputMode={f.inputMode}
          autoComplete={f.autoComplete || "off"}
          maxLength={f.maxLength}
          placeholder={f.placeholder}
          value={values[f.name]}
          onChange={onChange}
          onBlur={onBlur}
          aria-required={f.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${c.input} ${error ? c.inputError : ""}`}
        />
        {f.hint && !error && <p id={`${id}-hint`} className={c.hint}>{f.hint}</p>}
        {error && (
          <p id={`${id}-error`} className={`${c.error} flex items-start gap-1.5`}>
            <AlertIcon className="mt-px" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  };

  const captchaId = fieldId(CAPTCHA_FIELD.name);
  const captchaError = touched[CAPTCHA_FIELD.name] && errors[CAPTCHA_FIELD.name];

  return (
    <>
      <form
        ref={formRef}
        name={ZOHO_FORM.name}
        action={ZOHO_FORM.action}
        method="POST"
        acceptCharset="UTF-8"
        target={FRAME_NAME}
        noValidate
        onSubmit={onSubmit}
        className={`space-y-8 ${c.form || ""}`}
      >
        {Object.entries(ZOHO_FORM.hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <input type="hidden" name="returnURL" value={returnUrl} />
        <input type="hidden" name="LDTuvid" value={visitorId} />

        {status === "invalid" && errorList.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className={`${c.summary} outline-none`}>
            <p className={`${c.summaryTitle} flex items-center gap-2`}>
              <AlertIcon />
              {errorList.length === 1 ? "Please fix 1 field before submitting:" : `Please fix ${errorList.length} fields before submitting:`}
            </p>
            <ul className="mt-2 space-y-1 pl-6">
              {errorList.map(([name, message]) => (
                <li key={name}>
                  <button type="button" onClick={() => focusField(name)} className={c.summaryLink}>
                    {message}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "failed" && (
          <div role="alert" className={`${c.failure} flex items-start gap-2`}>
            <AlertIcon className="mt-0.5" />
            <p>
              We couldn&apos;t confirm your application was sent. Please try again
              {STORE_CONTACT ? (
                <>, or call us at <a href={`tel:${STORE_CONTACT}`} className="underline">{STORE_CONTACT}</a></>
              ) : null}
              .
            </p>
          </div>
        )}

        {CONTRACTOR_GROUPS.map((g) => (
          <fieldset key={g.key} className={c.section}>
            <legend className={c.legend}>
              {g.title}
              {g.optional && <span className={c.optional}> (optional)</span>}
            </legend>
            <div className="clear-both grid grid-cols-6 gap-x-4 gap-y-5">
              {CONTRACTOR_FIELDS.filter((f) => f.group === g.key).map(renderField)}
            </div>
          </fieldset>
        ))}

        <fieldset className={c.section}>
          <legend className={c.legend}>Verification</legend>
          <div className="clear-both flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={captchaSrc} alt="Verification code" width={200} height={70} className={c.captchaImage} />
              <button type="button" onClick={reloadCaptcha} className={c.iconButton} aria-label="Show a new code" title="Show a new code">
                <ReloadIcon />
              </button>
            </div>
            <div className="flex-1 sm:max-w-xs">
              <label htmlFor={captchaId} className={c.label}>
                {CAPTCHA_FIELD.label}
                <span className={c.required} aria-hidden="true"> *</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                ref={captchaInputRef}
                id={captchaId}
                name={CAPTCHA_FIELD.name}
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={CAPTCHA_FIELD.maxLength}
                value={values[CAPTCHA_FIELD.name]}
                onChange={onChange}
                onBlur={onBlur}
                aria-required
                aria-invalid={captchaError ? true : undefined}
                aria-describedby={captchaError ? `${captchaId}-error` : `${captchaId}-hint`}
                className={`${c.input} ${captchaError ? c.inputError : ""}`}
              />
              {captchaError ? (
                <p id={`${captchaId}-error`} className={`${c.error} flex items-start gap-1.5`}>
                  <AlertIcon className="mt-px" />
                  <span>{captchaError}</span>
                </p>
              ) : (
                <p id={`${captchaId}-hint`} className={c.hint}>Type the characters in the image.</p>
              )}
            </div>
          </div>
        </fieldset>

        <div className="space-y-3">
          <button type="submit" disabled={status === "submitting"} className={`${c.button} inline-flex items-center justify-center gap-2`}>
            {status === "submitting" && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            )}
            {status === "submitting" ? "Submitting…" : "Submit application"}
          </button>
          <p className={c.note}>
            <span aria-hidden="true">* </span>Required field. We only use these details to review your application.
          </p>
        </div>
      </form>
      <iframe key={frameKey} ref={frameRef} name={FRAME_NAME} title="Form submission" onLoad={onFrameLoad} className="hidden" tabIndex={-1} aria-hidden="true" />
    </>
  );
}
