import { Tooltip } from "react-tooltip";
import { Info } from "lucide-react";

const MiniInfoCard = ({ data }) => {
    if (!data) return null;

    return (
    <div className="dark:text-white text-center px-6 py-5 w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">52-Week Stats</h3>

      <div className="grid grid-cols-2 gap-y-4 text-sm text-left">
        <p><strong>52-Week High:</strong> ${data.fiftyTwoWeekHigh}</p>
        <p><strong>52-Week Low:</strong> ${data.fiftyTwoWeekLow}</p>

        <p className="col-span-2 flex items-center gap-1">
          <strong>Dividend Yield:</strong> {data.dividendYield ? `${(data.dividendYield * 100).toFixed(2)}%` : "N/A"}
          <Info
            size={14}
            className="text-gray-300 hover:text-white cursor-help"
            data-tooltip-id="yield-tooltip"
          />
        </p>

        <p className="col-span-2 flex items-center gap-1">
          <strong>Beta:</strong> {data.beta ?? "N/A"}
          <Info
            size={14}
            className="text-gray-300 hover:text-white cursor-help"
            data-tooltip-id="beta-tooltip"
          />
        </p>
      </div>
      <Tooltip
        id="beta-tooltip"
        place="bottom"
        effect="solid"
        className="!max-w-[240px] text-xs text-white bg-gray-800 rounded px-3 py-2"
      >
        Beta measures how volatile a stock is compared to the market. A beta above 1 means higher volatility, below 1 means lower.
      </Tooltip>
      <Tooltip
        id="yield-tooltip"
        place="bottom"
        effect="solid"
        className="!max-w-[240px] text-xs text-white bg-gray-800 rounded px-3 py-2"
      >
        Shows how much a company pays in dividends each year relative to its stock price. Formula: (Annual Dividend / Stock Price) × 100
      </Tooltip>
    </div>
    );
};

export default MiniInfoCard;