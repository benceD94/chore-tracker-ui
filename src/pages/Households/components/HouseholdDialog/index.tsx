import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import type { HouseholdDoc } from "../../../../types/firestore";

export interface HouseholdDialogProps {
  open: boolean;
  isEdit: boolean;
  household: HouseholdDoc | null;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const HouseholdDialog: React.FC<HouseholdDialogProps> = ({ onSave, onClose, open, isEdit, household }) => {
  const [householdName, setHouseholdName] = useState(isEdit && household ? household.name : '');

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(householdName);
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      key={household?.id || 'new'}
    >
      <DialogTitle>{isEdit ? 'Edit Household' : 'Create New Household'}</DialogTitle>
      <DialogContent>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          fullWidth
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!householdName.trim()}>
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}