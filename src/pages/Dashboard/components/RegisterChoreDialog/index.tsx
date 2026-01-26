import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Chip,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Add, Check, Search } from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";
import type { ChoreDoc } from "../../../../types/firestore";
import { useSettingsProvider } from "../../../../authentication/SettingsProvider";

export interface ChoreSelection {
  choreId: string;
  points: number;
  times: number;
}

export interface ChoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (selections: ChoreSelection[]) => void;
}

interface ChoreChipProps {
  name: string;
  selected: boolean;
  count?: number;
  onClick: () => void;
}

const ChoreChip: React.FC<ChoreChipProps> = ({ name, selected, count = 0, onClick }) => {
  const icon = selected
    ? count > 1
      ? <Box component="span" sx={{ bgcolor: 'rgba(255,255,255,0.3)', px: 1, py: 0.25, borderRadius: 1, fontSize: '0.85rem', fontWeight: 'bold' }}>{count}x</Box>
      : <Check sx={{ fontSize: 18 }} />
    : <Add sx={{ fontSize: 18 }} />;

  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <span>{name}</span>
        </Box>
      }
      onClick={onClick}
      color={selected ? "success" : "primary"}
    />
  );
};

export const RegisterChoreDialog: React.FC<ChoreDialogProps> = ({ open, onSave, onClose }) => {
  const { chores } = useSettingsProvider();

  // Map of choreId -> times selected
  const [selections, setSelections] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");

  const handleChoreClick = (chore: ChoreDoc) => {
    setSelections(prev => {
      const newSelections = new Map(prev);
      const currentCount = newSelections.get(chore.id) || 0;
      newSelections.set(chore.id, currentCount + 1);
      return newSelections;
    });
  };

  const handleClearChore = (choreId: string) => {
    setSelections(prev => {
      const newSelections = new Map(prev);
      newSelections.delete(choreId);
      return newSelections;
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    const choreSelections: ChoreSelection[] = [];
    selections.forEach((times, choreId) => {
      const chore = chores.find(c => c.id === choreId);
      if (chore) {
        choreSelections.push({
          choreId,
          points: chore.points ?? 0,
          times,
        });
      }
    });
    onSave(choreSelections);
  };

  const totalPoints = useMemo(() => {
    let total = 0;
    selections.forEach((times, choreId) => {
      const chore = chores.find(c => c.id === choreId);
      if (chore) {
        total += (chore.points ?? 0) * times;
      }
    });
    return total;
  }, [selections, chores]);

  const filteredChores = useMemo(() => {
    if (!searchQuery.trim()) return chores;
    const query = searchQuery.toLowerCase();
    return chores.filter(chore =>
      chore.name.toLowerCase().includes(query)
    );
  }, [chores, searchQuery]);

  // Separate selected and unselected chores in a single loop
  const sortedChores = useMemo(() => {
    const selected: typeof filteredChores = [];
    const unselected: typeof filteredChores = [];
    filteredChores.forEach((chore) => {
      if (selections.has(chore.id)) {
        selected.push(chore);
      } else {
        unselected.push(chore);
      }
    });
    return { selected, unselected };
  }, [filteredChores, selections]);

  useEffect(() => {
    setSelections(new Map());
    setSearchQuery("");
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <span>What chores have you done today?</span>
          {totalPoints > 0 && (
            <Typography variant="body1" color="primary">
              {totalPoints} points
            </Typography>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            placeholder="Search"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}>
            {/* Selected chores first */}
            {sortedChores.selected.map((chore) => {
              const count = selections.get(chore.id) || 0;
              return (
                <Box key={chore.id}>
                  <ChoreChip
                    name={chore.name}
                    selected={true}
                    count={count}
                    onClick={() => handleChoreClick(chore)}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'warning.main',
                      cursor: 'pointer',
                      mt: 0.5,
                      ml: 1,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    onClick={() => handleClearChore(chore.id)}
                  >
                    Clear "{chore.name}"
                  </Typography>
                </Box>
              );
            })}

            {/* Unselected chores */}
            {sortedChores.unselected.map((chore) => (
              <Box key={chore.id}>
                <ChoreChip
                  name={chore.name}
                  selected={false}
                  onClick={() => handleChoreClick(chore)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={selections.size === 0}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
