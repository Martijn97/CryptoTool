# CryptoTool

Tool to visualize and investigate crypto currencies. It uses the CoinGecko API to receive its data. The tool is made as part of a visualization master course at the Technical University of Eindhoven.

<img width="1792" alt="Screenshot 2021-10-24 at 19 23 00" src="https://user-images.githubusercontent.com/17745256/138605558-12da4b6d-2472-4403-8320-56338ea121f4.png">

The tool lets the user select one or two cryptocoins from a treemap. The treemap is based on the market cap of the coins. The colour shows if the price has increased or decreased in the last 24 hours.
<img width="962" alt="Screenshot 2021-10-24 at 19 23 40" src="https://user-images.githubusercontent.com/17745256/138605565-d0bb3de2-5bc2-4ee6-b845-79da4f327dce.png">

The tool lets the user use multiple technical analysis methods on the crypto coins. Methods like trendlines, simple moving average, cross-over moving average, ca
ndlestick patterns and the on-balance volume indicator are included. The data of the coins can be visualized in a candlestick chart and a volume chart.
<img width="1151" alt="Screenshot 2021-10-24 at 19 24 09" src="https://user-images.githubusercontent.com/17745256/138605782-95ffcf01-1d54-4647-9a95-c5911a0e3e8c.png"><img width="960" alt="Screenshot 2021-10-24 at 19 24 48" src="https://user-images.githubusercontent.com/17745256/138605798-15483bd8-d290-4e26-b171-e6b53b93977b.png">

The tool focuses on users with litle or no experience with investing. Therefore, the tool includes multiple dialogs with explanations about the possible methods.
<img width="961" alt="Screenshot 2021-10-24 at 19 25 08" src="https://user-images.githubusercontent.com/17745256/138605844-9cec705a-28f1-460f-a8a4-4ebf31a9d158.png">

**Backend: Python/Flask REST API**

1. `cd backend`
2. _Optional_: create a venv
3. Install pip dependencies `pip install Flask pycoingecko`
4. Run: `python3 server.py`

**Frontend: ReactJS Web Application**

1. `cd frontend`
2. Install dependencies: `npm install`
3. Run in development mode: `npm start`
