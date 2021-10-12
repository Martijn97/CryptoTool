import React, { useContext } from "react";
import { AppContext } from "./../context/AppContext";
import { JSONPath } from "jsonpath-plus";
import moment from "moment";
import { Button, Typography } from "@material-ui/core";
import {
  shootingStar,
  bearishKicker,
  bullishKicker,
  bullishEngulfing,
  bearishEngulfing,
  bullishHarami,
  bearishHarami,
} from "../patterns";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const CandlestickPatternRecognition = ({ name, ohlc, currency }) => {
  const {
    setCandlestickPatterns,
    showPatterns,
    setShowPatterns,
    setPatternInfoModalOpen,
  } = useContext(AppContext);
  const nameCoin = name;

  // Slice the data in a certain currency of a specific coin from the entire dataset
  const ohlc_values_coin = JSONPath({
    path: "$.[ohlc].[" + name + "].[" + currency + "].*",
    json: ohlc,
  });

  // Format the ohlc dataset to use the candlesticks pattern package
  const patternRecognitionData = (ohlc_values_coin) => {
    const data = [];
    ohlc_values_coin.map((i) => {
      return data.push({
        date: moment(i[0]).format("YYYY-MM-DD HH:mm:ss"),
        open: i[1],
        high: i[2],
        low: i[3],
        close: i[4],
        y: (i[1]+i[4])/2,
      });
    });

    return data;
  };

  // Compute the patterns and store them.
  const recognizePatterns = (data) => {
    const patterns = [];

    const shootingStars = patterns.push({
      name: "Shooting Star",
      data: shootingStar(data),
    });
    const bullishKickers = patterns.push({
      name: "Bullish Kicker",
      data: bullishKicker(data),
    });
    const bearishKickers = patterns.push({
      name: "Bearish Kicker",
      data: bearishKicker(data),
    });
    const bullishEngulfings = patterns.push({
      name: "Bullish Engulfing",
      data: bullishEngulfing(data),
    });
    const bearishEngulfings = patterns.push({
      name: "Bearish Engulfing",
      data: bearishEngulfing(data),
    });
    const bullishHaramis = patterns.push({
      name: "Bullish Harami",
      data: bullishHarami(data),
    });
    const bearishHaramis = patterns.push({
      name: "Bearish Harami",
      data: bearishHarami(data),
    });
    // TODO look into error Hammer and invertedHammer

    return (
      <>
        <Button
          onClick={() => {
            // set state to show the patterns
            setShowPatterns(!showPatterns);
            // pushes the patterns into a state
            setCandlestickPatterns((candlestickPatterns) => {
              return [
                ...candlestickPatterns,
                { name: nameCoin, data: patterns },
              ];
            });
          }}
          variant="contained"
          style={{ marginBottom: "15px" }}
        >
          {showPatterns ? "Hide patterns" : "Flag patterns"}
        </Button>
        <IconButton 
          aria-label="info"
          style={{margin: "10px", marginBottom: "20px"}}
          onClick={() => {setPatternInfoModalOpen(true)}}
        >
          <InfoIcon />
        </IconButton>
        {patterns.map((i) => {
          return (
            // Show for each pattern type the number of occurences
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  {i.name}: {i.data.length}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Show the dates a pattern occures */}
                {i.data.map((i) => {
                  return <Typography>{i.date}</Typography>;
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </>
    );
  };

  return recognizePatterns(patternRecognitionData(ohlc_values_coin));
};

export default CandlestickPatternRecognition;
