import React, { useState } from "react";
import usStocks from "../data/us_stocks.json";
import StockMarketSelector from "./StockMarketSelector";
import Flag from 'react-world-flags';

export default function StockSearch({
    searchInput,
    setSearchInput,
    selectedSymbol,
    setSelectedSymbol,
    filteredResults,
    setFilteredResults,
    selectedMarket, 
    setSelectedMarket
}) {

  function getCountryCodeFromMarket(market) {
    switch(market) {
      case "US": return "US";
      case "SE": return "SE";
      case "JP": return "JP";
      case "CA": return "CA";
      case "DE": return "DE";
      case "GB": return "GB";
      case "FR": return "FR";
      case "AU": return "AU";
      case "HK": return "HK";
      default: return "US"; // fallback
    }
  }

  function filterStocks(input) {
    if (!input) return [];

    return usStocks.filter(stock => {
    if (selectedMarket === "" && stock.market !== "US") return false;
    if (selectedMarket === ".ST" && stock.market !== "SE") return false;
    if (selectedMarket === ".T" && stock.market !== "JP") return false;
    if (selectedMarket === ".TO" && stock.market !== "CA") return false;
    if (selectedMarket === ".F" && stock.market !== "DE") return false;
    if (selectedMarket === ".L" && stock.market !== "GB") return false;
    if (selectedMarket === ".PA" && stock.market !== "FR") return false;
    if (selectedMarket === ".AX" && stock.market !== "AU") return false;
    if (selectedMarket === ".HK" && stock.market !== "HK") return false;
    return stock.name.toLowerCase().includes(input.toLowerCase());
    });
  }

  const popularStocksByMarket = {
    "":[ // NASDAQ
    { name: "Apple Inc.", symbol: "AAPL", market: "US" },
    { name: "Microsoft", symbol: "MSFT", market: "US" },
    { name: "NVIDIA", symbol: "NVDA", market: "US" },
    { name: "Tesla, Inc.", symbol: "TSLA", market: "US" },
    ],
    ".ST": [ // Stockholmsbörsen
    { name: "Volvo B", symbol: "VOLV-B", market: "SE" },
    { name: "Investor B", symbol: "INVE-B", market: "SE" },
    { name: "Assa Abloy B", symbol: "ASSA-B", market: "SE" },
    { name: "Hennes & Mauritz B", symbol: "HM-B", market: "SE" },
    ],
    ".TO": [ // Toronto
    { name: "Shopify", symbol: "SHOP", market: "CA" },
    { name: "Royal Bank of Canada", symbol: "RY", market: "CA" },
    { name: "BCE Inc.", symbol: "BCE", market: "CA" },
    { name: "CAE Inc.", symbol: "CAE", market: "CA" },
    ],
  };  
  

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
        setSearchInput(selected.name); // Shows name
        setSelectedSymbol(selected.symbol); // Symbol thats sent to API
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
              value={searchInput}
              id="stocksearch"
              onKeyDown={handleKeyDown}
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded border border-s-gray-300"
              onFocus={() => {
                if (searchInput.length === 0) {
                  setFilteredResults(popularStocksByMarket[selectedMarket] || []);
                }
              }}
              onChange={(e) => {
                const userInput = e.target.value;
                setSearchInput(userInput);
                setFilteredResults(filterStocks(userInput));
                setHighlightedIndex(-1);
                if (userInput.length > 0) {
                  const matches = usStocks
                  .filter((stock) => {
                    if (selectedMarket === "" && stock.market !== "US") return false;
                    if (selectedMarket === ".ST" && stock.market !== "SE") return false;
                    if (selectedMarket === ".T" && stock.market !== "JP") return false;
                    if (selectedMarket === ".TO" && stock.market !== "CA") return false;
                    if (selectedMarket === ".F" && stock.market !== "DE") return false;
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
                <StockMarketSelector 
                  selectedMarket={selectedMarket} 
                  onMarketChange={(newMarket) => {
                    setSelectedMarket(newMarket); 
                    setSearchInput("");             // clears the input
                    setSelectedSymbol("");          // clears symbols
                    setFilteredResults([]);         // clears search results
                  }}
                  />
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
                      setSearchInput(stock.name);
                      setSelectedSymbol(stock.symbol);
                      setFilteredResults([]);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Flag here */}
                      <Flag
                        code={getCountryCodeFromMarket(stock.market)}
                        style={{ width: 20 }}
                      />
                      {stock.name} <span className="text-gray-900 dark:text-gray-100">({stock.symbol})</span>
                    </div>
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