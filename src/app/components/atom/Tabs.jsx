'use client'

import React, {useState} from 'react'
import parser from 'html-react-parser';

const tabs = [
    {key: "about",name: "about solana fireplaces", content: `<p>Welcome to Solana Fireplaces! Since 2002, we have been offering a wide selection of top grill brands from our Southern California location. Our store provides thousands of products at unbeatable prices—so low that many cannot even be advertised. Our knowledgeable sales team is here to help you find the perfect items at the best value. Take advantage of our exclusive discounts and limited-quantity package deals. Contact us today for the best offers!</p>

<p style="margin-top:20px;">We are dedicated to delivering outstanding customer service. If you experience any issues or have concerns, please allow us the opportunity to resolve them before leaving negative feedback. Our commitment is to provide a seamless shopping experience with a 5-star level of service.</p>
`},
    {key: "shipping-policy",name: "shipping policy", content: `<p>At Solana Fireplaces, we strive to provide a smooth and hassle-free shopping experience for our customers. We understand that costs can add up, so we offer free shipping on all orders over $79.99 to make your purchase even more budget-friendly.</p>
    <ul style="margin-top:20px; list-style-type: disc; padding-left:20px">
        <li>Orders over $79.99 qualify for free shipping.</li>
        <li>A flat shipping fee of $9.99 applies to orders under $79.99.</li>
        <li>We use standard ground shipping within the continental United States.</li>
        <li>Orders are typically processed and shipped within 2-3 business days after payment confirmation.</li>
        <li>Delivery times vary based on location and carrier schedules.</li>
        <li>We do not ship to PO boxes or APO/FPO addresses.</li>
        <li>Oversized or heavy items may be subject to additional shipping fees.</li>
        <li>Customers will be informed of any shipping delays or issues.</li>
        <li>Order tracking is available through your account or by contacting our customer support team.</li>
    </ul>

    <p style="margin-top:20px">If you need further assistance regarding our shipping policy or have any other questions, feel free to contact our customer service team at <strong>(888) 667-4986</strong>.</p>
`},
    {key: "return-policy",name: "return policy", content: `
    <p class="pt-[20px]">At Outdoor Kitchen Outlet, we stand by our <strong>Satisfaction Guarantee</strong>. Our knowledgeable experts are here to help you choose the best equipment at the most competitive prices. We are committed to supporting you both before and after your purchase. If you encounter any issues or have concerns, our team is ready to assist you.</p>

    <p class="pt-[20px]">We offer a <strong>30-day return policy</strong> on all items unless otherwise specified in the product listing.</p>

    <h3>How to Initiate a Return:</h3>
    <ol class="list-decimal list-inside space-y-2" style="margin-top:20px; padding-left:20px; ">
        <li>To return an eligible item, please contact us for a <strong>Return Merchandise Authorization (RMA)</strong>.</li>
        <li>A <strong>20% restocking fee</strong> applies to all opened items.</li>
        <li>All returned products must be in their original condition, including packaging and all included contents.</li>
        <li>Items should be securely packed to prevent damage during return shipping.</li>
        <li>To request a return, email our customer support at <a href="mailto:info@outdoorkitchenoutlet.com">info@outdoorkitchenoutlet.com</a>. You will receive an RMA number and further instructions.</li>
        <li>Once we receive your return, please allow <strong>3-5 business days</strong> for processing.</li>
        <li>Returns that do not comply with this policy will not be accepted and will be returned at the customer's expense.</li>
    </ol>`},
    {key: "warranty",name: "warranty", content: `If you have an issue with a product we are happy to assist with the warranty claim.`},
]
function Tabs() {
    const [tab, setTab] = useState("about");
    
    const handleTabChange=(tab)=>{
        setTab(tab);
    }

  return (
    <div>
        <div className="block  lg:flex lg:items-center">
            {
                tabs.map(i=> <div key={`tab-button-${i.key}`} className="w-full">
                <button  onClick={()=> handleTabChange(i.key)} className={`w-full text-sm uppercase font-semibold border-b-2 py-[20px] transition-all duration-700 ease-in-out ${ tab === i.key ? "text-stone-950 border-theme-700": "text-stone-600 "}`}>{i.name}</button>
                {
                    i.key === tab && <div className=" lg:hidden p-3 text-xs">
                        {
                            parser(i?.content)
                        }
                    </div>
                }
                </div>)
            }
        </div>
        {/* desktop content display */}
        <div className="hidden lg:block px-3 py-5 text-sm">
            {
                parser(tabs.find(({key})=> tab === key)?.content)
            }
        </div>
    </div>
  )
}

export default Tabs