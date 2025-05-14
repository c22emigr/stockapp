import { Loader } from "lucide-react";
import react, { useState, useEffect } from "react";
import { toggleFavorite } from "../utils/watchlist";
import usStocks from "../data/us_stocks.json";
import { Star, X } from "lucide-react";
import Flag from "react-world-flags";

const WatchlistDropdown = ({ setSelectedSymbol }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

    const getMarketFromSymbol = (symbol) => {
      if (symbol.includes(".ST")) return "SE";
      if (symbol.includes(".TO")) return "CA";
      if (symbol.includes(".F")) return "DE";
      if (symbol.includes(".L")) return "GB";
      if (symbol.includes(".PA")) return "FR";
      if (symbol.includes(".T")) return "JP";
      if (symbol.includes(".AX")) return "AU";
      if (symbol.includes(".HK")) return "HK";
      return "US";
    };

    useEffect(() => {
      const updateWatchlist = () => {
        const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(stored);
      };
      
      updateWatchlist();

      window.addEventListener("watchlistUpdated", updateWatchlist);

      return () => {
        window.removeEventListener("watchlistUpdated", updateWatchlist);
      };
    }, []);

    const handleSelectStock = (symbol) => {
      const fullStock = usStocks.find(stock => stock.symbol === symbol);
      if (fullStock) {
        const fullSymbol =
          fullStock.market && fullStock.market !== "US"
            ? `${fullStock.symbol}.${fullStock.market}`
            : fullStock.symbol;
        setSelectedSymbol(fullSymbol);
        setIsOpen(false);
      } else {
        setSelectedSymbol(symbol);
        setIsOpen(false);
      }
    };

    return ( 
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg transition"
        >
          <Star className="w-4 h-4" />
          <span className="font-semibold">Watchlist</span>
        </button>

      {isOpen && (
      <div className="absolute right-0 mt-2 w-64 z-50 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-[#1d2228]/80 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10">
        <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
          {watchlist.length === 0 ? (
            <li className="p-3 text-center text-gray-500 dark:text-gray-400 italic">
              No favorites yet
            </li>
          ) : (
            watchlist.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => handleSelectStock(item.symbol)}
            >
              <div className="flex items-center gap-2 truncate text-gray-800 dark:text-white">
                {/* Get full stock data to grab market info */}
                {(() => {
                  const fullStock = usStocks.find(s => s.symbol === item.symbol);
                  const flagCode = getMarketFromSymbol(item.symbol);
                  return <Flag code={flagCode} className="w-5 h-5 shrink-0" />;
                })()}
                <span className="truncate">{item.name || item.symbol}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const fullStock = usStocks.find(s => s.symbol === item.symbol);
                  const fullName = fullStock?.name || item.symbol;
                  const updated = toggleFavorite(item.symbol, fullName);
                  setWatchlist(updated);
                  window.dispatchEvent(new Event("watchlistUpdated"));
                }}
                  className="text-red-400 hover:text-emerald-400 text-sm ml-2"
                >
                  <X size={20} />
                </button>
              </li>
            ))
          )}
        </ul>
    </div>
      )}
    </div>
    );
};

export default WatchlistDropdown;
