import LoaderIcon from "@/app/components/atom/LoaderIcon";
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <div className="text-center">
        <LoaderIcon width="200" height="200" dark={false} />
        <div className="text-stone-300 text-3xl">Loading...</div>
      </div>
    </div>
  );
}
