import React from "react";
import usStocks from "../data/us_stocks.json";

export default function StockSearch({
    stockname,
    setStockname,
    range, 
    setRange,
    filteredResults,
    setFilteredResults,
    handleSearch,
}) {
    return (
      <div>
        {/* Date Range */}
      <div className="flex gap-2 justify-center mt-4 flex-wrap">
        {["1d", "5d", "1mo", "6mo", "1y", "max"].map((r) => (
          <button
            key={r}
            type="button"
            className={`px-3 py-1 border rounded-md text-sm ${
              range === r
                ? "bg-emerald-400 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
            onClick={(e) => {
              setRange(r);
              handleSearch(e);
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Search input*/}
      <form className="flex justify-center mb-7 p-2" id="searchform" onSubmit={handleSearch}>
        <div>
          <div className="form">
            <input
              type="text"
              value={stockname}
              id="stocksearch"
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded border border-s-gray-300"
              onChange={(e) => {
                const userInput = e.target.value;
                setStockname(userInput);

                if (userInput.length > 0) {
                  const matches = usStocks.filter((stock) =>
                    stock.name.toLowerCase().includes(userInput.toLowerCase())
                  );
                  setFilteredResults(matches);
                } else {
                  setFilteredResults([]);
                }
              }}
              placeholder="Enter company name"
            />

            {/* Suggested Results */}
            {filteredResults.length > 0 && (
              <ul>
                {filteredResults.map((stock, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStockname(stock.symbol);
                      setFilteredResults([]);
                      setTimeout(() => handleSearch(), 0);
                    }}
                  >
                    {stock.name} <span className="text-gray-400">({stock.symbol})</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              id="stocksearchbutton"
              onClick={() => {  {/* Date range buttons search when clicked */}
                setRange("5d");
                handleSearch();
              }}
              className="ml-7 border bg-gray-200 rounded border border-s-gray-300 p-1 dark:bg-gray-700 dark:text-gray-300"
            >
              Search
            </button>
          </div>
        </div>

      </form>
    </div>
    );
}