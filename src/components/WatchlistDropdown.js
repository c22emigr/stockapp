import { Loader } from "lucide-react";
import react, { useState, useEffect } from "react";

const WatchlistDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [watchlist, setWatchlist] = useState([])

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
        <div className="relative text-right ml-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md"
      >
        Watchlist
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {watchlist.length === 0 ? (
              <li className="p-3 text-center text-gray-500 dark:text-gray-300">No favorites yet ✨</li>
            ) : (
              watchlist.map((stockname, idx) => (
                <li key={idx} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  {stockname}
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
