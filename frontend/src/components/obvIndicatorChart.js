import React, { useContext, useState, useEffect } from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { JSONPath } from "jsonpath-plus";
import { AppContext } from "./../context/AppContext";
import axios from "axios";
import { Grid } from "@material-ui/core";

const ObvIndicatorChart = ({ name, days, currency, rangeChanged, index }) => {
  // States from the context
  const {
    coinList,
    offline,
    showObvChart,
    setChartList,
    chartList,
    setCompareChartList,
    compareChartList,
    setStriplineData,
    striplineData,
    comparisonModalOpen,
  } = useContext(AppContext);
  // State that holds the data
  const [data, setData] = useState([]);

  // Repsponsible for rendering
  useEffect(() => {
    reFetch(coinList, offline);
  }, [showObvChart]);

  // Function with the API calls
  async function reFetch(coinList, offline) {
    axios
      .get("/OHLC_data", {
        params: {
          coins: coinList,
          days: "max",
          offline: offline,
        },
        type: "GET",
      })
      .then((data) => {
        setData(data.data);
      });
  }

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const volume_values_coin = JSONPath({
    path: "$.[volume].[" + name + "].[" + currency + "].*",
    json: data,
  });

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const ohlc_values_coin = JSONPath({
    path: "$.[ohlc].[" + name + "].[" + currency + "].*",
    json: data,
  });

  // Does the actual computation to get the indicator for each date
  const obv_plot_data = (volume_values_coin, ohlc_values_coin) => {
    // the total of all the volumes
    let total = 0;
    const obv_data = [];

    // Loop over all the datapoints in the timespan max
    volume_values_coin?.map((item, index) => {
      // Decide if the price increased or not. Depending on this add or subtract the volume
      if (
        ohlc_values_coin[Math.floor(index / 4)][1] <
        ohlc_values_coin[Math.floor(index / 4)][4]
      ) {
        total = total + item[1];
      } else {
        total = total - item[1];
      }

      // Add the data to the array
      return obv_data.push({
        x: new Date(item[0]),
        y: total,
      });
    });

    // Decide about the number of days that must be shown in the plot
    const subDays = days === "max" ? obv_data.length : days;

    return obv_data.slice(obv_data.length - subDays);
  };

  // Options of the OBV indicator chart
  const options = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: false,
    zoomEnabled: true,
    rangeChanged: rangeChanged,
    axisX: {
      valueFormatString: "DD-MM-YYYY",
      crosshair: {
        enabled: true,
        snapToDataPoint: false,
      },
      stripLines: [
        {
          value: striplineData,
          thickness: 3,
        },
      ],
    },
    axisY: {
      includeZero: false,
      title: "x1.000.000.000",
      labelFormatter: function(e){
				return  e.value/1000000000;
			}
    },
    height: 130,
    data: [
      {
        type: "area",
        color: "#4d4dff",
        lineThickness: 3,
        toolTipContent:
          '<span style="color:#4d4dff ">On-Balanced Volume</span><br>Value: {y}<br>Date: {x}',
        click: function (e) {
          // if in overview mode, draw striplines
          if (comparisonModalOpen) {
            setStriplineData(e.dataPoint.x);
          }
        },
        dataPoints: obv_plot_data(volume_values_coin, ohlc_values_coin),
      },
    ],
  };

  // Return the CanvasJS Candlestick chart.
  return (
    <Grid container justifyContent="left">
      <CanvasJSChart
        options={options}
        // the ref is used for syncing zooming and panning in comparison mode as well as at the overview page
        onRef={(ref) => {
          setChartList((chartList) => {
            if (ref?.theme === "light2") {
              return [
                ...chartList,
                { name: "obv", index: index, name_coin: name, ref: ref },
              ];
            } else {
              return [...chartList];
            }
          });
          setCompareChartList((compareChartList) => {
            return [...compareChartList, ref];
          });
        }}
      />
    </Grid>
  );
};

export default ObvIndicatorChart;
