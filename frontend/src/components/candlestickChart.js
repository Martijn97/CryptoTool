import React, { useState } from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { Grid, Typography } from "@material-ui/core";
import { Box, Card, Button, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { JSONPath } from "jsonpath-plus";
import moment from "moment";

// The Candlestick chart
const CandlestickChart = (props) => {
  const name = props.name;
  const ohlc = props.ohlc;
  const currency = props.currency;

  // State that keeps track of the selected points for the trend line
  const [trendLineData, setTrendLineData] = useState([]);
  // State used to force a re-render of the page
  const [random, setRandom] = useState(Math.random());

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const ohlc_values_coin = JSONPath({
    path: "$.[ohlc].[" + name + "].[" + currency + "].*",
    json: ohlc,
  });

  // The function converts OHLC data into the right input for the Candlestick chart
  const candlestickChartData = (ohlc_values_coin) => {
    const data = [];
    ohlc_values_coin.map((i) => {
      return data.push({
        x: new Date(moment(i[0]).format("YYYY-MM-DD HH:mm:ss")),
        y: [i[1], i[2], i[3], i[4]],
      });
    });

    return data;
  };

  // Function returns the data to plot the trend line
  const trendLineChartData = (trendLineData) => {
    if (trendLineData.length === 2) {
      return ([
        {x: new Date(moment(trendLineData[0].x).format("YYYY-MM-DD HH:mm:ss")),
        y: trendLineData[0].y[1]},
        {x: new Date(moment(trendLineData[1].x).format("YYYY-MM-DD HH:mm:ss")),
        y: trendLineData[1].y[1]},
      ]);
    };
  };

  // Function called in the trendline menu to remove dates.
  function onRemoveDate(index) {
    trendLineData.splice(index, 1);
    setTrendLineData(trendLineData);
    setRandom(Math.random());
  };

  // The settings and data of the candlestick chart
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
      prefix: currency === "eur" ? "€ " : currency === "usd" ? "$ " : "£ ",
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
        click: function (e) {
          trendLineData.length < 2 &&
            setTrendLineData((trendLineData) => {
              return [...trendLineData, { x: e.dataPoint.x, y: e.dataPoint.y }];
            });
        },
        dataPoints: candlestickChartData(ohlc_values_coin),
      },
      {
        type: "line",
        color: "black",
        lineThickness: 3,
        dataPoints: trendLineChartData(trendLineData),
      },
    ],
  };

  // Return the CanvasJS Candlestick chart.
  return (
    <>
      <Grid container justifyContent="left" style={{ margin: "30px" }}>
        <Grid item xs={8} md={9} justifyContent="center" alignItems="center">
          <CanvasJSChart options={options} />
        </Grid>
        <Grid item>
          <Box>
            <Card variant="outlined" style={{ margin: "5px" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  style={{
                    marginTop: "30px",
                    marginLeft: "30px",
                    marginRight: "30px",
                  }}
                >
                  Trendline Dates
                </Typography>
                <div
                  style={{
                    marginLeft: "30px",
                    marginRight: "30px",
                    marginBottom: "10px",
                    maxWidth: "150px"
                  }}
                >
                  {trendLineData.map((i) => {
                    return (
                      <Grid container alignItems="center" justifyContent="left">
                        <Grid item md={8} style={{ marginTop: "5px" }}>
                          <Button 
                            variant="outlined" 
                            startIcon={<DeleteIcon />}
                            onClick={()=>onRemoveDate(trendLineData.indexOf(i))}
                          >
                            <Typography variant="h6" component="div">
                              {moment(i.x).format("L").toString()}
                            </Typography>
                          </Button>
                        </Grid>
                      </Grid>
                    );
                  })}
                  {trendLineData.length === 0 && 
                    <Typography style={{marginTop: "5px"}}>
                      Select datapoints to draw the trendline
                    </Typography>
                  }
                </div>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CandlestickChart;
