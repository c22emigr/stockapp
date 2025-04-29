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
    if (saved !== null) return saved === "true";
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
  const [comparisonData, setComparisonData] = useState([]); // Stock data for each symbol
  useEffect(() => {  // fetches and stores data for compared stocks
    if (comparedSymbols.length === 0) return;
  
    comparedSymbols.forEach(async (symbol) => {
      if (symbol === selectedSymbol) return;

      try {
        const res = await fetch(`http://localhost:5000/api/stock?symbol=${symbol}&range=${range}`);
        const data = await res.json();
  
        setComparisonData(prev => ({
          ...prev,
          [symbol]: data.records,
        }));
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
      }
    });
  }, [comparedSymbols, range, selectedSymbol]);
  
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
    localStorage.setItem("darkMode", DarkMode);
    document.documentElement.classList.toggle("dark", DarkMode); 
  }, [DarkMode]);

  {/* STOCK MARKET SELECTOR LOCAL STORAGE */}
  useEffect(() => {
    localStorage.setItem("selectedMarket", selectedMarket);
  }, [selectedMarket]);


  {/* Fetch Stocks */}
  useEffect(() => {
  
  if (!selectedSymbol) return; // No stockname no fetch

  const fetchData = async () => {

    try {
      const res = await fetch(`http://localhost:5000/api/stock?symbol=${selectedSymbol}${selectedMarket}&range=${range}`);
      const stockdata = await res.json();

    if (stockdata.error) {
      console.error("API error:", stockdata.error);
      return;
    }
    
    setStockinfo(stockdata.company);
    setStocks(stockdata.records);
    setExtras(stockdata.extras)

    // For FINNHUB
    setRecommendation(stockdata.recommendation);
    }catch (err) {
    console.error("Fetch error:", err);
    }
  };

  fetchData();
}, [range, selectedSymbol, selectedMarket]);


  return (
    <div className="App">
    <div className={`${DarkMode ? 'dark' : ''} min-h-screen transition-colors duration-250`}>

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

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!DarkMode)}                   
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
        >
          {DarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* WATCHLIST DROPDOWN */}
        <WatchlistDropdown setSelectedSymbol={setSelectedSymbol} />
      </div>
    </div>


    <div className="bg-white dark:bg-[#1d2228] p-2 min-h-screen transition-colors duration-250">

    {/* MINIDASHBOARD + STOCKCHART */} 
    <div className="flex justify-center">
      <div className="flex flex-col lg:flex-row items-start justify-start gap-6 mt-7">
        <div className="self-start">
          <MiniDashboard stockdata={stocks} />
          {stockinfo && <CompanyOverview info={stockinfo} />}
        </div>

          <div className='w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl pl-4 self-start'>
          {stocks.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
                <StockChart data={stocks} comparisonData={comparisonData} selectedSymbol={selectedSymbol }/>
            </ResponsiveContainer>
          )}
          {/* DATE RANGE SELECTOR */}
          <DateRangeSelector
            range={range}
            setRange={setRange}
          />
          
          <ComparedStocksPanel
            comparedSymbols={comparedSymbols}
            removeComparedSymbol={removeComparedSymbol}
          />
          </div>

           {/* SIDE CARDS */}
        <div className="flex flex-col gap-4 w-fit">
          <RecommendationCard recommendation={recommendation} />
           <MiniInfoCard data={extras} />
        </div>
      </div>
    </div>

    </div>
    </div>
    </div>
  );
}

export default App;
