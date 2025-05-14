import React from "react";
import FavoriteButton from "./FavoriteButton";


const MiniDashboard = ({ stockdata }) => {
    if (!stockdata || stockdata.length === 0) return null;

    const latest = stockdata[stockdata.length -1];
    const prev = stockdata[stockdata.length -2] || latest;
    const stockname = stockdata[0]?.stockname || "";

    const change = latest.Close - prev.Close;
    const changePct = ((change / prev.Close) * 100).toFixed(2);
    const isPositive = change >= 0;

    return (
    <div className="p-7 mx-auto dark:text-gray-100 text-center space-y-4">
    <div className="space-y-2">
        <p className="text-xl font-bold">{stockdata[0].stockname}</p>
        <FavoriteButton symbol={stockdata[0].symbol} name={stockdata[0].stockname} />
    </div>

    <div className="space-y-1">
        <p className="text-sm text-gray-400 dark:text-gray-300">Price</p>
        <p className="text-xl font-bold">${latest.Close.toFixed(2)}</p>
    </div>

    <div className="space-y-1">
        <p className="text-sm text-gray-400 dark:text-gray-300">Change</p>
        <p className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        ${change.toFixed(2)} ({changePct}%)
        </p>
    </div>

    <div className="space-y-1">
        <p className="text-sm text-gray-400 dark:text-gray-300">Volume</p>
        <p className="text-xl font-bold">${latest.Volume.toLocaleString()}</p>
    </div>
    </div>
    );
};

export default MiniDashboard;