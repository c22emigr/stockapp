import React from "react";

export default function StockMarketSelector({ selectedMarket, setSelectedMarket }) {
  const markets = [
    { name: "United States", suffix: "" },
    { name: "Sweden", suffix: ".ST" },
    { name: "Canada", suffix: ".TO" },
    { name: "Germany", suffix: ".F" },
    { name: "United Kingdom", suffix: ".L" },
    { name: "France", suffix: ".PA" },
    { name: "Japan", suffix: ".T" },
    { name: "Australia", suffix: ".AX" },
    { name: "Hong Kong", suffix: ".HK" },
  ];

  
  return (
    <select
      value={selectedMarket}
      onChange={(e) => setSelectedMarket(e.target.value)}
      className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-black dark:text-white"
    >
      {markets.map((market) => (
        <option key={market.suffix} value={market.suffix}>
          {market.name}
        </option>
      ))}
    </select>
  );
}
