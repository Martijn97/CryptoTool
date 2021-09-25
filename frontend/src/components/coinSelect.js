import React, { useContext } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, InputLabel, MenuItem, Select } from "@material-ui/core";
import { AppContext } from "../context/AppContext";

// Dialog on the overview page. Appears when the users presses the select coins button.
const CoinSelector = ({ coinManagerOpen, onCloseCoinManager }) => {
  // Global states from the context
  const { coinList, setCoinList } = useContext(AppContext);

  // After selecting the coin, it will be added to the coinsList by this function
  const handleOnClick = (coinList, newValue) => {
    setCoinList((coinList) => {
      return [...coinList, newValue];
    });
  };

  // Appearence of the Dialog, will be returned below.
  const dialog = (coinManagerOpen, coinList) => {
    return (
      <Dialog
        open={coinManagerOpen}
        onClose={onCloseCoinManager}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select coins</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Search for cryptocurrencies in the following textfield. Select the
            coin to add it to your analysis.
          </DialogContentText>
          <InputLabel id="demo-simple-select-label">Coin</InputLabel>
          <Select
            fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e, newValue) =>
              handleOnClick(coinList, newValue.props.value)
            }
          >
            <MenuItem value={"bitcoin"}>Bitcoin</MenuItem>
            <MenuItem value={"litecoin"}>Litecoin</MenuItem>
            <MenuItem value={"ethereum"}>Ethereum</MenuItem>
          </Select>
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
