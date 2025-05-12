from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os

if not os.environ.get("RENDER"):
    env_path = Path(__file__).resolve().parent / "backendsecrets" / ".env"
    load_dotenv(dotenv_path=env_path)

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")

FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'


def fetch_recommendation(symbol):
    url = f"{FINNHUB_BASE_URL}/stock/recommendation?symbol={symbol}&token={FINNHUB_API_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        if data:
            return data[0]  # latest one
    except Exception as e:
        print("Recommendation error:", e)
    return None

def fetch_sentiment(symbol):
    url = f"{FINNHUB_BASE_URL}/news-sentiment?symbol={symbol}&token={FINNHUB_API_KEY}"
    try:
        response = requests.get(url)
        return response.json()
    except Exception as e:
        print("Sentiment error:", e)
    return None

def fetch_news_by_category(category="general"):
    url = f"{FINNHUB_BASE_URL}/news?category={category}&token={FINNHUB_API_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        return data[:6]  # limit to 6 articles
    except Exception as e:
        print("News fetch error:", e)
    return []


app = Flask(__name__)
CORS(app)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbol = request.args.get('symbol')
    period = request.args.get('range', '5d')  # default to 5d

    stock = yf.Ticker(symbol)
    info = stock.info
    
    long_name = info.get("longName", symbol.upper())  # fallback if not found
    recommendation = fetch_recommendation(symbol)

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

    extra_stats = {
        "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
        "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
        "dividendYield": info.get("dividendYield"),
        "beta": info.get("beta")
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
            "company": companyoverview,
            "recommendation": recommendation, 
            "extras" : extra_stats
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/news/<symbol>')
def get_stock_news(symbol):
    clean_symbol = symbol.upper().split(":")[0].split(".")[0]

    from_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    to_date = datetime.now().strftime('%Y-%m-%d')
    url = f"https://finnhub.io/api/v1/company-news?symbol={clean_symbol}&from={from_date}&to={to_date}&token={FINNHUB_API_KEY}"

    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.RequestException as e:
        print(f"Error fetching stock news for {symbol}: {e}")
        return jsonify([]), 500
    
@app.route('/api/news')
def get_general_news():
    category = request.args.get("category", "general")
    url = f"https://finnhub.io/api/v1/news?category={category}&token={FINNHUB_API_KEY}"

    try:
        res = requests.get(url)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.RequestException as e:
        print(f"Error fetching general news: {e}")
        return jsonify([]), 500

if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000))
    )