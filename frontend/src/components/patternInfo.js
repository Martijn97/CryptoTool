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
    info: "A bullish kicker is a candlestick pattern that’s often formed after a significant downtrend, but could also form after an uptrend. In short, a bullish kicker consists of a large bullish candlestick, "
    + "that’s preceded by a gap to the upside and a bearish candle. If we spot a bullish kicker after an uptrend, that could be a sign that the market still has enough strength to continue the uptrend."
    + "However, if the pattern occurs after a downtrend, it instead might be a sign that the market has gone too far, and is about to revert. "
    + "The Bullish Kicker Candlestick pattern's reliability is high when it is formed at the downtrend or formed in an underbought area.",
    image:
      "https://tradingsim.com/wp-content/uploads/2016/09/bulish-kicker-pattern.png",
  },
  {
    name: "Bearish Kicker",
    info: "A bearish kicker is a candlestick pattern that consists of two candles, and that’s believed to signal a coming swing to the downside. A bearish kicker can be formed in an uptrend or downtrend, and is made up of a bearish candle that’s preceded by a gap to the downside and bullish candle."
    + "A bearish kicker that’s formed after an uptrend, could be seen as a form of reversal pattern. It tells us that the market is likely to have reached its summit for this time, and is headed for a fall. "
    + "In contrast, a bearish kicker that forms after a downtrend instead becomes a sort of continuation pattern. It tells us that the current downtrend most likely isn’t over, and that we could expect the market to perform new lows soon."
    + "The Bearish Kicker Candlestick pattern's reliability is high when it is formed at the uptrend or formed in an overbought area.",
    image:
      "https://tradingsim.com/wp-content/uploads/2016/09/bearish-kicker-pattern.png",
  },
  {
    name: "Bullish Engulfing",
    info:
      "The bullish engulfing pattern is formed of two candlesticks. The first candle is a short red body that is completely engulfed by a larger green candle." +
      "Though the second day opens lower than the first, the bullish market pushes the price up, culminating in an obvious win for buyers.",
    image:
      "https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bullish-engulfing.png",
  },
  {
    name: "Bearish Engulfing",
    info:
      "A bearish engulfing pattern occurs at the end of an uptrend. The first candle has a small green body that is engulfed by a subsequent long red candle." +
      "It signifies a peak or slowdown of price movement, and is a sign of an impending market downturn. The lower the second candle goes, the more significant the trend is likely to be.",
    image:
      "https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bearish-engulfing.png",
  },
  {
    name: "Bullish Harami",
    info:
      "A bullish harami is a candlestick pattern that indicates a bottom when it is preceded by a fall. It is a two-candle bullish reversal pattern." +
      "The first candle has a relatively large red body (bearish) and the second one has a smaller white body (bullish) that’s contained within the body of the first candle." +
      "This is also known as an 'inside day' pattern. The upper and lower shadow lines of the second candle are short and should also fall within the body of the first candle." +
      "Just like the Bullish Engulfing Pattern, a Bullish Harami pattern is a reversal pattern. It is an indication that the current existing downward trend (short or long term) is coming to an end and a positive trend reversal is imminent.",
    image:
      "https://www.chartmill.com/images/uploads/d8e7a5413a524316bd1de53559a7892b.png",
  },
  {
    name: "Bearish Harami",
    info:
      "A Bearish Harami Candlestick Pattern is a pattern that indicates a top when it is preceded by a price increase. It is a two-candle bearish reversal pattern." +
      "The first candle has a relatively large green body (bullish) and the second one has a smaller red body (bearish) that’s contained within the body of the first candle." +
      "This is also known as an 'inside day' pattern. The upper and lower shadow lines of the second candle are short and should also fall within the body of the first candle." +
      "Just like the Bullish Harami pattern, a Bearish Harami pattern is a reversal pattern. It is an indication that the current existing upward trend (short or long term) is coming to an end and a negative trend reversal is imminent.",
    image:
      "https://www.chartmill.com/images/uploads/aa992e273a824321a79c209a58ff83fe.png",
  },
  {
    name: "Shooting star",
    info:
      "The shooting star is the same shape as the inverted hammer, but is formed in an uptrend: it has a small lower body, and a long upper wick." +
      "Usually, the market will gap slightly higher on opening and rally to an intra-day high before closing at a price just above the open – like a star falling to the ground.",
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
            <Grid container justifyContent="left">
              {pattern_info.map((i) => {
                return (
                  <Grid item xs={6} style={{marginTop: "15px"}}>
                    <Card sx={{ maxWidth: 450, minHeight: "650px"}}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={i.image}
                      />
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
