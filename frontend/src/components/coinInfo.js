import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle } from "@material-ui/core";

const CoinInfoModal = ({ infoModalOpen, onCloseInfoModel, data }) => {
  // Appearence of the info Dialog, will be returned below.
  const dialog = (infoModalOpen) => {
    return (
      <Dialog
        open={infoModalOpen}
        onClose={onCloseInfoModel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Render the HTML returned by the API */}
            <div dangerouslySetInnerHTML={{ __html: data[1] }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseInfoModel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return <>{dialog(infoModalOpen)}</>;
};

export default CoinInfoModal;