import React, { useContext } from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { AppContext } from "./../context/AppContext";
import { JSONPath } from "jsonpath-plus";
import moment from "moment";

// The Volume chart
const VolumeChart = (props) => {
  const name = props.name;
  const ohlc = props.ohlc;
  const currency = props.currency;

  const {
    chartList,
    setChartList,
    setCompareChartList,
    compareChartList,
    setStriplineData,
    striplineData,
    comparisonModalOpen,
  } = useContext(AppContext);

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const volume_values_coin = JSONPath({
    path: "$.[volume].[" + name + "].[" + currency + "].*",
    json: ohlc,
  });

  // The function converts volume data into the right input for the volume chart
  const volumeChartData = (volume_values_coin) => {
    const data = [];
    volume_values_coin.map((i) => {
      return data.push({
        x: new Date(moment(i[0]).format("YYYY-MM-DD HH:mm:ss")),
        y: i[1],
      });
    });

    return data;
  };

  // The settings and data of the volume chart
  const options = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: false,
    zoomEnabled: true,
    rangeChanged: props.rangeChanged,
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
      title: "x1.000.000",
      labelFormatter: function(e){
				return  e.value/1000000;
			}
    },
    height: 150,
    data: [
      {
        type: "column",
        showInLegend: false,
        name: "Volume " + name,
        color: "grey",
        yValueFormatString: "###0",
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#5a5a5a ">{name}</span><br>Date: {x}<br> Volume: {y}',
        click: function (e) {
          // if in overview mode, draw striplines
          if (comparisonModalOpen) {
            setStriplineData(e.dataPoint.x);
          }
        },
        dataPoints: volumeChartData(volume_values_coin),
      },
    ],
  };

  // Return the CanvasJS Candlestick chart.
  return (
    <CanvasJSChart
      options={options}
      // the ref is used for syncing zooming and panning in comparison mode as well as at the overview page
      onRef={(ref) => {
        setChartList((chartList) => {
          if (ref?.theme === "light2") {
            return [
              ...chartList,
              { name: "volume", index: props.index, name_coin: name, ref: ref },
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
  );
};

export default VolumeChart;
