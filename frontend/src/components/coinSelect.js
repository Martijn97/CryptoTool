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
            Select coins below to add it to your analysis. Press done or cancel to continue to the overview page
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
