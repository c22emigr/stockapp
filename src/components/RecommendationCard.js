import React, { useState } from "react";

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;
  return (
    <div className="bg-white dark:bg-[#232a31] dark:text-gray-100 p-4 rounded shadow-md w-full max-w-md mx-auto">
      <h3 className="font-semibold mb-1">📊 Analyst Consensus</h3>
      <p>Buy: ✅ {recommendation.buy}</p>
      <p>Hold: 🤝 {recommendation.hold}</p>
      <p>Sell: ❌ {recommendation.sell}</p>
      <p className="mt-2 text-emerald-400">Target Price: ${recommendation.targetMeanPrice?.toFixed(2)}</p>
    </div>
  );
};

export default RecommendationCard;