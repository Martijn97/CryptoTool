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
import pic from "./../images/trendlineInfoImage.png";

const TrendlineInfoDialog = ({
  trendlineInfoDialogOpen,
  onCloseTrendlineInfoDialog,
}) => {
  const dialog = (TrendlineInfoDialogOpen, onCloseTrendlineInfoDialog) => {
    return (
      <Dialog
        open={trendlineInfoDialogOpen}
        onClose={onCloseTrendlineInfoDialog}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Trendline Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5" style={{ marginBottom: "5px" }}>
              General
            </Typography>
            <Typography>
              A trendline is a line drawn on the highs or lows of the price that
              shows the direction of the price. In the case of the candlestick
              chart, the line is drawn on the low and high value and not the
              opening or closing value of the candlestick. There are 3 types of
              trends: an uptrend, a downtrend and a sideway trend. So, an
              uptrend has an increasing price, and a downtrend has a decreasing
              price. Trend lines help you confirm the trend type. Most
              importantly, it helps you recognizing when a trend tents to break
              down.
            </Typography>
            <Typography style={{ marginTop: "5px" }}>
              So how to draw trend lines? For an uptrend, connect major troughs
              and for a downtrend, connect major peaks. You need to connect two
              dots to get a line, but a third point would extra confirm the
              trend. You can select points in the tool by selecting the
              candlestick. The datapoint is added in the trendline card in the
              trendline setting on the right.
            </Typography>
            <Typography
              variant="h5"
              style={{ marginTop: "5px", marginBottom: "5px" }}
            >
              Intepretation
            </Typography>
            <Typography>
              A trendline can help investors to buy or sell their coins at the
              right moment. The image below shows the most common situations
              concerning a trendline.
            </Typography>
            <div style={{ marginTop: "20px", marginLeft: "40px" }}>
              <img src={pic} alt="trendline breakout types" />
            </div>
            <Typography>
              Note: it is possible, that the price of a coin quickly rises or
              drops after a breakout of the trendline, although it was expected
              to do the opposite. Trendlines are usefule but not a certainty.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseTrendlineInfoDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return dialog(trendlineInfoDialogOpen, onCloseTrendlineInfoDialog);
};

export default TrendlineInfoDialog;
