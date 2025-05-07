import React from "react";
import { X } from "lucide-react";

export default function ComparedStocksPanel({ comparedSymbols, removeComparedSymbol, setSelectedSymbol }) {
  if (comparedSymbols.length === 0) return null;


  return (
  <div className="bg-white dark:bg-[#1d2228] rounded-lg shadow px-4 py-2 w-fit mx-auto mt-4">
    <div className="flex flex-col items-center text-sm font-semibold text-gray-800 dark:text-gray-100 gap-2">
      <span>Compared Stocks:</span>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {comparedSymbols.map((symbol) => (
          <span
            key={symbol}
            onClick={() => setSelectedSymbol(symbol)}
            className="px-3 py-1 rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-transparent hover:border-emerald-400 transition-all flex items-center gap-2 cursor-pointer"
          >
            {symbol}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeComparedSymbol(symbol);
              }}
              className="text-red-400 hover:text-emerald-400 transition-colors"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
  );
}
