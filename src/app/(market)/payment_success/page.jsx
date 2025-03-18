'use client'
import { UIMCheckCircle } from "@/app/components/icons/lib";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const contact = "(888) 575-9720";
function SuccessPaymentPage() {
  // return notFound();

  return (
    <div className="container mx-auto h-[calc(100vh-210px)]">
        <div className="h-[100%] flex items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-[20px] w-full">
            <div className="mb-5"><UIMCheckCircle width={150} height={150}/></div>
            <div className="flex flex-col gap-[8px] items-center">
              <div className="font-bold text-lg">Payment Successful</div>
            </div>
            <div className="sm:mb-[250px]">
              <Link href={`tel:${contact}`} className="font-semibold hover:font-bold hover:underline text-theme-500">
                Call Us Now { contact }
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}

export default SuccessPaymentPage;