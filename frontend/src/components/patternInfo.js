import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle } from "@material-ui/core";

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
              <DialogContentText></DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClosePatternInfoModal} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        );
      };

    return dialog(patternInfoModalOpen.patternInfoModalOpen, patternInfoModalOpen.onClosePatternInfoModal)
};

export default PatternInfoModal;