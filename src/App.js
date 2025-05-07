import React, { useEffect, useState } from 'react';
import './index.css';
import usStocks from './data/us_stocks.json';
import StockChart from './components/StockChart';
import { ResponsiveContainer } from 'recharts';
import StockSearch from './components/StockSearch';
import MiniDashboard from './components/MiniDashboard';
import CompanyOverview from './components/CompanyOverview';
import WatchlistDropdown from './components/WatchlistDropdown';
import DateRangeSelector from './components/DateRangeSelector';
import RecommendationCard from './components/RecommendationCard';
import MiniInfoCard from './components/MiniInfoCard';
import ComparedStocksPanel from './components/ComparedStocksPanel';
import normalizeData from "./utils/normalizeData";
import { div } from 'framer-motion/client';
import StockMarketSelector from "./components/StockMarketSelector";
import { Sun, Moon, Loader } from "lucide-react";
import NewsPanel from './components/NewsPanel';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [stockname, setStockname] = useState('');
  const [stockinfo, setStockinfo] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [DarkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? saved === "true" : false;
  });
  const [range, setRange] = useState("5d");
  const [recommendation, setRecommendation] = useState(null);
  const [finnhubData, setFinnhubData] = useState(null);
  const [extras, setExtras] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [fullSymbol, setFullSymbol] = useState(""); // Full symbol with suffix needed for company news

  const [selectedMarket, setSelectedMarket] = useState(() => {  // Saves selected market

    const saved = localStorage.getItem("selectedMarket");
    return saved || "";
  });
  const handleMarketChange = (newMarket) => {  // Runs when market changes
    setSelectedMarket(newMarket);
    setSearchInput("");          // clears searchbar
    setSelectedSymbol("");       // clears the selected stock
    setFilteredResults([]);       // clears suggestions
  };
  
  const [isFullscreen, setIsFullscreen] = useState(false); // State to track fullscreen on/off
  const [comparedSymbols, setComparedSymbols] = useState([]); // Symbols to compare
  const [comparisonData, setComparisonData] = useState({}); // Stock data for each symbol

    {/* Fetch Stocks (First and Compared) */}
    useEffect(() => {
      if (!selectedSymbol) return;
    
      
      const full = selectedMarket === "US" ? selectedSymbol : `${selectedSymbol}.${selectedMarket}`;
      setFullSymbol(full); // fullsymbol for news

      let isCurrent = true;
    
      const fetchData = async () => {  // Fetches first stock
        console.time();
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/stock?symbol=${selectedSymbol}${selectedMarket}&range=${range}`);
          const stockdata = await res.json();
          const normalized = normalizeData(stockdata.records);
          if (!isCurrent || !normalized?.length) {
            setStocks([]);
            return;
          }
    
          const newComparisonData = {};  // Fetches compared stock
          for (const symbol of comparedSymbols) {
            const full = symbol.includes(".") ? symbol : `${symbol}${selectedMarket}`;
            const res = await fetch(`http://localhost:5000/api/stock?symbol=${full}&range=${range}`);
            const json = await res.json();
            const norm = normalizeData(json.records);
            if (!norm?.length) continue;
            newComparisonData[symbol] = norm;
          }

          setStocks(normalized);
          setStockinfo(stockdata.company);
          setExtras(stockdata.extras);
          setRecommendation(stockdata.recommendation);
          setComparisonData(newComparisonData);
    
        } catch (err) {
          console.error("Fetch error:", err);
          setStocks([]);
          setComparisonData({});
        } finally {
          setLoading(false);
          console.timeEnd();
        }
      };
    
      fetchData();
    
      return () => {
        isCurrent = false;
      };
    }, [range, selectedSymbol, selectedMarket, comparedSymbols]);

  const removeComparedSymbol = (symbol) => {
    setComparedSymbols((prev) => {
      const updated = prev.filter((s) => s !== symbol);
    
      // if removed symbol was selected, switch
      if (symbol === selectedSymbol && updated.length > 0) {
        setSelectedSymbol(updated[0]);
      }
    
      // if no symbols left, clear
      if (updated.length === 0) {
        setSelectedSymbol("");
      }
    
      return updated;
    });
    
    setComparisonData((prev) => {
      const updated = { ...prev };
      delete updated[symbol];
      return updated;
    });
  }; 


  {/* DARK MODE LOCAL STORAGE */}
  useEffect(() => {
    localStorage.setItem("darkMode", DarkMode.toString());
    document.documentElement.classList.toggle("dark", DarkMode); 
  }, [DarkMode]);

  {/* STOCK MARKET SELECTOR LOCAL STORAGE */}
  useEffect(() => {
    localStorage.setItem("selectedMarket", selectedMarket);
  }, [selectedMarket]);


  return (
    <div className="App">
    <div className={`${DarkMode ? 'dark' : ''} min-h-screen transition-colors duration-250 w-full overflow-x-hidden`}>

    {/* HEADER */}
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1d2228] shadow-md border-b border-gray-300 dark:border-gray-700">
      <div className="hidden lg:block text-xl font-bold text-emerald-500">
        Invest0iQ
      </div>

    <div className="flex gap-2 items-center">
      {/* Search Stocks Component */}
      <StockSearch
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        filteredResults={filteredResults}
        setFilteredResults={setFilteredResults}
        selectedMarket={selectedMarket}        // Change stockmarkets
        setSelectedMarket={setSelectedMarket}  
        onMarketChange={handleMarketChange}
        setComparedSymbols={setComparedSymbols}
        comparedSymbols={comparedSymbols}
      />
    </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end md:justify-end">
        <button
          onClick={() => setDarkMode(!DarkMode)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {DarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>

        {/* WATCHLIST DROPDOWN */}
          <WatchlistDropdown setSelectedSymbol={setSelectedSymbol} />
      </div>
    </div>


  <div className="bg-white dark:bg-[#1d2228] min-h-screen transition-colors duration-250 px-4">

  <div className="w-full px-4 lg:px-8 max-w-[1600px] mx-auto pt-7">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Left 2/3. Chart section. 2 cols */}
      <div className="lg:col-span-2 flex flex-col items-center">
        {/* MARKET SELECTOR */}
        <div className="flex justify-center md:justify-start items-center overflow-x-auto no-scrollbar gap-2 w-full px-2">
          <StockMarketSelector 
            selectedMarket={selectedMarket} 
            onMarketChange={(newMarket) => {
              setSelectedMarket(newMarket); 
              setSearchInput("");             // clears the input
              setSelectedSymbol("");          // clears symbols
              setFilteredResults([]);         // clears search results
              setShowModal(false);      // close modal on select
            }}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
        <div className="w-full max-w-[1100px] mx-auto bg-white dark:bg-[#232a31] rounded-lg shadow px-2 sm:px-4 py-4">
          <div className="p-1">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-[#232a31]/70 z-10 rounded-lg">
                <Loader className="animate-spin text-emerald-500 w-8 h-8" />
              </div>
            )}
            {selectedSymbol && stocks.length > 0 ? (
            <StockChart
              data={stocks}
              comparisonData={comparisonData}
              comparedSymbols={comparedSymbols}
              selectedSymbol={selectedSymbol}
              darkMode={DarkMode}
            />
          ) : (
            <p className="text-sm text-gray-500 p-4">Select a stock to view the chart.</p>
          )}
          </div>
        <div className="mt-8">
          <DateRangeSelector range={range} setRange={setRange} />
        </div>
          <div className="">
            <ComparedStocksPanel
              comparedSymbols={comparedSymbols}
              removeComparedSymbol={removeComparedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-center">
          <NewsPanel selectedStock={selectedSymbol} fullSymbol={`${selectedSymbol}${selectedMarket}`} />
        </div>
        
      </div>


      {/* Right-side. info panel. 1 Col */}
      <div className="flex flex-col gap-4 w-full items-center md:items-start place-self-center mt-[58px]">
        <div className="w-full max-w-[500px] lg:max-w-[560px] space-y-3">
        <div className="bg-white dark:bg-[#232a31] rounded-lg shadow p-4 text-center">
          <MiniDashboard stockdata={stocks} />
        </div>
        <div className="bg-white dark:bg-[#232a31] rounded-lg shadow p-4">
          {stockinfo && <CompanyOverview info={stockinfo} />}
        </div>
        <div className="bg-white dark:bg-[#232a31] rounded-lg shadow p-4">
          <RecommendationCard recommendation={recommendation} />
        </div>
        <div className="bg-white dark:bg-[#232a31] rounded-lg shadow p-4">
          <MiniInfoCard data={extras} />
        </div>
        </div>
      </div>
    </div>
  </div>


  </div>
    </div>
    </div>
  );
}

export default App;
