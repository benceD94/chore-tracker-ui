import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSettingsProvider } from '../../authentication/SettingsProvider';
import type { ChoreDoc } from '../../types/firestore';
import { ChoreDialog } from './components/ChoreDialog';
import { createChore, deleteChore, updateChore, loadDefaultChores } from '../../infra/chore';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { useToast } from '../../components/ToastProvider';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { EmptyChoresState } from '../../components/EmptyState/EmptyChoresState';

const categoryColors: Record<string, string> = {
  Kitchen: 'primary',
  Cleaning: 'secondary',
  General: 'default',
  Outdoor: 'success',
};

export type ChoreInput = {
  name: string,
  categoryName: string,
  categoryId: string,
  points: number,
};

export const ChoresPage: React.FC = () => {
  const { notify } = useToast();
  const navigate = useNavigate();
  const {household, chores, categories} = useSettingsProvider();

  const [open, setOpen] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [choreToChange, setChoreToChange] = useState<ChoreDoc | undefined>(undefined);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  
  const handleOpen = (chore?: ChoreDoc) => {
    setOpen(true);
    if (chore) setChoreToChange(chore);
  };

  const handleClose = () => {
    setOpen(false);
    setChoreToChange(undefined);
  };

  const handleSave = (newChore: ChoreInput) => {
    handleClose();
    setIsLoading(true);
    if (household) {
      if (choreToChange) {
        updateChore(household.id, choreToChange.id, newChore)
          .then(() => {
            setChoreToChange(undefined);
            notify.success('Chore updated');
          })
          .catch(() => {
            notify.error('Chore update failed');
          })
          .finally(() => {
            setIsLoading(false);
          })
      } else {
        createChore(household.id, newChore)
          .then(() => {
            notify.success('Chore created');
          })
          .catch(() => {
            notify.error('Chore creation failed');
          })
      }
    }
  };

  const handleOpenDeleteDialog = (chore: ChoreDoc) => {
    setIsDeleteDialogOpen(true);
    setChoreToChange(chore);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setChoreToChange(undefined);
  };

  const handleSaveDeleteDialog = () => {
    handleCloseDeleteDialog();
    setIsLoading(true);
    if (household && choreToChange) {
      deleteChore(household.id, choreToChange.id)
        .then(() => {
          setChoreToChange(undefined);
          notify.success('Chore deleted');
        })
        .catch(() => {
          notify.error('Chore deletion failed');
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  };

  const handleLoadDefaults = async () => {
    if (!household) return;

    setIsLoadingDefaults(true);
    try {
      await loadDefaultChores(household.id);
      notify.success('Default chores loaded');
    } catch (err: any) {
      notify.error('Failed to load default chores');
      console.error('Failed to load default chores', err);
    } finally {
      setIsLoadingDefaults(false);
    }
  };

  if (!household) {
    return (
      <EmptyState
        title="No Household Found"
        description="You need to create or join a household before you can manage chores. Head over to the Household page to get started."
        onAction={() => navigate('/household')}
      />
    );
  }

  if (chores.length === 0) {
    return (
      <>
        <Box sx={{ maxWidth: 1200, margin: '0 auto', mb: 4 }}>
          <Typography variant="h5">Chores</Typography>
        </Box>
        <EmptyChoresState
          onCreateFromScratch={() => handleOpen()}
          onLoadDefaults={handleLoadDefaults}
          isLoading={isLoadingDefaults}
          hasCategories={categories.length > 0}
        />
        <ChoreDialog
          open={open}
          choreToEdit={choreToChange}
          onClose={handleClose}
          onSave={handleSave}
        />
      </>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h5">Chores</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add chore
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Chore name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chores.map((chore) => (
              <TableRow key={chore.id} hover>
                <TableCell>{chore.name}</TableCell>
                <TableCell>
                  <Chip
                    label={chore.categoryName}
                    size="small"
                    color={
                      categoryColors[chore.categoryName] as
                        | 'default'
                        | 'primary'
                        | 'secondary'
                        | 'success'
                    }
                  />
                </TableCell>
                <TableCell align="right">{chore.points}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="edit" onClick={() => handleOpen(chore)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" aria-label="delete" onClick={() => handleOpenDeleteDialog(chore)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ChoreDialog
        open={open}
        choreToEdit={choreToChange}
        onClose={handleClose}
        onSave={handleSave}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSave={handleSaveDeleteDialog}
      />
    </Box>
  );
}
