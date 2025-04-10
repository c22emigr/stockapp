import yfinance as yf           # Obs 15 min delay
import flask as Flask, jsonify
import pandas as pd
import matplotlib.pyplot as plt
import io

app = Flask(__name__)

@app.route('/api/graph/<name>')
def get_stock_graph(stockname):
    data = yf.download(stockname, period="30d", interval="1d")

    # Plot the closing prices
    data['Close'].plot(title=f"{stockname} - Closing Prices (Last 30 Days)")
    fig, ax = plt.subplots()
    data['Close'].plot(ax=ax, title=f"{stockname} Closing Price")
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)


    return send_file(buf, mimetype='image/png')




