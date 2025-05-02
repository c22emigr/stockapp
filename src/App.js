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

  const [comparedSymbols, setComparedSymbols] = useState([]); // Symbols to compare
  const [comparisonData, setComparisonData] = useState({}); // Stock data for each symbol

    {/* Fetch Stocks (First and Compared) */}
    useEffect(() => {
      if (!selectedSymbol) return;
    
      let isCurrent = true;
    
      const fetchData = async () => {  // Fetches first stock
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
        }
      };
    
      fetchData();
    
      return () => {
        isCurrent = false;
      };
    }, [range, selectedSymbol, selectedMarket, comparedSymbols]);

  const removeComparedSymbol = (symbol) => {  // Handle removing comparison symbols
    setComparedSymbols(prev => prev.filter(s => s !== symbol));
    setComparisonData(prev => {
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
      <div className="text-xl font-bold text-emerald-500">
        Invest0iQ
      </div>

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

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end md:justify-end">
        <button
          onClick={() => setDarkMode(!DarkMode)}                   
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg"
        >
          {DarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* WATCHLIST DROPDOWN */}
          <WatchlistDropdown setSelectedSymbol={setSelectedSymbol} />
      </div>
    </div>


  <div className="bg-white dark:bg-[#1d2228] min-h-screen transition-colors duration-250 px-4">

  <div className="w-full px-4 lg:px-8 max-w-[1600px] mx-auto pt-7">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Chart section. Spans 2 columns */}
      <div className="lg:col-span-2 flex flex-col items-center">
        <div className="w-full gap-4 max-w-[1100px] mx-auto bg-white dark:bg-[#232a31] rounded-lg shadow p-4">
          <div className="p-4">
          <StockChart
            data={stocks}
            comparisonData={comparisonData}
            comparedSymbols={comparedSymbols}
            selectedSymbol={selectedSymbol}
            darkMode={DarkMode}
          />
          </div>
        <div className="">
          <DateRangeSelector range={range} setRange={setRange} />
          <ComparedStocksPanel
            comparedSymbols={comparedSymbols}
            removeComparedSymbol={removeComparedSymbol}
            setSelectedSymbol={setSelectedSymbol}
          />
        </div>
        </div>
      </div>

      {/* Right-side info panel. 1 Col */}
      <div className="flex flex-col gap-4 w-full items-center md:items-start place-self-center">
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
