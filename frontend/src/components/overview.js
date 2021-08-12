import React, { useState, useEffect } from "react";
import { JSONPath } from "jsonpath-plus";
import { Card, CardContent, CardMedia, Typography, Grid } from "@material-ui/core";

/*
This components returns a grid of cards with different cryptocoins. 
The value of each coin is displayed and can be set to different currencies.
*/
const OverviewPage = (currency) => {
  // Retrieve the currency from the currency json
  currency = JSONPath({ path: "$.*", json: currency })[0];

  // useState for the logo and the value of the coins
  const [coin_logo, setLogo] = useState([{}]);
  const [coin_value, setValue] = useState([{}]);

    // Repsponsible for rendering
    useEffect(() => {
      reFetch();
    }, []);
  
    // Retrieves the data of the status of the API
    async function reFetch() {
        fetch("/current_value")
        .then((res) => res.json())
        .then((data) => {
          setValue(data);
        });
      fetch("/coin_logo")
        .then((res) => res.json())
        .then((data) => {
          setLogo(data);
        });
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
        <Grid item xs={3}>
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
                      ? "$ " + result[1]
                      : "£ " + result[2]}
                  </Typography>
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

  return <>{currencyTable(coin_value, coin_logo)}</>;
};

export default OverviewPage;