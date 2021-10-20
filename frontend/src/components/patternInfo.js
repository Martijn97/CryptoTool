import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const pattern_info = [
  {
    name: "Bullish Kicker",
    info: (
      <Typography>
        A bullish kicker occurs often after a large downtrend or uptrend. The
        pattern consists of a stretched candlestick and a large gap to the
        upside. The candlestick preceding the bullish kicked is one with a
        bearish kicker pattern. A bullish kicker after an uptrend can be a sign
        that the market can continue with the upward trend for a while. However,
        in the case of a downward trend, it may be an early sign that the price
        will probably decrease soon. The reliability of the bullish kicker is
        higher when it is formed at the downtrend or formed in an underbought
        area.
      </Typography>
    ),
    image:
      "https://tradingsim.com/wp-content/uploads/2016/09/bulish-kicker-pattern.png",
  },
  {
    name: "Bearish Kicker",
    info: (
      <Typography>
        The bearish kicker pattern consists of a stretched candlestick and is
        often preceded by a large downtrend. A bearish kicker can be seen as a
        reversal pattern since it flags a large downtrend after a period of an
        increasing price. However, a bearish kicker can also occur in a
        downtrend in which it means that the downward trend is still going on
        and the price will get lower. The reliability of the bearish kicker is
        higher when it is formed at the uptrend or formed in an overbought area.
      </Typography>
    ),
    image:
      "https://tradingsim.com/wp-content/uploads/2016/09/bearish-kicker-pattern.png",
  },
  {
    name: "Bullish Engulfing",
    info: (
      <Typography>
        The bullish engulfing pattern consists of two candlesticks. The first
        candlestick is a short red one and the second a larger green
        candlestick. The body of the red candlestick fits entirely in the green
        larger candlestick. So, the second candlestick has a larger open and
        close value then the first candlestick. This pattern is an early sign
        that the price is increasing.
      </Typography>
    ),
    image:
      "https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bullish-engulfing.png",
  },
  {
    name: "Bearish Engulfing",
    info: (
      <Typography>
        The bearish engulfing pattern consists of two candlesticks. The first
        candlestick is a short green one and the second a larger red
        candlestick. The body of the green candlestick fits entirely in the red
        larger candlestick. The pattern occurs after an uptrend and gives an
        early sign that a peak or slowdown of the price increasement is comming
        up.
      </Typography>
    ),
    image:
      "https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bearish-engulfing.png",
  },
  {
    name: "Bullish Harami",
    info: (
      <Typography>
        The bullish harami pattern indicates a bottom when the candlestick
        before the pattern are in a decreasing trend. The first candle has a
        large stretched red body and the second one has a smaller compact green
        body. The body of the second candlestick fits the first candlestick. The
        high and low values of the second candlestick are close to the open and
        close values of the candlestick. Often, the high and low value of the
        second candlestick fit the first candlestick. The bullish harami indicates that
        the current existing downwards trend ends soon.
      </Typography>
    ),
    image:
      "https://www.chartmill.com/images/uploads/d8e7a5413a524316bd1de53559a7892b.png",
  },
  {
    name: "Bearish Harami",
    info: (
      <Typography>
        The bearish harami pattern indicates a top when the candlesticks before
        the pattern are in an increasing trend. The first candle has a large
        stretched green body and the second one has a smaller compact. The body
        of the second candlestick fits in the body of the first candlestick. The
        high and low values of the second candlestick are close to the open and
        close values of the candlestick. Often, the high and low value of the
        second candlestick fit the first candlestick. The bearish harami indicates that
        the current existing upward trend ends soon.
      </Typography>
    ),
    image:
      "https://www.chartmill.com/images/uploads/aa992e273a824321a79c209a58ff83fe.png",
  },
  {
    name: "Shooting star",
    info: (
      <Typography>
        The shooting star candlestick has a small lower body, and a high value
        far from the open/close value of the candlestick. So, the open and close
        values are close to each other. Usually, the pattern indicates that the
        top is reached. If the pattern occurs after a couple of rising
        candlestick, it may indicate that people start selling.
      </Typography>
    ),
    image:
      "https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/shooting-star.png",
  },
];

// Dialog that shows information about the different patterns
const PatternInfoModal = (patternInfoModalOpen) => {
  // Dialog itself
  const dialog = (patternInfoModalOpen, onClosePatternInfoModal) => {
    return (
      <Dialog
        open={patternInfoModalOpen}
        onClose={onClosePatternInfoModal}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Information candlestick pattern
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography style={{ marginBottom: "20px" }}>
              Candlesticks are red and green bars that contain the open, close,
              high and low value of a coin at a specific time. A candlestick
              chart is shown in the tool. Some combinations of open, close, high
              and low values are special and can be a first sign of an
              increasing or decreasing price. The same holds for specific
              sequences of candlesticks. These special sequences or combinations
              are called candlestick patterns.
            </Typography>
            <Typography style={{ marginBottom: "5px" }}>
              The seven candlestick patterns recognized by the tool are the
              following:
            </Typography>
            <Grid container justifyContent="left">
              {pattern_info.map((i) => {
                return (
                  <Grid item xs={6} style={{ marginTop: "15px" }}>
                    <Card sx={{ maxWidth: 450, minHeight: "650px" }}>
                      <CardMedia component="img" height="300" image={i.image} />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {i.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {i.info}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClosePatternInfoModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return dialog(
    patternInfoModalOpen.patternInfoModalOpen,
    patternInfoModalOpen.onClosePatternInfoModal
  );
};

export default PatternInfoModal;
