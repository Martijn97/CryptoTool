import React, { useState, useEffect, useContext } from "react";
import { JSONPath } from "jsonpath-plus";
import { Card, CardContent, CardMedia, Typography, Grid, Button } from "@material-ui/core";
import CoinSelector from './coinSelect.js'
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
  const [coin_logo, setLogo] = useState([{}]);
  const [coin_value, setValue] = useState([{}]);
  const [random, setRandom] = useState(Math.random());

  // Global states from the context
  const { coinManagerOpen, setCoinManagerOpen, coinList, setCoinList } =
    useContext(AppContext);

  // Repsponsible for rendering
  useEffect(() => {
    reFetch(coinList);
  }, [props.refresh, random, coinList, setCoinList]);

  // Retrieves the data of the overview page
  async function reFetch(coinList) {
    axios
      .get("/coin_logo_list", {
        params: {
          coins: coinList,
        },
        type: "GET",
      })
      .then((data) => {
        setLogo(data);
      });
    axios
      .get("/current_value_list", {
        params: {
          coins: coinList,
        },
        type: "GET",
      })
      .then((data) => {
        setValue(data.data);
      });
  }

  // Function that makes the string start with a capital letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const currencyTable = (coin_value, coin_logo) => {
    // Return the name of the cryptocurrencies
    const result_name = JSONPath({ path: "$.*~", json: coin_value });

    const crypto_coins = result_name.map((__, i) => {
      // Return value and logo of the cryptocurrencies
      const result = JSONPath({
        path: "$.[" + result_name[i] + "].*",
        json: coin_value,
      });
      const logo = JSONPath({
        path: "$.[" + result_name[i] + "].*",
        json: coin_logo,
      });

      // Returns a single card for a crypto coin with its information.
      return (
        <Grid item xs={4}>
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
                    {capitalizeFirstLetter(result_name[i])}
                  </Typography>
                  <Typography color="textSecondary">value:</Typography>
                  <Typography variant="h6" component="h2">
                    {currency === "Euro"
                      ? "€ " + result[0]
                      : currency === "USD"
                      ? "$ " + result[1]
                      : "£ " + result[2]}
                  </Typography>
                  <Button variant="contained" style={{ marginTop: "10px" }}>
                    More info
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
            {crypto_coins[numb * 4 + 0]}
            {crypto_coins[numb * 4 + 1]}
            {crypto_coins[numb * 4 + 2]}
            {crypto_coins[numb * 4 + 3]}
          </Grid>
        );
      });

      return row;
    };

    return createTable(crypto_coins);
  };

  return (
    <>
      {currencyTable(coin_value, coin_logo)}
      <CoinSelector
        coinManagerOpen={coinManagerOpen}
        onCloseCoinManager={() => setCoinManagerOpen(false)}
      />
    </>
  );
};

export default OverviewPage;