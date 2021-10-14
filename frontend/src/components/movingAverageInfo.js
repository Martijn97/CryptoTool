import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";

// This component shows a dialog with additional information about the moving average.
const MovingAverageInfo = (movingAverageInfoOpen) => {
  const dialog = (movingAverageInfoOpen, onClosemovingAverageInfo) => {
    return (
      <Dialog
        open={movingAverageInfoOpen}
        onClose={onClosemovingAverageInfo}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Information moving average
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              Line that smooths out price fluctuation to give traders a better
              understanding where the trend is heading. It is easier to find buy
              and or sell signals in the trend. Choose a time frame like a day,
              month, or year. Compute the average price by adding all prices of
              the total time span and dividing it with the number of prices in
              that time frame. Each new time frame removes the oldest time frame
              and adds the newest. By using a moving average, the line is less
              influenced by changes in the price as with a normal price chart.
            </Typography>
            <Typography>
              we can see that when the price surpasses the SMA line, the prices
              often trend upward for some time. It is often used as a buy
              indicator for technical traders. However, when the price
              intersects and falls below the SMA line, we see a downtrend in
              prices for a bit as well. It may sometimes be a good indicator to
              sell. However, investors must be careful when trying to time the
              intersections, as the SMA is based on historical information and
              lags behind real-time data.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClosemovingAverageInfo} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return dialog(movingAverageInfoOpen.movingAverageInfoOpen, movingAverageInfoOpen.onClosemovingAverageInfo);
};

export default MovingAverageInfo;
