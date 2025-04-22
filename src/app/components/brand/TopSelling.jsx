import React from 'react'

function TopSelling() {
  return (
    <section>
        <div className="container mx-auto py-[20px]">
            <div className="text-center font-bold text-2xl">Top Selling</div>
            <div className="w-full">
                <ul className="flex items-center justify-between mt-[20px]">
                    <li className="aspect-[2/3] border rounded w-[300px] bg-zinc-100 shadow-lg"></li>
                    <li className="aspect-[2/3] border rounded w-[300px] bg-zinc-100 shadow-lg"></li>
                    <li className="aspect-[2/3] border rounded w-[300px] bg-zinc-100 shadow-lg"></li>
                    <li className="aspect-[2/3] border rounded w-[300px] bg-zinc-100 shadow-lg"></li>
                </ul>
            </div>
        </div>
    </section>
  )
}

export default TopSelling