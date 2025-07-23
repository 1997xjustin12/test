export default function FilterChip({ filter, onClose }) {
  const handleClose = () => {
    onClose(filter);
  };
  return (
    <div className="inline-block select-none shadow-sm group">
      <div className="flex items-center gap-[5px] w-[auto] rounded overflow-hidden border-[0.5px] border-stone-400 pr-[5px] group-hover:border-stone-400">
        <button
          onClick={handleClose}
          className="text-white bg-stone-500 w-[25px] group-hover:bg-stone-600">
          x
        </button>
        <div className="text-slate-900">{filter.label}</div>
      </div>
    </div>
  );
}
