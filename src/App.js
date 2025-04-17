import React, { useEffect, useState } from 'react';
import './index.css';
import usStocks from './data/us_stocks.json';


function App() {
  const [search, setSearch] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [stockname, setStockname] = useState('');
  const [stockinfo, setStockinfo] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [DarkMode, setDarkMode] = useState(false);
  const [range, setRange] = useState("5d");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/stock?symbol=${stockname}&range=${range}`);
      const stockdata = await res.json();

    if (stockdata.error) {
      console.error("API error:", stockdata.error);
      return;

    }
    
    setStockinfo(stockdata);
    setStocks(stockdata);
  } catch (err) {
    console.error("Fetch error:", err);
  }
  };



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
      <div>

      <div className="flex gap-2 justify-center mt-4 flex-wrap">
        {["1d", "5d", "1mo", "6mo", "1y", "max"].map((r) => (
          <button
            key={r}
            type="button"
            className={`px-3 py-1 border rounded-md text-sm ${
              range === r ? "bg-emerald-400 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

        <form className="flex justify-center mb-7 p-2" id="searchform" onSubmit={handleSearch}>
          <div>
            <div className="form">
              <input               // Search input
                type="text"
                value={stockname}
                id="stocksearch"
                className='bg-gray-200 dark:bg-gray-700 p-2 rounded border border-s-gray-300'

                onChange={(e) => {  // Fluffy search from user input
                  const userInput = e.target.value;
                  setStockname(userInput);

                  if (userInput.length > 0) {
                    const matches = usStocks.filter(stock =>
                      stock.name.toLowerCase().includes(userInput.toLowerCase())
                    );
                    setFilteredResults(matches);
                  } else {
                    setFilteredResults([]);
                  }
                
                  }
                }
                placeholder="Enter company name"
              />

              {filteredResults.length > 0 && (  // Suggested results
                <ul className="">
                {filteredResults.map((stock, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStockname(stock.symbol);
                      setFilteredResults([]);
                    }}
                  >
                    {stock.name} <span className="text-gray-400">({stock.symbol})</span>
                  </li>
                ))}
              </ul>
              )}

              <button type="submit" id="stocksearchbutton"
              className='ml-7 border bg-gray-200 rounded border border-s-gray-300 p-1 dark:bg-gray-700 dark:text-gray-300'>Search</button>
            </div>
          </div>
        </form>
      </div>


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
                <td colSpan="7">No results yet</td>
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
