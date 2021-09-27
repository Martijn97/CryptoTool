import React from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { JSONPath } from "jsonpath-plus";
import moment from "moment";

// The Candlestick chart
const CandlestickChart = (props) => {
  const name = props.name;
  const ohlc = props.ohlc;
  const currency = props.currency;

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
      prefix:
        currency === "eur"
          ? "€ "
          : currency === "usd"
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
        dataPoints: candlestickChartData(ohlc_values_coin),
      },
    ],
  };

  // Return the CanvasJS Candlestick chart.
  return <CanvasJSChart options={options} />;
};

export default CandlestickChart;
