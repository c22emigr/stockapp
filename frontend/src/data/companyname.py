import json
import time
import requests

FINNHUB_API_KEY = 'd04kqcpr01qspgm3lpqgd04kqcpr01qspgm3lpr0'

def get_company_name(symbol):
    url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={FINNHUB_API_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get('name') or symbol
        else:
            print(f"Error {response.status_code} for {symbol}")
            return symbol
    except Exception as e:
        print(f"Request failed for {symbol}: {e}")
        return symbol

def update_names(data, sleep_seconds=1):
    updated = []
    for idx, stock in enumerate(data):
        symbol = stock["symbol"]
        new_name = get_company_name(symbol)
        stock["name"] = new_name  # <-- Just update name

        updated.append(stock)

        print(f"[{idx+1}/{len(data)}] {symbol} -> {new_name}")

        time.sleep(sleep_seconds)

    return updated

# --- MAIN ---

with open('src/data/formatted_stocks.json') as f:
    stocks = json.load(f)

updated_stocks = update_names(stocks)

with open('src/data/formatted_stocks_with_real_names.json', 'w') as f:
    json.dump(updated_stocks, f, indent=2)

print(f"✅ Done updating {len(updated_stocks)} stocks!")
