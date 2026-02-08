import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onSave: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title = 'Are you sure?',
  message,
  onSave,
  onClose,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleSave}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
