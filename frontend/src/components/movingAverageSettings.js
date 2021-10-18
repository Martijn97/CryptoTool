import React, { useContext } from "react";
import { AppContext } from "./../context/AppContext";
import {
  Typography,
  MenuItem,
  Button,
  Select,
  makeStyles,
  FormControl,
} from "@material-ui/core";
import { IconButton, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

// Custom styling of the component
const useStyles = makeStyles((theme) => ({
  accordionContent: {
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    maxWidth: "200px",
  },
}));

// Component is responsible for the settings of the moving average
const MovingAverageSettings = () => {
  const {
    timespan,
    setTimespan,
    timespanTwo,
    setTimespanTwo,
    setShowMovingAverage,
    showMovingAverage,
    setShowFlagsMovingAverage,
    showFlagsMovingAverage,
    setMovingAverageInfoShown,
    showCrossMovingAverage, 
    setShowCrossMovingAverage,
  } = useContext(AppContext);

  // Styling
  const classes = useStyles();

  return (
    <div className={classes.accordionContent}>
      <div style={{ marginBottom: "10px" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={showCrossMovingAverage}
                onChange={() =>
                  setShowCrossMovingAverage(!showCrossMovingAverage)
                }
              />
            }
            label="Cross-over"
          />
        </FormGroup>
      </div>
      <Typography>Timespan:</Typography>
      <FormControl variant="outlined" style={{ marginTop: "10px" }}>
        <Select
          id="period-select"
          value={timespan}
          style={{ width: "200px", marginBottom: "10px" }}
          onChange={(e) => setTimespan(e.target.value)}
        >
          <MenuItem value={"day"}>Day</MenuItem>
          <MenuItem value={"month"}>Month</MenuItem>
          <MenuItem value={"year"}>Year</MenuItem>
        </Select>
        {showCrossMovingAverage && (
          <div>
            <Typography>Timespan 2:</Typography>
            <Select
              id="period-select-2"
              value={timespanTwo}
              style={{ width: "200px", marginTop: "10px" }}
              onChange={(e) => setTimespanTwo(e.target.value)}
            >
              <MenuItem value={"day"}>Day</MenuItem>
              <MenuItem value={"month"}>Month</MenuItem>
              <MenuItem value={"year"}>Year</MenuItem>
            </Select>
          </div>
        )}
        <div style={{ marginTop: "10px" }}>
          {/* Button that shows the moving average on the candlestick chart */}
          <Button
            onClick={() => setShowMovingAverage(!showMovingAverage)}
            variant="contained"
          >
            {showMovingAverage ? "Hide plot" : "Show plot"}
          </Button>
          {/* Button that opens an info dialog */}
          <IconButton
            aria-label="info"
            style={{ margin: "10px", marginBottom: "10px" }}
            onClick={() => {
              setMovingAverageInfoShown(true);
            }}
          >
            <InfoIcon />
          </IconButton>
        </div>
        <div style={{ marginTop: "10px" }}>
          {/* Button that flags the intersections on the candlestick chart */}
          <Button
            onClick={() => setShowFlagsMovingAverage(!showFlagsMovingAverage)}
            variant="contained"
            disabled={!showMovingAverage}
          >
            {showFlagsMovingAverage
              ? "Hide intersections"
              : "Flag intersections"}
          </Button>
        </div>
      </FormControl>
    </div>
  );
};

export default MovingAverageSettings;
