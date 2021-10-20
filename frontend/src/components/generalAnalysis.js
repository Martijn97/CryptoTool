import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  makeStyles,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
import MuiAlert from '@mui/material/Alert';
import {
  TextField,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import moment from "moment";
import VolumeChart from "./volumeChart";
import CandlestickChart from "./candlestickChart";
import CandlestickPatternRecognition from "./candlestickPatternRecognition";
import MovingAverageSettings from "./movingAverageSettings";
import CoinComparisonDialog from "./coinComparisonDialog";
import InfoIcon from "@mui/icons-material/Info";
import ObvIndicatorChart from "./obvIndicatorChart";

/*
This components returns a grid of cards. In each card the Candlestick chart of a specific coin
is shown. The Chart has some interactions and is the start of the in depth analysis of coins.
*/

// Custom styling of the component
const useStyles = makeStyles((theme) => ({
  accordionContent: {
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    maxWidth: "200px",
  },
}));

const GeneralAnalysisPage = (props) => {
  // Import multiple states from the context. Mostly used to talk to the charts.
  const {
    coinList,
    setCoinList,
    trendLineExtension,
    setTrendLineExtension,
    trendLineData,
    setTrendLineData,
    setCandlestickPatterns,
    setShowPatterns,
    offline,
    setComparisonModalOpen,
    comparisonModalOpen,
    showObvChart,
    setShowObvChart,
    setObvInfoShown,
  } = useContext(AppContext);

  // Styling
  const classes = useStyles();

  // State used to force a re-render of the page
  const [random, setRandom] = useState(Math.random());
  // State that contains the data received from the API
  const [ohlc, setOHLC] = useState([{}]);
  // State that keeps track if the analysis must be plotted in the candlestick
  const [plotAnalysis, setPlotAnalysis] = useState(false);
  // State that shows which plot must be shown in the compare dialog
  const [compareChart, setCompareChart] = useState("candlestick");
  // State that keeps track of the snackbar about the loading time OBV
  const [snackOpen, setSnackOpen] = React.useState(false);

  // Repsponsible for rendering
  useEffect(() => {
    setShowObvChart(false);
    reFetch(coinList, offline);
    setCandlestickPatterns([]);
    setShowPatterns(false);
  }, [coinList, setCoinList, props.days, setRandom, props.currency, offline]);

  // Function with the API calls
  async function reFetch(coinList, offline) {
    axios
      .get("/OHLC_data", {
        params: {
          coins: coinList,
          days: props.days,
          offline: offline,
        },
        type: "GET",
      })
      .then((data) => {
        setOHLC(data.data);
      });
  }

  // Function that return the right currency parameter to use for querying the API
  function current_currency() {
    if (props.currency === "Euro") {
      return "eur";
    } else if (props.currency === "USD") {
      return "usd";
    } else {
      return "gbp";
    }
  }

  // Function that makes the string start with a capital letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Function called in the trendline menu to remove dates.
  function onRemoveDate(index) {
    trendLineData.splice(index, 1);
    setTrendLineData(trendLineData);
    setRandom(Math.random());
  }

  // Used by the snackbar to warn the user about the loading time
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Close function of the snackbar component
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  // This renders the cards for each coin. It contains the Candlestick chart of the coin.
  const renderCoinCards = (ohlc) => {
    const renderCoinCard = coinList.map((name, i) => {
      return (
        <Grid item xs={18} style={{ marginTop: "10px" }}>
          <Card variant="outlined">
            <Grid container justifyContent="left" style={{ margin: "30px" }}>
              <Grid item xs={12}>
                <CardContent>
                  <Typography
                    variant="h4"
                    component="h2"
                    style={{ marginLeft: "30px", marginTop: "10px" }}
                  >
                    {/*name of the coin*/}
                    {capitalizeFirstLetter(name)}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid
                item
                xs={9}
                md={9}
                justifyContent="center"
                alignItems="center"
              >
                {/*Calls the function to render the Candlestick chart*/}
                <CandlestickChart
                  name={name}
                  ohlc={ohlc}
                  currency={current_currency()}
                  days={props.days}
                  allowAnalysis={true}
                />
                {/*Calls the function to render the Volume chart*/}
                <VolumeChart
                  name={name}
                  ohlc={ohlc}
                  currency={current_currency()}
                />
                {/* Calls the component that contains the OBV indicator chart */}
                {showObvChart && (
                  <ObvIndicatorChart
                    name={name}
                    days={props.days}
                    currency={current_currency()}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={2}
                md={2}
                justifyContent="center"
                alignItems="center"
                style={{ marginLeft: "15px" }}
              >
                <div>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Compare selected coins</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div style={{ marginBottom: 10 }}>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <InputLabel id="currency-selectlabel">
                            Chart
                          </InputLabel>
                          <Select
                            labelId="currency-select-label"
                            id="currency-select"
                            value={compareChart}
                            onChange={(e) => setCompareChart(e.target.value)}
                            label="Currency"
                          >
                            <MenuItem value={"candlestick"}>
                              Candlestick
                            </MenuItem>
                            <MenuItem value={"volume"}>Volume</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={plotAnalysis}
                                onChange={() => setPlotAnalysis(!plotAnalysis)}
                              />
                            }
                            label="Plot analysis in charts"
                          />
                        </FormGroup>
                      </div>
                      {/* The coin comparison card */}
                      {coinList.length < 2 && (
                        <>
                          <Typography style={{ marginBottom: "10px" }}>
                            Need two coins to do a comparison{" "}
                          </Typography>
                        </>
                      )}
                      <Button
                        onClick={() => setComparisonModalOpen(true)}
                        variant="contained"
                        disabled={coinList.length < 2}
                      >
                        Show comparison
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Trendline</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* the trendline card */}
                      <div className={classes.accordionContent}>
                        <Typography>Extend trendline by:</Typography>
                        <TextField
                          id="outlined-number"
                          label="Days (optional)"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          style={{ marginTop: "10px" }}
                          value={trendLineExtension}
                          onChange={(e) => {
                            e.target.value >= 1 &&
                              setTrendLineExtension(e.target.value);
                          }}
                        />
                      </div>
                      <div className={classes.accordionContent}>
                        {trendLineData.length > 0 && (
                          <Typography style={{ marginTop: "5px" }}>
                            Dates:
                          </Typography>
                        )}
                        {trendLineData.map((i) => {
                          return (
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="left"
                            >
                              <Grid item md={8} style={{ marginTop: "5px" }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<DeleteIcon />}
                                  onClick={() =>
                                    onRemoveDate(trendLineData.indexOf(i))
                                  }
                                >
                                  <Typography variant="h6" component="div">
                                    {moment(i.x).format("L").toString()}
                                  </Typography>
                                </Button>
                              </Grid>
                            </Grid>
                          );
                        })}
                        {trendLineData.length === 0 && (
                          <Typography style={{ marginTop: "5px" }}>
                            Select datapoints to draw the trendline
                          </Typography>
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Moving average</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* The moving average setttings card */}
                      <MovingAverageSettings />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Candlestick patterns</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* The candlestick pattern card */}
                      <CandlestickPatternRecognition
                        name={name}
                        ohlc={ohlc}
                        currency={current_currency()}
                      />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>On-Balance Volume Indicator</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* The OBV indicator card */}
                      <Button
                        onClick={() => {
                          setShowObvChart(!showObvChart);
                          if (showObvChart === false) {
                            setSnackOpen(true);
                          }
                        }}
                        variant="contained"
                        style={{ marginBottom: "15px" }}
                      >
                        {showObvChart ? "Hide plot" : "Show plot"}
                      </Button>
                      {/* Button that opens an info dialog */}
                      <IconButton
                        aria-label="info"
                        style={{ margin: "10px", marginBottom: "20px" }}
                        onClick={() => {
                          setObvInfoShown(true)
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                      <Typography>
                        The OBV indicator will be shown in a chart below the
                        volume plot.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      );
    });

    return renderCoinCard;
  };

  return (
    <>
      {renderCoinCards(ohlc)}
      <CoinComparisonDialog
        compareModalOpen={comparisonModalOpen}
        onCloseCompareModal={() => setComparisonModalOpen(false)}
        ohlc={ohlc}
        currency={current_currency()}
        days={props.days}
        allowAnalysis={plotAnalysis}
        type={compareChart}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackOpen}
        autoHideDuration={600}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Loading.... This may take a few seconds
        </Alert>
      </Snackbar>
    </>
  );
};

export default GeneralAnalysisPage;
