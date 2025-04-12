from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbol = request.args.get('symbol')
    if isinstance(symbol, tuple):
        symbol = symbol[0]
    if not symbol:
        return jsonify({'error': 'No symbol provided'}), 400

    try:
        data = yf.download(symbol, period='30d', interval='1d')
        if data.empty:
            return jsonify({'error': f'No data found for {symbol}'}), 404
            
        data.columns = [col[0] if isinstance(col, tuple) else col for col in data.columns]
        data.reset_index(inplace=True)

        records = data.to_dict(orient='records')
        for row in records:
            row['stockname'] = symbol.upper()
            
            if 'Date' in row:
                row['Date'] = str(row['Date'])  

        return jsonify(records)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)