from flask import Flask
from pycoingecko import CoinGeckoAPI
from flask import request
from flask import jsonify
import json

app = Flask(__name__)

# Load the cryptocurrency data from the API
crypto_data = CoinGeckoAPI()

# Retrieves the current values of the cryptocoins in coinsList
@app.route("/current_value_list")
def coin_value_list():
    coins = request.args.getlist('coins[]')
    offline = request.args.get('offline')

    # in offline mode, the data is returned from a json file stored locally
    if (offline == 'true'):
        current_value_list = json.load(open('./offline_data/current_value_list.json', 'r'))
        return current_value_list

    total = ""

    for item in coins:
        total = total + item + ","

    if (len(coins) > 0):
        data_value = crypto_data.get_price(ids=total, vs_currencies=['usd', 'eur', 'gbp'])
        return data_value

# Retrieve the OHLC and volume data of the list of coins selected in the tool
@app.route("/OHLC_data")
def ohlc_data():
    coins = request.args.getlist('coins[]')
    days = request.args.get('days')
    offline = request.args.get('offline')

    # in offline mode, the data is returned from a json file stored locally
    if (offline == 'true'):
        OHLC_data = json.load(open('./offline_data/OHLC_data_' + days + '.json', 'r'))
        return OHLC_data
    
    currencies=['usd', 'eur','gbp']

    # Empty objects for the ohlc, ohlc year and volume data
    all_ohlc_data = {}
    all_ohlc_data_year = {}
    all_volume_data = {}

    # Empty object to add the data of the specific currencies
    ohlc_data_coin_currencies = {}
    ohlc_data_year_coin_currencies = {}
    volume_data_coin_currencies = {}

    # Loop that adds for all the coins and for each currency the specific data to the variables
    for coin in coins:
        for currency in currencies:
            ohlc_data_coin = {currency: crypto_data.get_coin_ohlc_by_id(id=coin, vs_currency=currency, days=days)}
            ohlc_data_coin_year = {currency: crypto_data.get_coin_ohlc_by_id(id=coin, vs_currency=currency, days=365)}
            volume_data_coin = {currency: crypto_data.get_coin_market_chart_by_id(id=coin, vs_currency=currency, days=days)["total_volumes"]}

            ohlc_data_coin_currencies.update(ohlc_data_coin)
            ohlc_data_year_coin_currencies.update(ohlc_data_coin_year)
            volume_data_coin_currencies.update(volume_data_coin)
            
        ohlc_data_coins_currency = {coin: ohlc_data_coin_currencies}
        ohlc_data_year_coins_currency = {coin: ohlc_data_year_coin_currencies}
        volume_data_coin_currency = {coin: volume_data_coin_currencies}
        ohlc_data_coin_currencies = {}
        ohlc_data_year_coin_currencies = {}
        volume_data_coin_currencies = {}

        all_ohlc_data.update(ohlc_data_coins_currency)
        all_ohlc_data_year.update(ohlc_data_year_coins_currency)
        all_volume_data.update(volume_data_coin_currency)

    # Return the data in a specific format
    return {'ohlc': all_ohlc_data, 'ohlc_year': all_ohlc_data_year, 'volume': all_volume_data}


# Retrieves the information of the coins in coinsList
@app.route("/coin_info_list")
def coin_logo_list():
    coins = request.args.getlist('coins[]')
    offline = request.args.get('offline')

    # in offline mode, the data is returned from a json file stored locally
    if (offline == 'true'):
        coin_info_list = json.load(open('./offline_data/coin_info_list.json', 'r'))
        return coin_info_list 

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
    offline = request.args.get('offline')

    # in offline mode, the data is returned from a json file stored locally
    if (offline == 'true'):
        coin_selection_data = json.load(open('./offline_data/coin_selection_data.json', 'r'))
        return jsonify(coin_selection_data) 

    data_coin_selection = crypto_data.get_coins_markets(vs_currency='eur')

    return jsonify(data_coin_selection)

# Retrieves the status of the CoinGeckoAPI
@app.route("/status")
def status_API():
    status_data = crypto_data.ping()
    return status_data

if __name__ == "__main__":
    app.run(debug=True)