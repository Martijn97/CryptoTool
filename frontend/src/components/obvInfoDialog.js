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

const ObvInfoDialog = ({ obvInfoDialogOpen, onCloseObvInfoDialog }) => {
  const dialog = (obvInfoDialogOpen, onCloseObvInfoDialog) => {
    return (
      <Dialog
        open={obvInfoDialogOpen}
        onClose={onCloseObvInfoDialog}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          On-Balance Volume Indicator information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5">General</Typography>
            <Typography style={{ marginBottom: "20px" }}>
              The on-balanced volume indicator (OBV) is the plot shown below the
              volume plot. The chart is based on the values of the volume plot
              and the fact that the price increased or decreased at that point.
              If the price of the coin increases than the OBV value increases
              and if the price decreases than the OBV value decreases. The
              amount that it increases or decreases depends on the total volume
              that is traded in that day. In short, the OBV indicator can be
              computed by the following formula:
              <Typography style={{ marginTop: "20px" }}>
                If the closing value of today is higher than the value of
                yesterday then:
              </Typography>
              <Typography>OBV = OBV yesterday + Volume today</Typography>
              <Typography style={{ marginTop: "20px" }}>
                If the closing value of today is lower than the value of
                yesterday then:
              </Typography>
              <Typography>OBV = OBV yesterday – Volume today</Typography>
              <Typography style={{ marginTop: "20px" }}>
                If the closing value of today is equal to the value of yesterday
                then:
              </Typography>
              <Typography>OBV = OBV yesterday</Typography>
            </Typography>
            <Typography variant="h5">Intepretation</Typography>
            <Typography style={{ marginBottom: "20px" }}>
              The OBV precedes price. An increasing OBV reflects a positive
              volume pressure that can lead to a higher price. An decreasing OBV
              is the opposite. An decreasing OBV reflects negative volume
              pressure that can lead to lower prices. So, the OBV value is a
              good forecast for price change. If there seems to be a positive
              trend in the OBV plot that is not shown in the price yet, then
              there is a high chance that the price will break out of its
              resistance soon. This means that the price will go beyond the
              highest price of the current period. The opposite holds for a
              negative trend in the OBV. If there seems to be a negative trend
              in the OBV that is not shown in the price, then there is a high
              chance that the price will decrease.
            </Typography>
            <Typography style={{ marginBottom: "20px" }}>
              Note: It is important to know that the actual value of the OBV
              indicator is not relevant. Only the shape/movement of the OBV plot
              over time is important.
            </Typography>
            <Typography>
              Note: in the case of a large peak in volume. It is better to let
              this index rest for a while before using it for trading decisions
              again.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseObvInfoDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return dialog(obvInfoDialogOpen, onCloseObvInfoDialog);
};

export default ObvInfoDialog;
