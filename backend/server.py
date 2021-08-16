from flask import Flask
from pycoingecko import CoinGeckoAPI
from flask import request

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

# Retrieves the logo's of the coins in coinsList
@app.route("/coin_logo_list")
def coin_logo_list():
    coins = request.args.getlist('coins[]')

    if (len(coins) > 0):
        data_logo = crypto_data.get_price(ids='', vs_currencies=['usd', 'eur','gbp'])
        
        # for each coin in the coins array, query the logo's
        for coin in coins:
            data_coin = {coin: crypto_data.get_coin_by_id(id=coin)['image']}
            data_logo.update(data_coin)

        return data_logo

# Retrieves the status of the CoinGeckoAPI
@app.route("/status")
def status_API():
    status_data = crypto_data.ping()
    return status_data

if __name__ == "__main__":
    app.run(debug=True)