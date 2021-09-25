import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import axios from "axios";
import { JSONPath } from "jsonpath-plus";
import { CanvasJSChart } from "canvasjs-react-charts";
import moment from "moment";

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

        // Slice the data in a certain currency of a specific coin from the entire dataset
      const ohlc_values_coin = JSONPath({
        path: "$.[" + name + "].[" + current_currency() + "].*",
        json: ohlc,
      });

      // The function converts the data into the right input for the Candlestick chart
      const chartData = (ohlc_values_coin) => {
        const data = [];
        ohlc_values_coin.map((i) => {
          return data.push({
            x: new Date(moment(i[0]).format("YYYY-MM-DD HH:mm:ss")),
            y: [i[1], i[2], i[3], i[4]],
          });
        });

        return data;
      };

      // The Candlestick chart
      const chart = () => {
        const options = {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: false,
          zoomEnabled: true,
          title: {
            text: "",
          },
          axisX: {
            valueFormatString: "DD-MM-YYYY",
          },
          axisY: {
            includeZero: false,
            prefix:
              props.currency === "Euro"
                ? "€ "
                : props.currency === "USD"
                ? "$ "
                : "£ ",
          },
          data: [
            {
              type: "candlestick",
              showInLegend: false,
              name: name,
              risingColor: "#4ca64c",
              fallingColor: "#ff4c4c",
              yValueFormatString: "$###0.00",
              xValueFormatString: "DD MM YY",
              dataPoints: chartData(ohlc_values_coin),
            },
          ],
        };

        // Return the CanvasJS Candlestick chart.
        return <CanvasJSChart options={options} />;
      };

      return (
        <Grid item xs={18} style={{ marginTop: "10px" }}>
          <Card variant="outlined">
            <Grid container justifyContent="left" style={{ margin: "30px" }}>
              <Grid item xs={12}>
                <CardContent>
                  <Typography variant="h4" component="h2">
                    {/*name of the coin*/}
                    {capitalizeFirstLetter(name)} 
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={8} justifyContent="center" alignItems="center">
                {/*Calls the function to render the Candlestick chart*/}
                <div>{chart()}</div>
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
