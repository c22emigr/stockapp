import React from "react";

export default function StockMarketSelector({ selectedMarket, onMarketChange }) {
  const markets = [
    { name: "NASDAQ", suffix: "" },
    { name: "Stockholmsbörsen", suffix: ".ST" },
    { name: "Toronto Stock Exchange", suffix: ".TO" },
    { name: "Frankfurt Stock Exchange", suffix: ".F" },
    { name: "London Stock Exchange", suffix: ".L" },
    { name: "Paris Stock Exchange", suffix: ".PA" },
    { name: "Tokyo Stock Exchange", suffix: ".T" },
    { name: "Australian Securities Exchange", suffix: ".AX" },
    { name: "Hong Kong Stock Exchange", suffix: ".HK" },
  ];

  
  return (
    <select
      value={selectedMarket}
      onChange={(e) => onMarketChange(e.target.value)}
      className="bg-gray-200 dark:bg-gray-700 p-2 rounded w-28 text-black dark:text-white"
    >
      {markets.map((market) => (
        <option key={market.suffix} value={market.suffix}>
          {market.name}
        </option>
      ))}
    </select>
  );
}
