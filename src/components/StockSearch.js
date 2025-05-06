import React, { useState, useRef, useEffect } from "react";
import usStocks from "../data/us_stocks.json";
import Flag from 'react-world-flags';
import { Search } from "lucide-react";

export default function StockSearch({
    searchInput,
    setSearchInput,
    setSelectedSymbol,
    filteredResults,
    setFilteredResults,
    selectedMarket, 
    setSelectedMarket,
    comparedSymbols,
    setComparedSymbols,
    data,
    comparisonData
}) {

  const searchRef = useRef(null);

  useEffect(() => {  // Event listener for outside clicks. To use on menu
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFilteredResults([]);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFilteredResults([]);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  

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

  const handleAddToCompare = (symbol) => {  // add stock to compare
    setComparedSymbols(prev => {
      if (prev.includes(symbol)) return prev; // avoid duplicates
      if (prev.length >= 2) return prev;
      return [...prev, symbol];
    });
  };

  const handleCompareAndNavigate = (symbol, market) => {
    setComparedSymbols(prev => {
      if (prev.includes(symbol) || prev.length >= 2) return prev;

      const updated = [...prev, symbol];

      //Only selects if first
      if (updated.length === 1) {
        handleAddToCompare(symbol);
        setSelectedSymbol(symbol);
        setSelectedMarket(market);
        setSearchInput("");
        setFilteredResults([]);
      }
      return updated;
    })
  };

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
      <div ref={searchRef}> {/* CLICKING OUTSIDE CLOSES DOWN SUGGESTIONS */}
      {/* Search input*/}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onKeyDown={handleKeyDown}
          className="w-full bg-white dark:bg-[#1d2228] p-2 pl-10 rounded-full border text-sm text-black dark:text-white"
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
      </div>


      {/* Suggested Results */}
      {filteredResults.length > 0 && (
        <ul className="absolute z-50 w-full max-w-[300px] overflow-y-auto max-h-96 scroll-smooth pointer-events-auto rounded shadow-md backdrop-blur-md">
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
                {comparedSymbols.length < 2 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // So it doesn't trigger the li click
                      handleCompareAndNavigate(stock.symbol, selectedMarket);
                    }}
                    className="text-green-500 hover:text-green-700 ml-2"
                  >
                    +
                  </button>
                )}
                
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
    );
}