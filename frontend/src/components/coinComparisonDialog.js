import React, { useContext } from "react";
import { AppContext } from "./../context/AppContext";
import CandlestickChart from "./candlestickChart";
import VolumeChart from "./volumeChart";
import ShapeChart from "./shapeChart";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

// This component renders a dialog in which two candlestick or volume charts are shown besides
// each other. This makes it easy to compare them.

const CoinComparisonDialog = ({
  compareModalOpen,
  onCloseCompareModal,
  ohlc,
  currency,
  days,
  allowAnalysis,
  type, //Decides if the candlestick or the volume plot will be shown in the dialog
}) => {
  // Import multiple states from the context. Mostly used to talk to the charts.
  const { coinList, compareChartList } = useContext(AppContext);

  // Credits to Manoj Mohan from CanvasJS for the function below.
  // Function is used to change the range of all the charts when applied to one.
  function syncHandler(e) {
    var charts = compareChartList;

    // Loop over the charts and apply appropriate action
    for (var i = 0; i < charts.length; i++) {
      var chart = charts[i];
      //check if there is no undefined chart
      if (!(typeof chart === "undefined")) {
        
        if (!chart.options.axisX) chart.options.axisX = {};
        if (!chart.options.axisY) chart.options.axisY = {};

        // if a reset is triggered, reset all charts
        if (e.trigger === "reset") {
          chart.options.axisX.viewportMinimum =
            chart.options.axisX.viewportMaximum = null;
          chart.options.axisY.viewportMinimum =
            chart.options.axisY.viewportMaximum = null;

          chart.render();
        } 
        // In the other cases, change the view to the same as the event
        else if (chart !== e.chart) {
          chart.options.axisX.viewportMinimum = e.axisX[0].viewportMinimum;
          chart.options.axisX.viewportMaximum = e.axisX[0].viewportMaximum;

          chart.options.axisY.viewportMinimum = e.axisY[0].viewportMinimum;
          chart.options.axisY.viewportMaximum = e.axisY[0].viewportMaximum;

          chart.render();
        }
      }
    }
  }

  const dialog = (compareModalOpen, onCloseCompareModal) => {
    return (
      <Dialog
        open={compareModalOpen}
        onClose={onCloseCompareModal}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Compare selected coins</DialogTitle>
        <DialogContent>
          {type === "candlestick" && (
            <DialogContentText>
              {/* candlestick first coin */}
              <CandlestickChart
                index={0}
                name={coinList[0]}
                ohlc={ohlc}
                currency={currency}
                days={days}
                allowAnalysis={allowAnalysis}
                rangeChanged={syncHandler}
              />
              {/* candlestick second coin */}
              <CandlestickChart
                index={1}
                name={coinList[1]}
                ohlc={ohlc}
                currency={currency}
                days={days}
                allowAnalysis={allowAnalysis}
                rangeChanged={syncHandler}
              />
            </DialogContentText>
          )}
          {type === "volume" && (
            <DialogContentText>
              {/* volume of first coin */}
              <VolumeChart
                index={0}
                name={coinList[0]}
                ohlc={ohlc}
                currency={currency}
                rangeChanged={syncHandler}
              />
              {/* volume of second coin */}
              <VolumeChart
                index={1}
                name={coinList[1]}
                ohlc={ohlc}
                currency={currency}
                rangeChanged={syncHandler}
              />
            </DialogContentText>
          )}
          {type === "relative" && (
            <DialogContentText>
              <ShapeChart index={0} name={coinList} data={ohlc} currency={currency}/>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseCompareModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return dialog(compareModalOpen, onCloseCompareModal);
};

export default CoinComparisonDialog;
