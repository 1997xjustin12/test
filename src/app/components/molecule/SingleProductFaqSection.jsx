import { useState, useEffect } from "react";
import { keys, redisGet } from "@/app/lib/redis";
import parse from "html-react-parser";
import {
  STORE_CONTACT,
  STORE_NAME,
  STORE_REDIS_PREFIX,
} from "@/app/lib/store_constants";

import { MingcuteUpLine, MingcuteDownLine } from "@/app/components/icons/lib";
import Link from "next/link";

const about = keys.faqs_about_brand.value;
const shipping_policy = keys.faqs_shipping_policy.value;
const return_policy = keys.faqs_return_policy.value;
const warranty = keys.faqs_warranty.value;

function SingleProductFaqSection() {
  const [policy_section, setPolicySection] = useState([
    {
      key: about,
      label: `About ${STORE_NAME}`,
      content: "",
      expanded: false,
    },
    {
      key: shipping_policy,
      label: "Shipping Policy",
      content: "",
      expanded: false,
    },
    {
      key: return_policy,
      label: "Return Policy",
      content: "",
      expanded: false,
    },
    { key: warranty, label: "Warranty", content: "", expanded: false },
  ]);

  const handleExpandFAQsSection = (key) => {
    setPolicySection((prev) => {
      return prev.map((i) => ({
        ...i,
        expanded: i.key === key ? !i.expanded : i.expanded,
      }));
    });
  };

  useEffect(() => {
    redisGet([about, shipping_policy, return_policy, warranty])
      .then((response) => {
        // console.log("redisGetResponse", response);
        setPolicySection((prev) => {
          return prev.map((item, index) => {
            return { ...item, content: response[index] };
          });
        });
      })
      .catch((err) => console.log("error", err));
  }, []);

  return (
    <>
      <style jsx global>{`
        .faq-content p {
          margin-bottom: 1rem;
        }
        .faq-content p:last-child {
          margin-bottom: 0;
        }
        .faq-content ul,
        .faq-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .faq-content ul {
          list-style-type: disc;
        }
        .faq-content ol {
          list-style-type: decimal;
        }
        .faq-content li {
          margin-bottom: 0.5rem;
        }
        .faq-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .faq-content a:hover {
          color: #1d4ed8;
        }
        .faq-content strong,
        .faq-content b {
          font-weight: 600;
        }
        .faq-content em,
        .faq-content i {
          font-style: italic;
        }
        .faq-content h1,
        .faq-content h2,
        .faq-content h3,
        .faq-content h4 {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .faq-content h1 {
          font-size: 1.5rem;
        }
        .faq-content h2 {
          font-size: 1.25rem;
        }
        .faq-content h3 {
          font-size: 1.125rem;
        }
        .faq-content h4 {
          font-size: 1rem;
        }
      `}</style>
      <div className="py-8 lg:py-12">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-600">
              Everything you need to know about our products and services
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-1 sm:space-y-3">
            {policy_section.map((i, index) => (
              <div
                key={`section-${i.key}`}
                className="bg-white border border-[transparent] hover:border-neutral-200 px-4 py-1 sm:py-2 lg:py-5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Section Title */}
                <h3 className="text-md sm:text-lg lg:text-xl font-bold text-neutral-900 mb-3 sm:mb-4">
                  {i.label}
                </h3>

                {/* Content - For sections with See More toggle */}
                {i.content && i.key !== warranty && (
                  <>
                    {/* Content Container with Gradient */}
                    <div className="relative mb-3">
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          i.expanded ? "max-h-[5000px]" : "max-h-[100px]"
                        }`}
                      >
                        <div
                          className={`text-sm sm:text-base leading-relaxed text-neutral-700 faq-content ${
                            !i.expanded ? "line-clamp-3" : ""
                          }`}
                        >
                          {parse(i.content)}
                        </div>
                      </div>

                      {/* Gradient Overlay for collapsed state */}
                      {!i.expanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* See More/Less Button */}
                    <div className="relative z-10 pt-3 border-t border-neutral-200">
                      <button
                        onClick={() => handleExpandFAQsSection(i.key)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-semibold text-theme-700 hover:text-white hover:bg-neutral-100 rounded-lg transition-all duration-200 group"
                        aria-expanded={i.expanded}
                      >
                        {i.expanded ? (
                          <>
                            <span>See Less</span>
                            <MingcuteUpLine
                              width={18}
                              height={18}
                              className="group-hover:-translate-y-0.5 transition-transform duration-200"
                            />
                          </>
                        ) : (
                          <>
                            <span>See More</span>
                            <MingcuteDownLine
                              width={18}
                              height={18}
                              className="group-hover:translate-y-0.5 transition-transform duration-200"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {/* Warranty - Always fully expanded, no toggle */}
                {i.key === warranty && i.content && (
                  <div className="text-sm sm:text-base leading-relaxed text-neutral-700 faq-content">
                    {parse(i.content)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 sm:mt-10 lg:mt-12 p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-theme-50 to-theme-100 rounded-lg sm:rounded-xl  shadow-sm">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 mb-2">
                Still have questions?
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 mb-5 sm:mb-6">
                Can't find the answer you're looking for? Our customer support
                team is here to help.
              </p>
              <Link
                href={`tel:${STORE_CONTACT}`}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-theme-600 hover:bg-theme-700 text-white font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProductFaqSection;
