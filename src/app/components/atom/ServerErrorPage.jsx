"use client";

// The brand's "temporarily unavailable" page, for errors that escape every
// error boundary: app/global-error.jsx (App Router) and pages/500.jsx (the
// 500 page Next serves when a cached (ISR) page can't be rendered, for
// example while Elasticsearch or the backend is down). Neither gets the root
// layout or Tailwind, so this carries its own styles: the brand's name,
// colour and phone number, and a way back.
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { STORE_NAME, STORE_CONTACT } from "@/app/lib/store_constants";

const BRAND = ISOKO
  ? { accent: "#9C3B34", accentDark: "#C0564C", bg: "#F6F2EA", bgDark: "#17130F", ink: "#26221F", inkDark: "#F6F2EA", muted: "#8C8478", radius: "2px", heading: 'Georgia, "Times New Roman", serif' }
  : ISBBQ
    ? { accent: "#e2541d", accentDark: "#f26a35", bg: "#f4f1ec", bgDark: "#18130f", ink: "#18130f", inkDark: "#f4f1ec", muted: "#78716c", radius: "2px", heading: '"Oswald", "Arial Narrow", Arial, sans-serif' }
    : { accent: "#E85D26", accentDark: "#F97316", bg: "#ffffff", bgDark: "#030712", ink: "#1A1A1A", inkDark: "#ffffff", muted: "#78716c", radius: "8px", heading: 'Georgia, "Times New Roman", serif' };

const css = `
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100svh; display: flex; align-items: center; justify-content: center;
    background: ${BRAND.bg}; color: ${BRAND.ink}; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
  .se-main { max-width: 34rem; padding: 3rem 1.25rem; text-align: center; }
  .se-brand { font-size: .8rem; letter-spacing: .14em; text-transform: uppercase; color: ${BRAND.accent}; font-weight: 600; margin: 0 0 1.25rem; }
  .se-main h1 { font-family: ${BRAND.heading}; font-size: 1.85rem; line-height: 1.2; margin: 0 0 .75rem;${ISBBQ ? " text-transform: uppercase;" : ""} }
  .se-text { color: ${BRAND.muted}; font-size: .95rem; line-height: 1.6; margin: 0; }
  .se-actions { margin-top: 1.75rem; display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }
  .se-actions button, .se-home { font: 600 .9rem/1 inherit; padding: .85rem 1.6rem; border-radius: ${BRAND.radius}; cursor: pointer; text-decoration: none; }
  .se-actions button { background: ${BRAND.accent}; color: #fff; border: 1px solid ${BRAND.accent}; }
  .se-home { color: inherit; border: 1px solid currentColor; }
  .se-tel { color: ${BRAND.accent}; font-weight: 600; }
  @media (prefers-color-scheme: dark) {
    body { background: ${BRAND.bgDark}; color: ${BRAND.inkDark}; }
    .se-brand, .se-tel { color: ${BRAND.accentDark}; }
    .se-actions button { background: ${BRAND.accentDark}; border-color: ${BRAND.accentDark}; }
  }
`;

export const SERVER_ERROR_TITLE = `Temporarily unavailable | ${STORE_NAME}`;

/** @param onRetry  what "Try again" does (retry() in global-error, a reload in pages/500). */
export default function ServerErrorPage({ onRetry }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <main className="se-main">
        <p className="se-brand">{STORE_NAME}</p>
        <h1>This page is temporarily unavailable</h1>
        <p className="se-text">
          Something went wrong on our side. It&apos;s usually brief, so please try again in a moment.
          {STORE_CONTACT ? (
            <>
              {" "}You can also call us at <a className="se-tel" href={`tel:${STORE_CONTACT}`}>{STORE_CONTACT}</a>.
            </>
          ) : null}
        </p>
        <div className="se-actions">
          <button type="button" onClick={onRetry}>Try again</button>
          <a className="se-home" href="/">Go to the home page</a>
        </div>
      </main>
    </>
  );
}
