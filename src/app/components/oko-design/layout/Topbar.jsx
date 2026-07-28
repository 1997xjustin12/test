import { STORE_CONTACT } from "@/app/lib/store_constants";
import Link from "next/link";

export default function Topbar() {
  return (
    <div className="bg-char text-ash text-xs text-center py-2 px-4 tracking-wide">
      🔥{' '}
      <strong className="text-ember">FREE SHIPPING</strong> on orders $499+
      &nbsp;·&nbsp; Price-Match Guarantee &nbsp;·&nbsp;
      <a href={`tel:${STORE_CONTACT}`} className="underline underline-offset-2 hover:text-ember transition-colors">
        Call {STORE_CONTACT}
      </a>
    </div>
  );
}