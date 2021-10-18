import React, { useState, useEffect, useContext } from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import { AppContext } from "./../context/AppContext";
import { Grid } from "@material-ui/core";
import { JSONPath } from "jsonpath-plus";
import moment from "moment";

// The Candlestick chart
const CandlestickChart = (props) => {
  const name = props.name;
  const ohlc = props.ohlc;
  const currency = props.currency;

  // States from the context that contain general information. 
  // Used to communicate to the generalAnalysis component
  const {
    trendLineExtension,
    setTrendLineExtension,
    trendLineData,
    setTrendLineData,
    timespan,
    timespanTwo,
    showCrossMovingAverage,
    showMovingAverage,
    candlestickPatterns,
    showPatterns,
    showFlagsMovingAverage,
  } = useContext(AppContext);
  // State used to force a re-render of the page
  const [, setRandom] = useState(Math.random());

  // Function that computes the amount the trend line is extended.
  function computeExtension(days) {
    const timeExtensionTrendLine =
    days === "max" ? "year" : days > 30 ? "month" : "days";
    const timeExtensionTrendLineValue =
    timeExtensionTrendLine === "year" ? 365 : timeExtensionTrendLine === "month" ? 32 : 1;

    return timeExtensionTrendLineValue;
  }

  useEffect(()=> {
    // When the scope of the trendline is changed. The default extension should be changed.
    setTrendLineExtension(computeExtension(props.days));

    // When the scope of the candlestick plot is changed. The trendline should be removed.
    onRemoveDate(1);
    onRemoveDate(0);
  }, [props.days, props.currency])

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const ohlc_values_coin = JSONPath({
    path: "$.[ohlc].[" + name + "].[" + currency + "].*",
    json: ohlc,
  });

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const ohlc_values_year_coin = JSONPath({
    path: "$.[ohlc_year].[" + name + "].[" + currency + "].*",
    json: ohlc,
  });

  // Get the pattern data of this specific coin
  const get_pattern_data = (candlestickPatterns) => {
    const pattern_data = [];
    candlestickPatterns.map((i, index) => {
      if (i?.name === name) {
        return pattern_data.push(
          JSONPath({
            path: "$[" + index + "].data.*",
            json: candlestickPatterns,
          })
        );
      }
    });

    return pattern_data[0];
  };

  // Transform the candlestick pattern data into the right format
  const format_pattern_data = (patterns) => {
    const pattern_data = [];

    patterns?.map((i) => {
      return pattern_data.push({
        name: i.name,
        data: [
          i.data.map((i) => {
            return {
              x: new Date(i.date),
              y: i.y,
            };
          }),
        ],
      });
    });
    return pattern_data;
  };
  
  // Execute the two function above to get the right format data.
  const pattern_data = format_pattern_data(get_pattern_data(candlestickPatterns))

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

    // check if there are two points selected. Two are necessary to draw a line.
    if (trendLineData.length === 2) {

      // Sort the data such that the line can extended on the right direction
      trendLineData.sort(function(a,b){
        return new Date(a.x) - new Date(b.x)
      });

      // Compute the difference in time between the two points
      const diffMoment = moment(trendLineData[0].x).diff(
        moment(trendLineData[1].x)
      );

      // Compute the time in day
      const diffYesterday = moment(trendLineData[0].x).diff(
        moment(trendLineData[0].x).subtract(1, "days")
      );
      
      // Compute the difference between the points based on diffYesterday
      const divideMoment = diffMoment / diffYesterday;

      // Compute if the trendline is decreasing or increasing
      const directionTrendline = trendLineData[0].y[1] > trendLineData[1].y[1] ? 1 : 2;
      
      // Compute the difference in value between the two points
      const diffLineData = trendLineData[0].y[directionTrendline] - trendLineData[1].y[directionTrendline];
      
      return [
        {
          x: new Date(
            moment(trendLineData[0].x)
              .subtract(trendLineExtension, 'days')
              .format("YYYY-MM-DD HH:mm:ss")
          ),
          y:
            trendLineData[0].y[directionTrendline] +
            trendLineExtension * (diffLineData / -divideMoment),
        },
        {
          x: new Date(moment(trendLineData[0].x).format("YYYY-MM-DD HH:mm:ss")),
          y: trendLineData[0].y[directionTrendline],
        },
        {
          x: new Date(moment(trendLineData[1].x).format("YYYY-MM-DD HH:mm:ss")),
          y: trendLineData[1].y[directionTrendline],
        },
        {
          x: new Date(
            moment(trendLineData[1].x)
              .add(trendLineExtension, 'days')
              .format("YYYY-MM-DD HH:mm:ss")
          ),
          y:
            trendLineData[1].y[directionTrendline] -
            trendLineExtension * (diffLineData / -divideMoment),
        },
      ];
    }
  };

  // Function that returns the data for the moving average plot
  const movingAverageData = (ohlc_values_coin, ohlc_values_year_coin, timespanMA) => {
    // Checks if the moving average plot needs to be shown
    if (!showMovingAverage) {
      return [];
    }

    // Add the ohlc data of the last year to the dataset
    const ohlc_values_coin_concat = ohlc_values_coin.concat(ohlc_values_year_coin)
    // Empty array to fill with the results
    const coinClosingValues = []

    // Sets the timespan from string to number of days.
    const timeMultiplication = timespanMA === 'day' ? 1 : timespanMA === 'month' ? 31 : 365;

    ohlc_values_coin.map((i) => {
      // contains the date of the current item
      let date = new Date(moment(i[0]).format("YYYY-MM-DD HH:mm:ss"));

      let valuesTimespan = []

      // check for each other item if it is within the timestamp near to the current item
      ohlc_values_coin_concat.map((i) => {
        let diffTime = date - i[0]

        return 0 <= diffTime && diffTime < (timeMultiplication * 86400000) && valuesTimespan.push(i[4]) 
      })

      // Add all the point together
      const value = valuesTimespan.reduce(function (a, b) {
        return a + b;
      }, 0);

      // Push the points to the array
      return coinClosingValues.push({
        x: date, 
        y: value/valuesTimespan.length
      })
    });

    return coinClosingValues;
  };

  // Get the data of the intersection points between the prices and the moving average
  const movingAverageIntersectionData = (ohlc_values_coin, ohlc_values_year_coin) => {
    // Check if the intersections must be plotted or not
    if (!showFlagsMovingAverage) {
      return
    }

    // Get the moving average data
    const MA_Data = movingAverageData(ohlc_values_coin, ohlc_values_year_coin, timespan);
    // In case of cross-over, we need a second moving average
    const MA_Two_Data = movingAverageData(ohlc_values_coin, ohlc_values_year_coin, timespanTwo);
    

    // Create an empty array to store the positions of the intersections
    const topOrBottomPrice = []
    const positionIntersection = []
    
    // Check for each point if it is on top or below the moving average.
    if (!showCrossMovingAverage) {
      // The intersections between the price and moving average
      MA_Data.map((i, index) => {
        if (i.y > ohlc_values_coin[index][4]) {
          return topOrBottomPrice.push(1)
        } else {
          return topOrBottomPrice.push(0)
        }
      })
    } else {
      // The intersections during cross-over moving average
      MA_Data.map((i, index) => {
        if (i.y > MA_Two_Data[index].y) {
          return topOrBottomPrice.push(1)
        } else {
          return topOrBottomPrice.push(0)
        }
      })
    }
    
    // Transform the data into data that can be plotted
    topOrBottomPrice.map((i, index) => {
      if (index === 0) {
        return null
      }
      if ( i !== topOrBottomPrice[index-1]) {
        return positionIntersection.push(MA_Data[index])
      } else {
        return null
      }
    })

    return positionIntersection
  }

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
        yValueFormatString: currency === "eur" ? "€ ###0.00" : currency === "usd" ? "$ ###0.00" : "£ ###0.00",
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#5a5a5a ">{name}</span><br>Date: {x}<br>Open: {y[0]}<br>High: {y[1]}<br>Low: {y[2]}<br>Close: {y[3]}',
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
      {
        type: "spline",
        xValueFormatString: "DD-MM-YYYY",
        markerType: "none",
        toolTipContent:
          '<span style="color:#FFA500 ">Moving average:</span><br>Date: {x}',
        dataPoints: movingAverageData(ohlc_values_coin, ohlc_values_year_coin, timespan),
      },
      {
        type: "spline",
        xValueFormatString: "DD-MM-YYYY",
        markerType: "none",
        toolTipContent:
          '<span style="color:#FFA500 ">Moving average:</span><br>Date: {x}',
        dataPoints: showCrossMovingAverage && movingAverageData(ohlc_values_coin, ohlc_values_year_coin, timespanTwo),
      },
      {
        type: "scatter",
        name: "Shooting Star",
        markerType: "triangle",
        markerColor: "#340034",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[0]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Bullish Kicker",
        markerType: "triangle",
        markerColor: "#4d004d",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[1]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Bearish Kicker",
        markerType: "triangle",
        markerColor: "#670067",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[2]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Bullish Engulfing",
        markerType: "triangle",
        markerColor: "#800080",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[3]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Bearish Engulfing",
        markerType: "triangle",
        markerColor: "#9a009a",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[3]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Bullish Harami",
        markerType: "triangle",
        markerColor: "#b300b3",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[5]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Bearish Harami",
        markerType: "triangle",
        markerColor: "#cd00cd",
        markerSize: 20,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Candstick pattern: <br>{name}</span><br>Date: {x}',
        dataPoints: showPatterns ? pattern_data[6]?.data[0] : [],
      },
      {
        type: "scatter",
        name: "Moving Average Intersection",
        markerType: "circle",
        markerColor: "#FFFF00",
        markerSize: 10,
        xValueFormatString: "DD-MM-YYYY",
        toolTipContent:
          '<span style="color:#cd00cd ">Moving average intersection</span><br>Date: {x}',
        dataPoints: movingAverageIntersectionData(ohlc_values_coin, ohlc_values_year_coin)
      },
    ],
  };

  // Return the CanvasJS Candlestick chart.
  return (
    <Grid container justifyContent="left">
      <CanvasJSChart options={options} />
    </Grid>
  );
};

export default CandlestickChart;
