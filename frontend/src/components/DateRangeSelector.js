
const DateRangeSelector = ({ range, setRange }) => {
  const ranges = ["1d", "5d", "1mo", "6mo", "1y", "max"];

  return (
    <div className="flex gap-2 justify-center mt-4 flex-wrap">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          type="button"
          className={`px-3 py-1 mb-7 border rounded-md text-sm transition-all duration-200 ${
            range === r
              ? "bg-emerald-400 text-white border-gray-100 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white border-transparent hover:border-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
};

export default DateRangeSelector;