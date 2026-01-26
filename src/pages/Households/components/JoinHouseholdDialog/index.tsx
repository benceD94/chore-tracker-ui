import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";

export interface JoinHouseholdDialogProps {
  open: boolean;
  onClose: () => void;
  onJoin: (householdId: string) => void;
}

export const JoinHouseholdDialog: React.FC<JoinHouseholdDialogProps> = ({ onJoin, onClose, open }) => {
  const [householdId, setHouseholdId] = useState('');

  const handleClose = () => {
    setHouseholdId('');
    onClose();
  };

  const handleJoin = () => {
    if (householdId.trim()) {
      onJoin(householdId.trim());
      setHouseholdId('');
    }
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Join Household</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter the household ID you received from another household member to join their household.
        </Typography>
        <TextField
          id="householdId"
          label="Household ID"
          variant="outlined"
          fullWidth
          value={householdId}
          onChange={(e) => setHouseholdId(e.target.value)}
          placeholder="e.g., abc123xyz..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleJoin}
          variant="contained"
          disabled={!householdId.trim()}
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}
