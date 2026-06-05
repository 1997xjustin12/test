'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'What is the best brand of barbecue grill?',
    a: 'The best brand depends on your cooking needs, fuel preference and budget. Look for durable materials, even heat distribution, a strong warranty and easy-to-use features that fit your space and lifestyle.',
  },
  {
    q: 'Are open-box grills reliable?',
    a: 'Yes — every open-box unit is opened, inspected and approved for resale. They typically have minor cosmetic imperfections only, carry the full manufacturer warranty, and cost significantly less than new.',
  },
  {
    q: 'What is the healthiest type of grill to use?',
    a: 'Infrared and electric grills produce less smoke and fewer harmful compounds. Models with easy-to-clean surfaces and proper fat drainage also reduce flare-ups and excess grease.',
  },
  {
    q: 'What kind of grill lasts the longest?',
    a: 'Grills made from high-quality stainless steel or cast iron last longest. With regular cleaning, protective covers and proper care, they resist rust and retain heat well for many years.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-stone-900 border border-grate dark:border-stone-700 rounded">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-5 sm:px-6 py-4 text-left font-oswald font-semibold text-base sm:text-lg uppercase tracking-wide text-stone-900 dark:text-ash"
      >
        {q}
        <span className="text-2xl text-theme-600 shrink-0 ml-3">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p className="px-5 sm:px-6 pb-5 text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">Buyer Questions</p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1 text-stone-900 dark:text-ash">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {FAQS.map(item => <FaqItem key={item.q} {...item} />)}
        </div>
      </div>
    </section>
  )
}
