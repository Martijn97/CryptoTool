from flask import Flask
from pycoingecko import CoinGeckoAPI
from flask import request
from flask import jsonify

app = Flask(__name__)

# Load the cryptocurrency data from the API
crypto_data = CoinGeckoAPI()

# Retrieves the current values of the cryptocoins in coinsList
@app.route("/current_value_list")
def coin_value_list():
    coins = request.args.getlist('coins[]')

    total = ""

    for item in coins:
        total = total + item + ","

    if (len(coins) > 0):
        data_value = crypto_data.get_price(ids=total, vs_currencies=['usd', 'eur', 'gbp'])
        return data_value

# Retrieve the OHLC data of the list of coins selected in the tool
@app.route("/OHLC_data")
def ohlc_data():
    coins = request.args.getlist('coins[]')
    days = request.args.get('days')
    currencies=['usd', 'eur','gbp']

    all_ohlc_data = {}
    ohlc_data_coin_currencies = {}

    for coin in coins:
        for currency in currencies:
            ohlc_data_coin = {currency: crypto_data.get_coin_ohlc_by_id(id=coin, vs_currency=currency, days=days)}
            ohlc_data_coin_currencies.update(ohlc_data_coin)
            
        ohlc_data_coins_currency = {coin: ohlc_data_coin_currencies}
        ohlc_data_coin_currencies = {}
        all_ohlc_data.update(ohlc_data_coins_currency)

    return all_ohlc_data


# Retrieves the information of the coins in coinsList
@app.route("/coin_info_list")
def coin_logo_list():
    coins = request.args.getlist('coins[]')

    if (len(coins) > 0):
        data_logo = crypto_data.get_price(ids='', vs_currencies=['usd', 'eur','gbp'])
        
        # for each coin in the coins array, query the logo's
        for coin in coins:
            data_coin = {coin: {"image": crypto_data.get_coin_by_id(id=coin)['image'], 
            "description": crypto_data.get_coin_by_id(id=coin)['description']}}
            data_logo.update(data_coin)

        return data_logo

# Retrieves the top-100 coins with highest market cap. Used for the coin selection treemap
@app.route('/coin_selection_data')
def get_coin_selection_data():
    data_coin_selection = crypto_data.get_coins_markets(vs_currency='eur')

    return jsonify(data_coin_selection)

# Retrieves the status of the CoinGeckoAPI
@app.route("/status")
def status_API():
    status_data = crypto_data.ping()
    return status_data

if __name__ == "__main__":
    app.run(debug=True)