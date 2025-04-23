import React, { useEffect, useState } from "react";
import { isFavorited, toggleFavorite } from "../utils/watchlist";


const FavoriteButton = ({ symbol }) => {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (symbol) {
    setFavorited(isFavorited(symbol));
    }
  }, [symbol]);

  const handleClick = () => {
    if (!symbol) return;
    const newState = toggleFavorite(symbol);
    setFavorited(newState);

    const event = new Event("watchlistUpdated");
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-3 py-1 rounded border transition-colors duration-250 hover:border-emerald-400 hover:scale-[1.02] active:scale-[0.98] ${
        favorited
          ? "bg-emerald-400 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
      }`}
    >
      {favorited ? "★ Favorited" : "☆ Add to Watchlist"}
    </button>
  );
};

export default FavoriteButton;