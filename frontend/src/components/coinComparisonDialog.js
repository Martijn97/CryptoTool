import React, { useContext } from "react";
import { AppContext } from "./../context/AppContext";
import CandlestickChart from "./candlestickChart";
import VolumeChart from "./volumeChart";
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
  const { coinList } = useContext(AppContext);

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
                name={coinList[0]}
                ohlc={ohlc}
                currency={currency}
                days={days}
                allowAnalysis={allowAnalysis}
              />
              {/* candlestick second coin */}
              <CandlestickChart
                name={coinList[1]}
                ohlc={ohlc}
                currency={currency}
                days={days}
                allowAnalysis={allowAnalysis}
              />
            </DialogContentText>
          )}
          {type === "volume" && (
            <DialogContentText>
              {/* volume of first coin */}
              <VolumeChart
                  name={coinList[0]}
                  ohlc={ohlc}
                  currency={currency}
                />
              {/* volume of second coin */}
              <VolumeChart
                  name={coinList[1]}
                  ohlc={ohlc}
                  currency={currency}
                />
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
