import { Loader } from "lucide-react";
import react, { useState, useEffect } from "react";
import { toggleFavorite } from "../utils/watchlist";

const WatchlistDropdown = ({ setStockname }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

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

    return ( 
        <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md"
      >
        Watchlist
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 mt-0 pt-0">
            {watchlist.length === 0 ? (
              <li className="p-3 text-center text-gray-500 dark:text-gray-300">No favorites yet ✨</li>
            ) : (
              watchlist.map((symbol, idx) => (
                <li 
                  key={idx} 
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setStockname(symbol);
                    setIsOpen(false);
                  }}
                  >
                  {symbol}
                  <span>
                  <button
                    onClick={() =>  {
                      toggleFavorite(symbol)

                      const updated = JSON.parse(localStorage.getItem("watchlist")) || [];
                      setWatchlist(updated);

                      const event = new Event("watchlistUpdated");
                      window.dispatchEvent(event);
                    }}
                    className="text-red-400 hover:text-red-600 text-sm ml-2"
                  >
                    ✖
                  </button>
                  </span>
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
