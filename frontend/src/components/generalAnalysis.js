import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import axios from "axios";
import VolumeChart from './volumeChart'
import CandlestickChart from "./candlestickChart";

/*
This components returns a grid of cards. In each card the Candlestick chart of a specific coin
is shown. The Chart has some interactions and is the start of the in depth analysis of coins.
*/
const GeneralAnalysisPage = (props) => {
  const { coinList } = useContext(AppContext);
  const [ohlc, setOHLC] = useState([{}]);

  // Repsponsible for rendering
  useEffect(() => {
    reFetch(coinList);
  }, [coinList, props.days]);

  // Function with the API calls
  async function reFetch(coinList) {
    axios
      .get("/OHLC_data", {
        params: {
          coins: coinList,
          days: props.days,
        },
        type: "GET",
      })
      .then((data) => {
        setOHLC(data.data);
      });
  }
  
  // Function that return the right currency parameter to use for querying the API
  function current_currency() {
    if (props.currency === "Euro") {
      return "eur";
    } else if (props.currency === "USD") {
      return "usd";
    } else {
      return "gbp";
    }
  }

  // Function that makes the string start with a capital letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // This renders the cards for each coin. It contains the Candlestick chart of the coin.
  const renderCoinCards = (ohlc) => {
    const renderCoinCard = coinList.map((name, i) => {
      return (
        <Grid item xs={18} style={{ marginTop: "10px" }}>
          <Card variant="outlined">
            <Grid container justifyContent="left" style={{ margin: "30px" }}>
              <Grid item xs={12}>
                <CardContent>
                  <Typography variant="h4" component="h2" style={{ marginLeft: "30px", marginTop: "10px" }}>
                    {/*name of the coin*/}
                    {capitalizeFirstLetter(name)}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                justifyContent="center"
                alignItems="center"
              >
                {/*Calls the function to render the Candlestick chart*/}
                <CandlestickChart name={name} ohlc={ohlc} currency={current_currency()} days={props.days}/>
              </Grid>
            </Grid>
            <Grid container justifyContent="left" style={{ margin: "30px" }}>
              <Grid
                item
                xs={12}
                md={9}
                justifyContent="center"
                alignItems="center"
              >
                {/*Calls the function to render the Volume chart*/}
                <VolumeChart name={name} ohlc={ohlc} currency={current_currency()}/>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      );
    });

    return renderCoinCard;
  };

  return renderCoinCards(ohlc);
};

export default GeneralAnalysisPage;
