import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Info } from "lucide-react";

const MiniInfoCard = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-[#232a31] dark:text-gray-100 p-4 rounded shadow-md">
            <p><strong>52-Week High:</strong> ${data.fiftyTwoWeekHigh}</p>
            <p><strong>52-Week Low:</strong> ${data.fiftyTwoWeekLow}</p>
            <p><strong>Dividend Yield:</strong> {data.dividendYield ? `${(data.dividendYield * 100).toFixed(2)}%` : "N/A"}</p>
            <p>
              <strong>Beta:</strong> {data.beta ?? "N/A"}
              <span className="inline-flex items-center ml-1">
              <Info size={14} className="text-gray-300 hover:text-white cursor-help" data-tooltip-id="beta-tooltip"/>
              </span>
            </p>

                  {/* Tooltip definition */}
            <Tooltip id="beta-tooltip" place="bottom" effect="solid"   className="!max-w-[240px] text-xs text-white bg-gray-800 rounded px-3 py-2">
              Beta measures how volatile a stock is compared to the market. A beta above 1 means higher volatility, below 1 means lower.
            </Tooltip>
      </div>
    );
};

export default MiniInfoCard;