import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import type { CategoryDoc } from "../../../../types/firestore";

export interface CategotyDialogProps {
  open: boolean;
  categoryToEdit?: CategoryDoc;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const CategoryDialog: React.FC<CategotyDialogProps> = ({ open, categoryToEdit, onSave, onClose }) => {
  const [categoryName, setCategoryName] = useState(categoryToEdit?.name || '');

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(categoryName);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      key={categoryToEdit?.id || 'new'}
    >
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