import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
} from "@material-ui/core";
import Chart from "react-apexcharts";
import { AppContext } from "../context/AppContext";
import axios from "axios";

// Dialog on the overview page. Appears when the users presses the select coins button.
const CoinSelector = ({ coinManagerOpen, onCloseCoinManager }) => {
  // Global states from the context
  const { coinList, setCoinList } = useContext(AppContext);
  // State that keeps the data from the API
  const [ coinSelection, setCoinSelection ] = useState();

  // Repsponsible for rendering
  useEffect(() => {
    reFetch();
  }, []);

  // Retrieves the data of the overview page
  async function reFetch() {
    axios
      .get("/coin_selection_data", {
        type: "GET",
      })
      .then((data) => {
        setCoinSelection(data);
      });
  }

  // Function that adds the colours to the Treemap based on the growth in the last 24h
  function coloursTreeMap(coinSelection) {
    const colours = []

    coinSelection?.data.map((item) => {

      // Compute the opacity and places a minimum opacity of 0.2
      const opacity = 0.2 + (15 * (Math.abs(item.price_change_percentage_24h)/100));

      // Add colour to the array of colours
      item.price_change_percentage_24h < 0 ? colours.push("rgba(255, 0, 0," + opacity + ")") : colours.push("rgba(0, 128, 0," + opacity + ")");
    })

    // return the array back to the TreeMap
    return colours
  };

  // Transforms the data into the right format for the Treemap
  const transformDataSyntax = () => {
    const coin_selection_list = []

    coinSelection?.data.map((i) => {
      return coin_selection_list.push({'x': i.id, 'y': i.market_cap})
    })
    
    return coin_selection_list
  }

  // Settings and data of the Treemap
  const state = {
    series: [
      {
        data: transformDataSyntax(),
      },
    ],
    options: {
      legend: {
        show: false,
      },
      colors: coloursTreeMap(coinSelection),
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      },
      chart: {
        type: "treemap",
        toolbar: {
          show: false,
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            setCoinList((coinList) => {
              return [
                ...coinList,
                config.w.config.series[0].data[config.dataPointIndex].x,
              ];
            });
            onCloseCoinManager();
          },
        },
      },
    },
  };

  // Appearence of the Dialog, will be returned below.
  const dialog = (coinManagerOpen) => {
    return (
      <Dialog
        open={coinManagerOpen}
        onClose={onCloseCoinManager}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select coins</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select coins below to add it to your analysis. The colour of the coins represents the positive or negative growth in the last 24 hours.
            Press done or cancel to continue to the overview page
          </DialogContentText>
          <InputLabel id="demo-simple-select-label">Coins:</InputLabel>
          {/* The treemap */}
          <Chart options={state.options} series={state.series} type="treemap" />
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseCoinManager} color="primary">
            Cancel
          </Button>
          <Button onClick={onCloseCoinManager} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return <>{dialog(coinManagerOpen)}</>;
};

export default CoinSelector;
