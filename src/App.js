import React, { useEffect, useState } from 'react';
import './index.css';
import usStocks from './data/us_stocks.json';
import StockChart from './components/StockChart';
import { ResponsiveContainer } from 'recharts';
import StockSearch from './components/StockSearch';


function App() {
  const [search, setSearch] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [stockname, setStockname] = useState('');
  const [stockinfo, setStockinfo] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [DarkMode, setDarkMode] = useState(false);
  const [range, setRange] = useState("5d");

  {/* Fetch Stocks */}
  useEffect(() => {
  
  if (!stockname) return; // No stockname no fetch

  const fetchData = async () => {

    try {
      const res = await fetch(`http://localhost:5000/api/stock?symbol=${stockname}&range=${range}`);
      const stockdata = await res.json();

    if (stockdata.error) {
      console.error("API error:", stockdata.error);
      return;
    }
    
    setStockinfo(stockdata);
    setStocks(stockdata);
    }catch (err) {
    console.error("Fetch error:", err);
    }
  };

  fetchData();
}, [range, stockname]);


  return (
    <div className="App">
    <div className={`${DarkMode ? 'dark' : ''} min-h-screen`}>
    <div className="bg-white dark:bg-gray-900 p-2 rounded min-h-screen">
        <div>
          <img src="" alt="" className="svg" />
        </div>
      
      <button
        onClick={() => setDarkMode(!DarkMode)}                      // Darkmode button
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
      >
        {DarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>


      <div className="flex justify-center">
        <h1>Invest0iQ</h1>
      </div>

      {/* Search Stocks Component */}
      <StockSearch
        stockname={stockname}
        setStockname={setStockname}
        range={range}
        setRange={setRange}
        filteredResults={filteredResults}
        setFilteredResults={setFilteredResults}
      />

      {/* GRAPHS */}
      <div className='flex justify-center'> 
      {stocks.length > 0 && (
            <div className='w-full px-80'>
              <ResponsiveContainer width="100%" height={400}>
              <StockChart data={stocks}/>
              </ResponsiveContainer>
            </div>
        )}
      </div>

      {/* STOCKS DISPLAYED */}
      <div className="flex justify-center">
        <table>
          <thead>
            <tr className="pad">
              <th>Datetime</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody className="">
            {stocks.length > 0 ? (
              stocks.map((stock, index) => (
                <tr key={index} className="pad">
                  <td>{stock.Date}</td>
                  <td>{parseFloat(stock.Open).toFixed(2)}</td>
                  <td>{parseFloat(stock.High).toFixed(2)}</td>
                  <td>{parseFloat(stock.Low).toFixed(2)}</td>
                  <td>{parseFloat(stock.Close).toFixed(2)}</td>
                  <td>{stock.Volume}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No results yet ✨</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
}

export default App;
