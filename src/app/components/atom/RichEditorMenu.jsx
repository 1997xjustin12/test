import React, {useCallback} from "react";
import {
  IMBold,
  IMItalic,
  MSH1
} from "@/app/components/icons/lib";

function RichEditorMenu({ editor, onSetLink }) {
  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    onSetLink();
  }
  return (
    <div className="border mb-5 p-1 rounded">
      <div className="flex items-center gap-[5px]">
      <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`border rounded p-1 ${editor.isActive("bold") ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
         <IMBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`border rounded p-1 ${editor.isActive("italic") ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
         <IMItalic />
        </button>
        
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`border rounded p-1 ${editor.isActive("heading", { level: 1 }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
           
        >
          {/* icon-park-outline:h1 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 8v32M25 8v32M6 24h19m9.226 0L39 19.017V40"/></svg>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`border rounded p-1 ${editor.isActive("heading", { level: 2 }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* icon-park-outline:h2 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 8v32M24 8v32M7 24h16m9 1c0-3.167 2.667-5 5-5s5 1.833 5 5c0 5.7-10 9.933-10 15h10"/></svg>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`border rounded p-1 ${editor.isActive("heading", { level: 3 }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* icon-park-outline:h3 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 8v32M24 8v32M7 24h16m9-4h10l-7 9c4 0 7 2 7 6s-3 5-5 5c-2.381 0-4-1-5-2.1"/></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`border rounded p-1 ${editor.isActive("strike") ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* gg:format-strike */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 7h4V5H7v2h4v3h2zm-2 12v-5h2v5zm-6-6h14v-2H5z"/></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`border rounded p-1 ${editor.isActive({ textAlign: "left" }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* lucide:align-left */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m14 6H3M21 6H3"/></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`border rounded p-1 ${editor.isActive({ textAlign: "center" }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* lucide:align-center */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 12H7m12 6H5M21 6H3"/></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`border rounded p-1 ${editor.isActive({ textAlign: "right" }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* lucide:align-right */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12H9m12 6H7M21 6H3"/></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`border rounded p-1 ${editor.isActive({ textAlign: "justify" }) ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* lucide:align-justify */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 18h18M3 6h18"/></svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`border rounded p-1 ${editor.isActive('bulletList') ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* gridicons:list-unordered */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 19h12v-2H9zm0-6h12v-2H9zm0-8v2h12V5zm-4-.5a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 5 4.5m0 6a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 5 10.5m0 6a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 5 16.5"/></svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`border rounded p-1 ${editor.isActive('orderedList') ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* gridicons:list-ordered */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19h13v-2H8zm0-6h13v-2H8zm0-8v2h13V5zm-4.425.252q.16-.144.269-.275q-.018.342-.018.756V8h1.175V3.717H3.959L2.488 4.915l.601.738zm.334 7.764q.712-.639.93-.867t.35-.435t.195-.42q.063-.214.063-.466q0-.337-.18-.608c-.18-.271-.289-.32-.507-.417a1.8 1.8 0 0 0-.742-.148q-.331 0-.596.067c-.265.067-.34.11-.491.195q-.225.128-.557.423l.636.744q.261-.225.467-.341a.84.84 0 0 1 .409-.116a.44.44 0 0 1 .305.097a.34.34 0 0 1 .108.264q0 .135-.054.258t-.192.294q-.138.172-.586.64l-1.046 1.058V14h3.108v-.955h-1.62zm.53 4.746v-.018q.46-.13.703-.414q.243-.286.243-.685a.84.84 0 0 0-.378-.727q-.378-.264-1.043-.264q-.46 0-.816.1c-.356.1-.469.178-.696.334l.48.773q.44-.275.85-.275q.22 0 .35.082c.13.082.13.139.13.252q0 .451-.882.451h-.27v.87h.264q.326 0 .527.049q.202.047.293.143t.091.271q0 .228-.174.336q-.174.106-.555.106a2.3 2.3 0 0 1-.538-.069a2.5 2.5 0 0 1-.573-.212v.961q.342.131.637.182t.64.05q.84 0 1.314-.343q.473-.343.473-.94q.004-.878-1.07-1.013"/></svg>
        </button>
        
        
        <button
          onClick={handleSetLink}
          className={`border rounded p-1 ${editor.isActive('link') ? "border-zinc-300 bg-zinc-300" : "border-white"}`}
        >
          {/* famicons:unlink */}
          {/* famicons:link */}
          {
            editor.isActive('link') ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M200.66 352H144a96 96 0 0 1 0-192h55.41m113.18 0H368a96 96 0 0 1 0 192h-56.66"/></svg>:
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M200.66 352H144a96 96 0 0 1 0-192h55.41m113.18 0H368a96 96 0 0 1 0 192h-56.66m-142.27-96h175.86"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

export default RichEditorMenu;


