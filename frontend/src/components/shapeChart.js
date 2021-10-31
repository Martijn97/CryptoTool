import React, { useContext } from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { AppContext } from "./../context/AppContext";
import { Grid } from "@material-ui/core";
import { JSONPath } from "jsonpath-plus";

// This chart shows the relative growth of two coins.
// Used in the coinComparisonDialog.

const ShapeChart = ({ name, data, currency, index }) => {
  // States are used to update the reference to the chart
  const {
    setChartList,
    setCompareChartList,
    chartList,
    compareChartList,
    setStriplineData,
    striplineData,
    comparisonModalOpen,
  } = useContext(AppContext);

  // Get the data of the first coin
  const ohlc_values_coin_1 = JSONPath({
    path: "$.[ohlc].[" + name[0] + "].[" + currency + "].*",
    json: data,
  });

  // Get the data of the second coin
  const ohlc_values_coin_2 = JSONPath({
    path: "$.[ohlc].[" + name[1] + "].[" + currency + "].*",
    json: data,
  });

  // Store the first value in this range of both coins.
  // Added if statement for the second coin to avoid error in an edge case.
  const base_1 = ohlc_values_coin_1[0][4];
  const base_2 = ohlc_values_coin_2?.length > 0 ? ohlc_values_coin_2[0][4] : 0;

  // Transform the data into the right format to use in the chart.
  const formatData = (data, base) => {
    const closingValues = [];

    data.map((i) => {
      return closingValues.push({
        x: new Date(i[0]),
        y: (i[4] / base) * 100, // Get the value relative to original in percentage
      });
    });

    return closingValues;
  };

  // Create the plot and return it.
  const shapeChart = () => {
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
        prefix: "% ",
      },
      data: [
        {
          type: "spline",
          markerType: "none",
          name: "Progress " + name[0],
          color: "#007bb8",
          lineThickness: 3,
          toolTipContent:
            '<span style="color:#007bb8 ">{name}</span><br>Date: {x}<br>Percentage: {y}',
          click: function (e) {
            // if in overview mode, draw striplines
            if (comparisonModalOpen) {
              setStriplineData(e.dataPoint.x);
            }
          },
          dataPoints: formatData(ohlc_values_coin_1, base_1),
        },
        {
          type: "spline",
          markerType: "none",
          name: "Progress " + name[1],
          color: "#40e0d0",
          lineThickness: 3,
          toolTipContent:
            '<span style="color:#40e0d0 ">{name}</span><br>Date: {x}<br>Percentage: {y}',
          click: function (e) {
            // if in overview mode, draw striplines
            if (comparisonModalOpen) {
              setStriplineData(e.dataPoint.x);
            }
          },
          dataPoints: formatData(ohlc_values_coin_2, base_2),
        },
      ],
    };

    return (
      <Grid container justifyContent="left">
        <CanvasJSChart
          options={options}
          // the ref is used for syncing zooming and panning in comparison mode as well as at the overvewi page
          onRef={(ref) => {
            setChartList((chartList) => {
              if (ref?.theme === "light2") {
                return [
                  ...chartList,
                  {
                    name: "shapeChart",
                    index: index,
                    name_coin: name,
                    ref: ref,
                  },
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

  return shapeChart();
};

export default ShapeChart;
