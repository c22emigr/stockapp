import React, { useState, useRef, useEffect } from "react";
import Flag from "react-world-flags";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const markets = [
  { name: "NASDAQ", suffix: "", flagCode: "US", shortName: "USA" },
  { name: "Stockholmsbörsen", suffix: ".ST", flagCode: "SE", shortName: "Sverige" },
  { name: "Toronto Stock Exchange", suffix: ".TO", flagCode: "CA", shortName: "Kanada" },
  { name: "Frankfurt Stock Exchange", suffix: ".F", flagCode: "DE", shortName: "Tyskland" },
  { name: "London Stock Exchange", suffix: ".L", flagCode: "GB", shortName: "Storbritannien" },
  { name: "Paris Stock Exchange", suffix: ".PA", flagCode: "FR", shortName: "Frankrike" },
  { name: "Tokyo Stock Exchange", suffix: ".T", flagCode: "JP", shortName: "Japan" },
  { name: "Australian Securities Exchange", suffix: ".AX", flagCode: "AU", shortName: "Australien" },
  { name: "Hong Kong Stock Exchange", suffix: ".HK", flagCode: "HK", shortName: "Hong Kong" },
];

export default function StockMarketSelector({ selectedMarket, onMarketChange, showModal, setShowModal }) {
  const scrollRef = useRef(null);  // Horizontal click to scroll on buttons

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      el.classList.add('cursor-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const handleMouseUp = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      {/* Desktop flag menu */}
      <h3 className="hidden lg:inline text-md mr-2 text-gray-900 dark:text-gray-100">Market today:</h3>
      <div ref={scrollRef} className="hidden md:block overflow-x-auto max-w-[600px] scrollbar-stock-selector mt-3">
        <div className="flex gap-2 w-max px-1 pb-[6px]">  
          {markets.map((market) => (
            <button
              key={market.suffix}
              onClick={() => onMarketChange(market.suffix)}
              className={`w-full md:w-auto flex items-center justify-start md:justify-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedMarket === market.suffix
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-transparent hover:border-emerald-400"
              }`}
              title={market.name}
            >
              <Flag code={market.flagCode} className="w-6 h-6" />
              {market.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Modal Trigger */}
      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-3 py-2 mb-5 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border border-transparent hover:border-emerald-400">
              Select Market
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Select Market</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-4">
              {markets.map((market) => (
                <button
                  key={market.suffix}
                  onClick={() => onMarketChange(market.suffix)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition text-left ${
                    selectedMarket === market.suffix
                      ? "bg-emerald-400 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  <Flag code={market.flagCode} className="w-5 h-5" />
                  {market.name}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
