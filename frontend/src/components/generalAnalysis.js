import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  makeStyles,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import {
  TextField,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import moment from "moment";
import VolumeChart from "./volumeChart";
import CandlestickChart from "./candlestickChart";

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
    trendLineExtension,
    setTrendLineExtension,
    trendLineData,
    setTrendLineData,
    timespan,
    setTimespan,
    setShowMovingAverage,
    showMovingAverage,
  } = useContext(AppContext);

  // Styling
  const classes = useStyles();

  // State used to force a re-render of the page
  const [random, setRandom] = useState(Math.random());
  // State that contains the data received from the API
  const [ohlc, setOHLC] = useState([{}]);

  // Repsponsible for rendering
  useEffect(() => {
    reFetch(coinList);
  }, [coinList, props.days, setRandom]);

  // Function with the API calls
  async function reFetch(coinList) {
    axios
      .get("/OHLC_data", {
        params: {
          coins: coinList,
          days: props.days,
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
                />
                {/*Calls the function to render the Volume chart*/}
                <VolumeChart
                  name={name}
                  ohlc={ohlc}
                  currency={current_currency()}
                />
              </Grid>
              <Grid
                item
                xs={2}
                md={2}
                justifyContent="center"
                alignItems="center"
              >
                <div>
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
                      {/* The moving average card */}

                      <div className={classes.accordionContent}>
                        <Typography>Timespan:</Typography>
                        <FormControl
                          variant="outlined"
                          style={{ marginTop: "10px" }}
                        >
                          <InputLabel id="period-select-label">
                            Period
                          </InputLabel>
                          <Select
                            id="period-select"
                            value={timespan}
                            label="Period (optional)"
                            style={{width:"200px"}}
                            onChange={(e) => setTimespan(e.target.value)}
                          >
                            <MenuItem value={"day"}>Day</MenuItem>
                            <MenuItem value={"month"}>Month</MenuItem>
                            <MenuItem value={"year"}>Year</MenuItem>
                          </Select>
                          <div style={{ marginTop: "10px" }}>
                            <Button
                              onClick={() =>
                                setShowMovingAverage(!showMovingAverage)
                              }
                              variant="contained"
                            >
                              { showMovingAverage ? "Hide plot" : "Show plot" }
                            </Button>
                          </div>
                        </FormControl>
                      </div>
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

  return renderCoinCards(ohlc);
};

export default GeneralAnalysisPage;
