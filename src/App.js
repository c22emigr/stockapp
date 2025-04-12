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


  const handleSearch = async (e) => {
    e.preventDefault();

    try {
    const res = await fetch(`http://localhost:5000/api/stock?symbol=${stockname}`);
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
      <div>
        <img src="" alt="" className="svg" />
      </div>

      <div className="flex justify-center text-3xl font-bold m-8">
        <h1>Invest0iQ</h1>
      </div>
      <div>
        <form className="flex justify-center" id="searchform" onSubmit={handleSearch}>
          <div>
            <h2 className="flex justify-center">Browse stocks</h2>

            <div className="form">
              <input               // Search input
                type="text"
                value={stockname}
                id="stocksearch"

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
                <ul className="bg-white border border-gray-300 rounded mt-2 max-w-md mx-auto shadow">
                {filteredResults.map((stock, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setStockname(stock.symbol);
                      setFilteredResults([]);
                    }}
                  >
                    {stock.name} <span className="text-gray-500">({stock.symbol})</span>
                  </li>
                ))}
              </ul>
              )}

              <button type="submit" id="stocksearchbutton">Search</button>
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
                  <td>{stock.Open}</td>
                  <td>{stock.High}</td>
                  <td>{stock.Low}</td>
                  <td>{stock.Close}</td>
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
  );
}

export default App;
