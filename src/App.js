import React, { useEffect, useState } from 'react';
import './index.css';
import usStocks from './data/us_stocks.json';


function App() {
  const [search, setSearch] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [stockname, setStockname] = useState('');
  const [stockinfo, setStockinfo] = useState(null);



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
              <input
                type="text"
                value={stockname}
                id="stocksearch"
                onChange={(e) => setStockname(e.target.value)}
                placeholder="Enter stock symbol (TSLA, AAPL)"
              />
              <button type="submit" id="stocksearchbutton">Search</button>
            </div>
          </div>
        </form>
      </div>

      {/* Graf skrivs ut här */}
      {imageBase64 && (
        <div className="flex justify-center">
          <img src={imageBase64} alt="price history" className="pricehistory" />
        </div>
      )}

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
