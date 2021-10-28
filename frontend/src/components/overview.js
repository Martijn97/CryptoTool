import React, { useState, useEffect, useContext } from "react";
import { JSONPath } from "jsonpath-plus";
import { Card, CardContent, CardMedia, Typography, Grid, Button } from "@material-ui/core";
import CoinSelector from './coinSelect.js'
import CoinInfoModal from "./coinInfo.js";
import MovingAverageInfo from "./movingAverageInfo.js";
import PatternInfoModal from "./patternInfo"
import ObvInfoDialog from "./obvInfoDialog.js";
import TrendlineInfoDialog from "./trendlineInfoDialog.js";
import { AppContext } from '../context/AppContext';
import axios from "axios";

/*
This components returns a grid of cards with different cryptocoins. 
The value of each coin is displayed and can be set to different currencies.
*/
const OverviewPage = (props) => {
  // Retrieve the currency from the currency json
  const currency = props.currency;

  // useState for the logo and the value of the coins
  const [coin_info, setInfo] = useState([{}]);
  const [coin_value, setValue] = useState([{}]);
  const [coinClicked, setCoinClicked] = useState();
  const [random, setRandom] = useState(Math.random());

  // Global states from the context
  const {
    coinManagerOpen,
    setCoinManagerOpen,
    infoModalOpen,
    setInfoModalOpen,
    coinList,
    setCoinList,
    patternInfoModalOpen,
    setPatternInfoModalOpen,
    movingAverageInfoShown, 
    setMovingAverageInfoShown,
    obvInfoShown, 
    setObvInfoShown,
    trendlineInfoShown, 
    setTrendlineInfoShown,
    offline,
  } = useContext(AppContext);

  // Repsponsible for rendering
  useEffect(() => {
    reFetch(coinList, offline);
  }, [props.refresh, random, coinList, setCoinList, offline]);

  // Retrieves the data of the overview page
  async function reFetch(coinList, offline) {
    axios
      .get("/coin_info_list", {
        params: {
          coins: coinList,
          offline: offline,
        },
        type: "GET",
      })
      .then((data) => {
        setInfo(data);
      });
    axios
      .get("/current_value_list", {
        params: {
          coins: coinList,
          offline: offline,
        },
        type: "GET",
      })
      .then((data) => {
        setValue(data.data);
      });
  }

  // Slice the description data from the data returned from the API
  const description_coin = JSONPath({
    path: "$.[" + coinClicked + "].[description].*",
    json: coin_info,
  });

  // Function to remove a coin from coinList
  // when the remove button is used
  function onRemoveCoin(coin_name) {
    const index = coinList.indexOf(coin_name);

    coinList.splice(index, 1);
    setCoinList(coinList);
    setRandom(Math.random());
  }

  const currencyTable = (coin_value, coin_info) => {
    // Return the name of the cryptocurrencies
    const result_name = JSONPath({ path: "$.*~", json: coin_value });

    const crypto_coins = result_name.map((__, i) => {
      // Return value and logo of the cryptocurrencies
      const result = JSONPath({
        path: "$.[" + result_name[i] + "].*",
        json: coin_value,
      });
      const logo = JSONPath({
        path: "$.[" + result_name[i] + "].[image].*",
        json: coin_info,
      });

      // This if statement cancels the card if the coin is not included in coinList
      // but it is returned by the API call. Often, this only occurs if the tool is
      // in offline mode.
      if (!coinList.includes(result_name[i])) {
        return (null);
      }

      // Returns a single card for a crypto coin with its information.
      return (
        <Grid item xs={6}>
          <Card variant="outlined">
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <CardContent>
                  <Typography color="textSecondary">Coin</Typography>
                  <Typography variant="h4" component="h2">
                    {result_name[i]}
                  </Typography>
                  <Typography color="textSecondary">value:</Typography>
                  <Typography variant="h6" component="h2">
                    {currency === "Euro"
                      ? "€ " + result[0]
                      : currency === "USD"
                      ? "$ " + result[2]
                      : "£ " + result[1]}
                  </Typography>
                  <Button
                    variant="contained"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      setInfoModalOpen(true);
                      setCoinClicked(result_name[i]);
                    }}
                  >
                    More info
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ marginTop: "10px", marginLeft: "10px" }}
                    onClick={() => {
                      onRemoveCoin(result_name[i]);
                    }}
                  >
                    Remove coin
                  </Button>
                </CardContent>
              </Grid>
              <Grid item xs={3} justifyContent="center" alignItems="center">
                <CardMedia
                  component="img"
                  alt="logo"
                  width="50"
                  image={logo[0]}
                  title="Logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      );
    });

    // Function combines multiple cards into rows to render
    const createTable = (crypto_coins) => {
      const keys = [...Array(5).keys()];

      const row = keys.map((numb) => {
        return (
          <Grid container spacing={3}>
            {crypto_coins[numb * 3 + 0]}
            {crypto_coins[numb * 3 + 1]}
            {crypto_coins[numb * 3 + 2]}
          </Grid>
        );
      });

      return row;
    };

    return createTable(crypto_coins);
  };

  return (
    <>
      {currencyTable(coin_value, coin_info)}
      <CoinSelector
        coinManagerOpen={coinManagerOpen}
        onCloseCoinManager={() => setCoinManagerOpen(false)}
      />
      <CoinInfoModal
        infoModalOpen={infoModalOpen}
        onCloseInfoModel={() => setInfoModalOpen(false)}
        data={description_coin}
      />
      <PatternInfoModal
        patternInfoModalOpen={patternInfoModalOpen}
        onClosePatternInfoModal={() => setPatternInfoModalOpen(false)}
      />
      <MovingAverageInfo 
        movingAverageInfoOpen={movingAverageInfoShown}
        onClosemovingAverageInfo={() => setMovingAverageInfoShown(false)}
      />
      <ObvInfoDialog 
        obvInfoDialogOpen={obvInfoShown}
        onCloseObvInfoDialog={() => setObvInfoShown(false)}
      />
      <TrendlineInfoDialog 
        trendlineInfoDialogOpen={trendlineInfoShown}
        onCloseTrendlineInfoDialog={() => setTrendlineInfoShown(false)}
      />
    </>
  );
};

export default OverviewPage;