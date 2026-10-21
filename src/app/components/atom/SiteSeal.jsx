// The CompliAssure (RapidScanSecure) site seal, shown in the footers.
//
// The vendor's snippet is a <script> whose whole job is document.write()-ing a
// link and an image. document.write is ignored once a page has loaded, which
// is always the case for a script Next.js loads (next/script) and for every
// client-side navigation, so the snippet would render nothing. This renders
// the same link and image directly: no script, nothing to block the page.
//
// The code is per domain, so each brand sets its own in
// NEXT_PUBLIC_SITESEAL_CODE (e.g. "126,E8D7…"). Unset, or not in the code's
// shape, and the seal is simply left out.
const SEAL_CODE = process.env.NEXT_PUBLIC_SITESEAL_CODE?.trim();
/** Whether a seal will render, for layouts that wrap it in spacing of their own. */
export const HAS_SITE_SEAL = /^\d+,[A-Fa-f0-9]+$/.test(SEAL_CODE ?? "");

export default function SiteSeal({ className = "" }) {
  if (!HAS_SITE_SEAL) return null;
  const code = encodeURIComponent(SEAL_CODE);

  return (
    <a
      href={`https://rapidscansecure.com/siteseal/Verify.aspx?code=${code}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      title="Verify this site's security"
      className={`inline-block shrink-0 ${className}`}
    >
      {/* A plain <img>: the seal is generated per request by the vendor and
          gains nothing from the image optimiser. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://rapidscansecure.com/siteseal/Seal.aspx?code=${code}`}
        alt="CompliAssure SiteSeal"
        width={160}
        height={69}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
