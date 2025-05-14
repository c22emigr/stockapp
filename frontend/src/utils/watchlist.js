export const getWatchlist = () => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  };
  
  export const isFavorited = (stockname) => {
    const stored = getWatchlist();
    return stored.includes(stockname);
  };
  
export const toggleFavorite = (symbol, name, market) =>  {
      const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
      const exists = stored.find(item => item.symbol === symbol && item.market === market);

      let updated;
      if (exists) {
        updated = stored.filter(item => !(item.symbol === symbol && item.market === market));
      } else {
        updated = [...stored, {symbol, name, market}];
      }

    localStorage.setItem("watchlist", JSON.stringify(updated));
    return updated;
    };
  
