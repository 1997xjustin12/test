import React from 'react'
import EditMenuItem from "@/app/components/admin/EditMenuItem";
import CardWrap from '@/app/components/admin/CardWrap';
import { notFound } from "next/navigation";

export default async function EditMenuItemPage({params}) {
  const { menu_id } = await params;

  if(!menu_id){
    return notFound();
  }
  
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
        <CardWrap>
            <div className="p-3"><EditMenuItem menu_id={menu_id}/></div>
        </CardWrap>
    </div>
  )
}
