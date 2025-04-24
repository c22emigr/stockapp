import React, { useState } from "react";
import { ArrowUpRight, PauseCircle, ArrowDownRight, PlusCircle, MinusCircle } from "lucide-react";


const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;
  return (
    <div className="bg-white dark:bg-[#232a31] dark:text-gray-100 p-4 rounded shadow-md w-full max-w-md mx-auto">
      <h3 className="font-semibold mb-1">Analyst Consensus</h3>
      <p className="flex items-center gap-1">
        <PlusCircle size={16} className="text-green-400" />
        <span>Buy:</span> {recommendation.buy}
      </p>
      <p className="flex items-center gap-1">
        <PauseCircle size={16} className="text-yellow-400" />
        <span>Hold:</span> {recommendation.hold}
      </p>
      <p className="flex items-center gap-1">
        <MinusCircle size={16} className="text-red-400"/>
        <span>Sell:</span> {recommendation.sell}
      </p>
    </div>
  );
};

export default RecommendationCard;