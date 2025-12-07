import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onSave, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  
  const handleSave = () => {
    onSave();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>No</Button>
        <Button variant="contained" onClick={handleSave}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}