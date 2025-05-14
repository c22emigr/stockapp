import json

with open('src/data/nasdaq_tickers.json') as f:
    symbols = json.load(f)

formatted = [
    {
        "name": symbol,    
        "symbol": symbol,
        "market": "US"
    }
    for symbol in symbols
]

with open('src/data/formatted_stocks.json', 'w') as f:
    f.write('[\n')
    for idx, stock in enumerate(formatted):
        json_object = json.dumps(stock, separators=(', ', ': '))
        if idx < len(formatted) - 1:
            f.write(f'{json_object},\n')
        else:
            f.write(f'{json_object}\n')
    f.write(']')

print(f"Done! {len(formatted)} stocks saved.")
