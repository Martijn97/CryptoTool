import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import axios from "axios";
import { JSONPath } from "jsonpath-plus";
import { CanvasJSChart } from "canvasjs-react-charts";
import moment from "moment";

const GeneralAnalysisPage = (props) => {
  const { coinList } = useContext(AppContext);
  const [ohlc, setOHLC] = useState([{}]);

  // Repsponsible for rendering
  useEffect(() => {
    reFetch(coinList);
  }, [coinList, props.days]);

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

  function current_currency() {
    if (props.currency === 'Euro') {
        return 'eur';
    } else if (props.currency === 'USD') {
        return 'usd';
    } else {
        return 'gbp'
    }
}

  const renderCoinCards = (ohlc) => {
    const renderCoinCard = coinList.map((name, i) => {

      const ohlc_values_coin = JSONPath({
        path: "$.[" + name + "].[" + current_currency() + "].*",
        json: ohlc,
      });

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

      const chart = () => {
        const options = {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: false,
          title: {
            text: "",
          },
          axisX: {
            valueFormatString: "DD-MM-YY",
          },
          axisY: {
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

        return <CanvasJSChart options={options} />;
      };

      return (
        <Grid item xs={18} style={{ marginTop: "10px" }}>
          <Card variant="outlined">
            <Grid
              container
              justifyContent="left"
              style={{ margin: "30px" }}
            >
              <Grid item xs={12}>
                <CardContent>
                  <Typography variant="h4" component="h2">
                    {name}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={8} justifyContent="center" alignItems="center">
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
