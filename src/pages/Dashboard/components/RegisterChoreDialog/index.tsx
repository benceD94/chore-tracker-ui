import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Stack, TextField, type SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import type { ChoreDoc } from "../../../../types/firestore";
import { useSettingsProvider } from "../../../../authentication/SettingsProvider";
import { Delete } from "@mui/icons-material";

export interface ChoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (selectedChore: ChoreDoc) => void;
}

export const RegisterChoreDialog: React.FC<ChoreDialogProps> = ({ open, onSave, onClose }) => {
  const {chores} = useSettingsProvider();
  
  const [selectedChore, setSelectedChore] = useState<ChoreDoc | undefined>();
  // const [choresToRegister, setChoresToRegister] = useState<ChoreDoc[]>([]);

  const handleChoreSelect = (event: SelectChangeEvent) => {
    const slectedChoreId = event.target.value;
    const selectedChore = chores.find((chore) => chore.id === slectedChoreId);

    if (selectedChore) {
      setSelectedChore(selectedChore)
    }
  };

  const handleClose = () => {
    onClose();
  };
  
  const handleSave = () => {
    if (selectedChore) onSave(selectedChore);
  }

  useEffect(() => {
    setSelectedChore(undefined);
    // setChoresToRegister([]);
  }, [open])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack flexDirection="row" justifyContent="space-between">
          <span>Register Chore</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <InputLabel id="chore-category">Chores</InputLabel>
          <Select
            labelId="chore-category"
            id="chore-category-input"
            value={selectedChore?.id || ''}
            onChange={handleChoreSelect}
          >
            {chores.map((chore) => <MenuItem value={chore.id} key={chore.id}>{chore.name}</MenuItem>)}
          </Select>
          {/* <List>
            {choresToRegister.map((chore) => <ListItem
              key={chore.id}
              disablePadding
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteChore(chore)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemText primary={chore.name} secondary={`Points: ${chore.points}`} />
              </ListItemButton>
            </ListItem>)}
          </List> */}
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