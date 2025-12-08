import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { HouseholdDoc } from "../../../../types/firestore";

export interface HouseholdDialogProps {
  open: boolean;
  isEdit: boolean;
  household: HouseholdDoc | null;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const HouseholdDialog: React.FC<HouseholdDialogProps> = ({ onSave, onClose, open, isEdit, household }) => {
  const [householdName, setHouseholdName] = useState('');

  const handleClose = () => {
    onClose();
  };
  
  const handleSave = () => {
    onSave(householdName);
  }
  
  useEffect(() => {
    setHouseholdName(isEdit && household ? household.name : '')
  }, [open, isEdit, household])

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create new Household</DialogTitle>
      <DialogContent>
        <TextField id="name" label="Name" variant="outlined" value={householdName} onChange={(e) => setHouseholdName(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}