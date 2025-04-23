import React, { useState, useEffect } from "react";

const MiniDashboard = ({stockdata}) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const hasData = stockdata && stockdata.length > 0;

    const latest = hasData ? stockdata[stockdata.length - 1] : {};
    const prev = hasData ? stockdata[stockdata.length - 2] || latest : {};
    const symbol = latest?.symbol || "";

    // Dummy variables in case of no data
    const change = latest.Close && prev.Close ? latest.Close - prev.Close : 0;
    const changePct = ((change / prev.Close) * 100).toFixed(2);
    const isPositive = change >= 0;

    
    // localStorage on load
    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setIsFavorite(watchlist.includes(symbol));
    }, [symbol]);

    const toggleFavorite = () => {
        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (watchlist.includes(symbol)) {
        watchlist = watchlist.filter(sym => sym !== symbol);
    } else {
        watchlist.push(symbol);
    }
        setIsFavorite(!isFavorite);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    };

    if (!hasData) return null;

    return (
        <div className="p-4 bg-white dark:bg-gray-800 dark:text-gray-100 rounded shadow-md w-full max-w-md mx-auto mb-7">
        <div>
            <p className="text-xl font-bold">{stockdata[0].stockname}</p>
            <button
                onClick={toggleFavorite}
                className={`text-sm px-3 py-1 rounded border transition-colors duration-250 hover:border-emerald-400 hover:scale-[1.02] active:scale-[0.98] ${
                    isFavorite
                    ? "bg-emerald-400 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
                >
                {isFavorite ? "★ Favorited" : "☆ Add to Watchlist"}
            </button>
        </div>
        <div>
             <p className="font-medium">Price</p>
             <p className="text-xl font-bold">${latest.Close.toFixed(2)}</p>
        </div>
        <div>
        <p className="font-medium">Change</p>
        <p className={`text-xl font-bold" ${isPositive ? 'text-green-500' : 'text-red-500'}`}>${change.toFixed(2)} ({changePct}%)</p>
        </div>
        <div>
        <p className="font-medium">Volume</p>
        <p className="text-xl font-bold">${latest.Volume.toLocaleString()}</p>
        </div>
        </div>
    );
};

export default MiniDashboard;