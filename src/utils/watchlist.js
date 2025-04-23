export const getWatchlist = () => {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  };
  
  export const isFavorited = (stockname) => {
    const list = getWatchlist();
    return list.includes(stockname);
  };
  
  export const toggleFavorite = (stockname) => {
    let list = getWatchlist();
  
    const index = list.indexOf(stockname);
    let updatedList;
  
    if (index > -1) {
      // Remove from list
      updatedList = list.filter((s) => s !== stockname);
      localStorage.setItem("watchlist", JSON.stringify(updatedList));
      return false;
    } else {
      // Add to list
      updatedList = [...list, stockname];
      localStorage.setItem("watchlist", JSON.stringify(updatedList));
      return true;
    }
  };
  
