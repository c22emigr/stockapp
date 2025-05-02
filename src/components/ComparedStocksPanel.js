import React from "react";
  

export default function ComparedStocksPanel({ comparedSymbols, removeComparedSymbol, setSelectedSymbol }) {
  if (comparedSymbols.length === 0) return null;


  return (
    <div className="mt-4 p-2 bg-gray-100 dark:bg-[#232a31] rounded shadow text-sm">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Compared Stocks:
      </h3>
      <ul className="flex flex-wrap gap-2">
        {comparedSymbols.map((symbol) => (
          <li
            key={symbol}
            onClick={() => setSelectedSymbol(symbol)}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:scale-[1.02] active:scale-[0.98] border-transparent hover:border-emerald-400 px-4 py-4 rounded flex items-center gap-2 cursor-pointer"
          >
            {symbol}
            <button
              onClick={() => removeComparedSymbol(symbol)}
              className="hover:scale-[1.05] active:scale-[0.95]"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
