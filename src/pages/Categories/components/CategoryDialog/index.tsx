import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { CategoryDoc } from "../../../../types/firestore";

export interface CategotyDialogProps {
  open: boolean;
  categoryToEdit?: CategoryDoc;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const CategotyDialog: React.FC<CategotyDialogProps> = ({ open, categoryToEdit, onSave, onClose }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleClose = () => {
    onClose();
  };
  
  const handleSave = () => {
    onSave(categoryName);
  }

  useEffect(() => {
    setCategoryName(categoryToEdit ? categoryToEdit.name : '')
  }, [open, categoryToEdit])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add category</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            label="Category name"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            autoFocus
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}