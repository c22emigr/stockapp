from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbol = request.args.get('symbol')
    period = request.args.get('range', '5d')  # default to 5d
    stock = yf.Ticker(symbol)
    info = stock.info
    long_name = info.get("longName", symbol.upper())  # fallback if not found

    if isinstance(symbol, tuple):
        symbol = symbol[0]
    if not symbol:
        return jsonify({'error': 'No symbol provided'}), 400
    

    dateinterval = {
        '1d' : '15m',
        '5d' : '30m',
        '1mo' : '1h',
        '6mo' : '1d',
        '1y' : '1d',
        'max' : '1wk'
    }
    interval = dateinterval.get(period, '1d')

    companyoverview = {
        "summary" : info.get("longBusinessSummary"),
        "sector" : info.get("sector"),
        "industry" : info.get("industry"),
        "website" : info.get("website"),
        "employees" : info.get("fullTimeEmployees"),
        "marketCap" : info.get("marketCap"),
    }

    try:
        data = yf.download(symbol, period=period, interval=interval)
        if data.empty:
            return jsonify({'error': f'No data found for {symbol}'}), 404
            
        data.columns = [col[0] if isinstance(col, tuple) else col for col in data.columns]
        data.reset_index(inplace=True)

        if 'Datetime' in data.columns:
            data.rename(columns={'Datetime' : 'Date'}, inplace=True)
        
        if 'Close' in data.columns:
                data['Pct_Change'] = data['Close'].pct_change().fillna(0).mul(100).round(2)
                
        else:
                data['Pct_Change'] = 0

        records = data.to_dict(orient='records')

        for row in records:
            row['symbol'] = symbol # gets symbol
            row['stockname'] = symbol.upper()
            row['stockname'] = long_name
            if 'Date' in row:
                row['Date'] = row['Date'].strftime('%Y-%m-%d %H:%M')

        return jsonify({
            "records": records,
            "company": companyoverview
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)