from flask import Flask
from pycoingecko import CoinGeckoAPI
from requests import NullHandler

app = Flask(__name__)

# Load the cryptocurrency data from the API
crypto_data = CoinGeckoAPI()

crypto = ['bitcoin','litecoin','ethereum','stellar','ripple','binancecoin','cardano','airight','dogecoin','uniswap','solana','filecoin','falopa','lumeneo','sushi','dash']

@app.route("/current_value")
def coin_value():
    data_value = crypto_data.get_price(ids='bitcoin,litecoin,ethereum,stellar,ripple,binancecoin,cardano,airight,dogecoin,uniswap,solana,filecoin,falopa,lumeneo,sushi,dash', 
    vs_currencies=['usd', 'eur', 'gbp'])
    return data_value

@app.route("/coin_logo")
def coin_logo():
    data_logo = crypto_data.get_price(ids='', vs_currencies=['usd', 'eur','gbp'])

    for coin in crypto:
        data_coin = {coin: crypto_data.get_coin_by_id(id=coin)['image']}
        data_logo.update(data_coin)

    return data_logo

@app.route("/status")
def status_API():
    status_data = crypto_data.ping()
    return status_data

if __name__ == "__main__":
    app.run(debug=True)