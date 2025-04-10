import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [stocks, setStocks] = useState([]);

  const StockSearch = (e) => {
    const [stockname, setStockname] = useState('');
    const [stockinfo, setStockinfo] = useState(null);



    const handleSearch = async (e) => {
      e.preventDefault();
      const res = await fetch('http://localhost:5000/api/stock?symbol=${stockname}');
      const stockdata = await res.json();
      setStockinfo(data);
    };
    
  };





  return (
    <div className="App">
      <div>
        <img src="" alt="" className="svg" />
      </div>

      <div className="centrera">
        <h1>Invest0iQ</h1>
      </div>

      <div>
        <form className="centrera" id="searchform" onSubmit={handleSearch}>
          <div>
            <h2>Browse stocks</h2>

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
        <div className="centrera">
          <img src={imageBase64} alt="price history" className="pricehistory" />
        </div>
      )}

      <div className="centrera">
        <table>
          <thead>
            <tr className="pad">
              <th>Stock name</th>
              <th>Datetime</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((stock, index) => (
                <tr key={index} className="pad">
                  <td>{stock.stockname}</td>
                  <td>{stock.datetime}</td>
                  <td>{stock.open}</td>
                  <td>{stock.high}</td>
                  <td>{stock.low}</td>
                  <td>{stock.close}</td>
                  <td>{stock.volume}</td>
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
