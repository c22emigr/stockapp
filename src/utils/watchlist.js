export const getWatchlist = () => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  };
  
  export const isFavorited = (stockname) => {
    const list = getWatchlist();
    return list.includes(stockname);
  };
  
export const toggleFavorite = (symbol, name) =>  {
      const list = JSON.parse(localStorage.getItem("watchlist")) || [];
      const exists = list.find(item => item.symbol === symbol);

      let updated;
      if (exists) {
        updated = list.filter(item => item.symbol !== symbol);
      } else {
        updated = [...list, {symbol, name}];
      }

    localStorage.setItem("watchlist", JSON.stringify(updated));
    return updated;
    };
  
