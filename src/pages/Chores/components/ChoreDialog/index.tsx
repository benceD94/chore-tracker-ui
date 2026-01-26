import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField, type SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import type { ChoreDoc } from "../../../../types/firestore";
import type { ChoreInput } from "../..";
import { useSettingsProvider } from "../../../../authentication/SettingsProvider";

export interface ChoreDialogProps {
  open: boolean;
  choreToEdit?: ChoreDoc;
  onClose: () => void;
  onSave: (chore: ChoreInput) => void;
}

export const ChoreDialog: React.FC<ChoreDialogProps> = ({ open, choreToEdit, onSave, onClose }) => {
  const {categories} = useSettingsProvider();
  
  const [choreName, setChoreName] = useState('');
  const [chorePoints, setChorePoints] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const handleCategorySelect = (event: SelectChangeEvent) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

    if (selectedCategory) {
      setCategoryId(selectedCategory.id);
      setCategoryName(selectedCategory.name);
    }
  };

  const handleClose = () => {
    onClose();
  };
  
  const handleSave = () => {
    onSave({
      name: choreName,
      categoryName,
      categoryId,
      points: chorePoints,
    });
  }

  useEffect(() => {
    if (choreToEdit) {
      setChoreName(choreToEdit.name);
      setChorePoints(choreToEdit.points ?? 1);
      setCategoryName(choreToEdit.categoryName ?? '');
      setCategoryId(choreToEdit.categoryId ?? '');
    } else {
      setChoreName('');
      setChorePoints(1);
      setCategoryName('');
      setCategoryId('');
    }
  }, [open, choreToEdit])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add chore</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Chore name"
            fullWidth
            value={choreName}
            onChange={(e) =>
              setChoreName(e.target.value)
            }
          />
          <TextField
            label="Points"
            type="number"
            fullWidth
            value={chorePoints}
            onChange={(e) =>
              setChorePoints(Number(e.target.value))
            }
          />
          <InputLabel id="chore-category">Category</InputLabel>
          <Select
            labelId="chore-category"
            id="chore-category-input"
            value={categoryId}
            onChange={handleCategorySelect}
            label="Age"
          >
            {categories.map((category) => <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>)}
          </Select>
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