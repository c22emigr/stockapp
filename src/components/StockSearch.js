import React, { useState } from "react";
import usStocks from "../data/us_stocks.json";
import StockMarketSelector from "./StockMarketSelector";

export default function StockSearch({
    stockname,
    setStockname,
    range, 
    setRange,
    filteredResults,
    setFilteredResults,
    selectedMarket, 
    setSelectedMarket
}) {

    {/* ARROW KEYS + ENTER FOR NAVIGATION */}
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const handleKeyDown = (e) => {
      if (filteredResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
        prev === 0 ? filteredResults.length - 1 : prev -1
      );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        const selected = filteredResults[highlightedIndex];
        setStockname(selected.symbol);
        setFilteredResults([]);
      }


    }

    return (
      <div>
       
      {/* Search input*/}
      <form className="relative flex justify-center p-2" id="searchform">
        <div>
          <div className="form">
            <input
              type="text"
              value={stockname}
              id="stocksearch"
              onKeyDown={handleKeyDown}
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded border border-s-gray-300"
              onChange={(e) => {
                const userInput = e.target.value;
                setStockname(userInput);

                if (userInput.length > 0) {
                  const matches = usStocks
                  .filter((stock) => {
                    if (selectedMarket === "" && stock.market !== "US") return false;
                    if (selectedMarket === ".ST" && stock.market !== "SE") return false;
                    if (selectedMarket === ".T" && stock.market !== "JP") return false;
                    if (selectedMarket === ".TO" && stock.market !== "CA") return false;
                    if (selectedMarket === ".F" && stock.market !== "GE") return false;
                    if (selectedMarket === ".L" && stock.market !== "GB") return false;
                    if (selectedMarket === ".PA" && stock.market !== "FR") return false;
                    if (selectedMarket === ".AX" && stock.market !== "AU") return false;
                    if (selectedMarket === ".HK" && stock.market !== "HK") return false;
                    return true;
                  })
                  .filter((stock) =>
                    stock.name.toLowerCase().includes(userInput.toLowerCase())
                  );
                  setFilteredResults(matches);
                  setHighlightedIndex(-1); // Resets the highlight
                } else {
                  setFilteredResults([]);
                }
              }}
              placeholder="Enter company name"
            />
            <div className="inline mt-2 ml-7">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                <StockMarketSelector selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
              </span>
            </div>


            {/* Suggested Results */}
            {filteredResults.length > 0 && (
              <ul className="absolute z-50 overflow-y-auto w-full max-h-96 scroll-smooth pointer-events-auto rounded shadow-md">
                {filteredResults.map((stock, index) => (
                  <li
                    key={index}
                    className={`p-2 dark:text-white text-black cursor-pointer text-sm ${
                      index === highlightedIndex
                      ? "bg-emerald-400 text-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => {
                      setStockname(stock.symbol);
                      setFilteredResults([]);
                    }}
                  >
                    {stock.name} <span className="text-gray-900 dark:text-gray-100">({stock.symbol})</span>
                  </li>
                ))}
              </ul>
            )}
            

            <button
              type="submit"
              id="stocksearchbutton"
              className="sr-only"
            >
              Search
            </button>
          </div>
        </div>

      </form>
    </div>
    );
}