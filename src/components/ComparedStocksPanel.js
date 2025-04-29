import React from "react";
  

export default function ComparedStocksPanel({ comparedSymbols, removeComparedSymbol }) {
  if (comparedSymbols.length === 0) return null;


  return (
    <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded shadow text-sm">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Compared Stocks:
      </h3>
      <ul className="flex flex-wrap gap-2">
        {comparedSymbols.map((symbol) => (
          <li
            key={symbol}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded flex items-center gap-2"
          >
            {symbol}
            <button
              onClick={() => removeComparedSymbol(symbol)}
              className="text-red-500 hover:text-red-700"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
