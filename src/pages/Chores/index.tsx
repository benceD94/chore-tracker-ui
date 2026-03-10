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
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSettingsProvider } from '../../authentication/SettingsProvider/hooks';
import type { ChoreResponseDto } from '../../api/types';
import { ChoreDialog } from './components/ChoreDialog';
import {
  useCreateChoreMutation,
  useUpdateChoreMutation,
  useDeleteChoreMutation
} from '../../hooks/mutations';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { useToast } from '../../components/ToastProvider/hooks';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';

type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning';

const chipColors: ChipColor[] = ['primary', 'secondary', 'success', 'info', 'warning', 'default'];

const getCategoryColor = (categoryName: string): ChipColor => {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return chipColors[Math.abs(hash) % chipColors.length];
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
  const {household, chores} = useSettingsProvider();

  const createChoreMutation = useCreateChoreMutation(household?.id || '');
  const updateChoreMutation = useUpdateChoreMutation(household?.id || '');
  const deleteChoreMutation = useDeleteChoreMutation(household?.id || '');

  const isLoading = createChoreMutation.isPending || updateChoreMutation.isPending || deleteChoreMutation.isPending;

  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [choreToChange, setChoreToChange] = useState<ChoreResponseDto | undefined>(undefined);
  
  const handleOpen = (chore?: ChoreResponseDto) => {
    setOpen(true);
    if (chore) setChoreToChange(chore);
  };

  const handleClose = () => {
    setOpen(false);
    setChoreToChange(undefined);
  };

  const handleSave = (newChore: ChoreInput) => {
    if (!household) return;

    if (choreToChange) {
      updateChoreMutation.mutate(
        {
          id: choreToChange.id,
          data: {
            name: newChore.name,
            categoryId: newChore.categoryId,
            points: newChore.points,
            description: newChore.categoryName, // Temporary: categoryName stored in description
          }
        },
        {
          onSuccess: () => {
            notify.success('Chore updated');
            handleClose();
            setChoreToChange(undefined);
          },
          onError: () => {
            notify.error('Chore update failed');
          },
        }
      );
    } else {
      createChoreMutation.mutate(
        {
          name: newChore.name,
          categoryId: newChore.categoryId,
          points: newChore.points,
          description: newChore.categoryName, // Temporary: categoryName stored in description
        },
        {
          onSuccess: () => {
            notify.success('Chore created');
            handleClose();
          },
          onError: () => {
            notify.error('Chore creation failed');
          },
        }
      );
    }
  };

  const handleOpenDeleteDialog = (chore: ChoreResponseDto) => {
    setIsDeleteDialogOpen(true);
    setChoreToChange(chore);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setChoreToChange(undefined);
  };

  const handleSaveDeleteDialog = () => {
    if (!household || !choreToChange) return;

    deleteChoreMutation.mutate(choreToChange.id, {
      onSuccess: () => {
        notify.success('Chore deleted');
        handleCloseDeleteDialog();
        setChoreToChange(undefined);
      },
      onError: () => {
        notify.error('Chore deletion failed');
      },
    });
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

      {isLoading ? (
        <Skeleton variant="rounded" width="100%" height={200} />
      ) : chores.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No chores yet. Click "Add chore" to get started.
          </Typography>
        </Paper>
      ) : (
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
                      label={chore.categoryName ?? 'Unknown'}
                      size="small"
                      color={getCategoryColor(chore.categoryName ?? 'Unknown')}
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
      )}

      <ChoreDialog
        open={open}
        choreToEdit={choreToChange}
        onClose={handleClose}
        onSave={handleSave}
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete chore"
        message={choreToChange ? `Are you sure you want to delete "${choreToChange.name}"? This cannot be undone.` : undefined}
        onClose={handleCloseDeleteDialog}
        onSave={handleSaveDeleteDialog}
      />
    </Box>
  );
}
