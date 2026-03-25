import { PHONE, PHONE_HREF } from "@/app/data/new-homepage";
import { PhoneIcon } from "@/app/components/new-design/ui/Icons";

export default function StickyCall() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <a
        href={PHONE_HREF}
        className="
          flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white
          bg-fire hover:bg-fire-light transition-all duration-300 hover:-translate-y-0.5
          shadow-[0_4px_20px_rgba(232,93,38,0.4)]
          animate-[pulse_2.5s_ease-in-out_infinite]
        "
      >
        <PhoneIcon size={15} />
        Call {PHONE}
      </a>
    </div>
  );
}