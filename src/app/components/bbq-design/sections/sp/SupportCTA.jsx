import Link from "next/link";
import { STORE_CONTACT, STORE_EMAIL } from "@/app/lib/store_constants";

const SupportCTA = () => (
  <section className="mb-14">
    <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden border border-gray-800">
      <div className="bg-gray-900 p-7 flex flex-col justify-between gap-5">
        <div>
          <p className="text-base font-extrabold text-white mb-2">Still have questions?</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Can&apos;t find the answer you&apos;re looking for? Our expert support team is here to help you make the right choice.
          </p>
        </div>
        <Link
          href={`mailto:${STORE_EMAIL}`}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Support
        </Link>
      </div>
      <div className="bg-orange-500 p-7 flex flex-col justify-between gap-5">
        <div>
          <p className="text-base font-extrabold text-white mb-2">Prefer to call?</p>
          <p className="text-sm text-orange-100 leading-relaxed">
            Our grill experts are available Mon–Sat 9am–6pm PST ready to help you pick the perfect product.
          </p>
        </div>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-orange-50 text-orange-600 rounded-xl text-xs font-bold transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          (888) 575-9720
        </Link>
      </div>
    </div>
  </section>
);

export default SupportCTA;
