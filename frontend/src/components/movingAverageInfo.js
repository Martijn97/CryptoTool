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
          Moving Average Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5" style={{ marginBottom: "5px" }}>
              Simple Moving Average (SMA)
            </Typography>
            <Typography>
              The moving average plot smooths out price fluctuation. This gives
              the traders a better understanding where the trend is heading and
              makes it easier to find buy and/or sell signals in the trend. Each
              data point on the moving average plot is computed in the following
              way:
            </Typography>
            <Typography>
              Moving Average = (A_1 + A_2 + A_3 ..... A_n)/n
            </Typography>
            <Typography style={{ marginTop: "20px" }}>
              The next point in the moving average plot is computed as follows:
            </Typography>
            <Typography>
              Moving Average = (A_2 + A_3 + A_4 ..... A_n+1)/n
            </Typography>
            <Typography style={{ marginTop: "20px", marginBottom: "20px" }}>
              So, the moving average is the average closing value over a period
              of time. The tool has three periods of time to choose from: day,
              month, or year.
            </Typography>
            <Typography variant="h5" style={{ marginBottom: "5px" }}>
              Cross-over Moving Average (CMA)
            </Typography>
            <Typography style={{ marginBottom: "20px" }}>
              Besides the simple moving average describe above, the cross-over
              moving average can be executed by the tool. The cross-over moving
              average method has two moving average plots where each of the two
              has a different period. The crossing/intersection points of the
              two different plots are interesting to the investor.
            </Typography>
            <Typography variant="h5" style={{ marginBottom: "5px" }}>
              Intepretation
            </Typography>
            <Typography style={{ marginBottom: "20px" }}>
              When the price surpasses the SMA line, the price often trend
              upward for some time. It is often used as a buy indicator for
              traders. However, when the price intersects and falls below the
              SMA line, we see a downtrend in prices for a bit as well. It may
              sometimes be a good indicator to sell. However, investors must be
              careful when trying to time the intersections, as the SMA is based
              on historical information and lags behind real-time data. By
              selecting the "Show intersection" button, the intersections of the
              SMA plot and the candlesticks are shown.
            </Typography>
            <Typography>
              When the CMA with the smaller period surpasses the CMA plot with
              the larger periode, then often a trend upwards occurs. The
              opposite happens when the CMA with the smallest period intersects
              the CMA plot with the larger period. In this case, a downwards
              trend often occurs. By selecting the "Show intersection" button,
              the intersections of the two plots of the CMA are shown.
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

  return dialog(
    movingAverageInfoOpen.movingAverageInfoOpen,
    movingAverageInfoOpen.onClosemovingAverageInfo
  );
};

export default MovingAverageInfo;
