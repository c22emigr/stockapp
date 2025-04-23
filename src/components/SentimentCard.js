import React, { useState } from "react";

const SentimentCard = ({ sentiment }) => {
    if (!sentiment) return null;
    return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded shadow-md">
        <h3 className="font-semibold mb-1">💬 Market Sentiment</h3>
        <p>📰 News Buzz Score: {sentiment.buzz?.buzz}</p>
        <p>🔺 Twitter: {sentiment.sentiment?.twitter?.score > 0 ? "Positive" : "Negative"}</p>
        <p>🧠 Reddit: {sentiment.sentiment?.reddit?.score > 0 ? "Positive" : "Negative"}</p>
      </div>
    );
};

export default SentimentCard;