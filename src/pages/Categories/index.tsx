import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CategoryDialog } from './components/CategoryDialog';
import { useSettingsProvider } from '../../authentication/SettingsProvider';
import type { CategoryDoc } from '../../types/firestore';
import { createCategory, deleteCategory, updateCategory, loadDefaultCategories } from '../../infra/categories';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { useToast } from '../../components/ToastProvider';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { EmptyCategoriesState } from './components/EmptyCategoriesState/EmptyCategoriesState';

export const CategoriesPage: React.FC = () => {
  const { notify } = useToast();
  const navigate = useNavigate();
  const {household, categories} = useSettingsProvider();

  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToChange, setCategoryToChange] = useState<CategoryDoc | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);

  const handleOpen = (category?: CategoryDoc) => {
    setOpen(true);
    if (category) setCategoryToChange(category);
  };

  const handleClose = () => {
    setOpen(false);
    setCategoryToChange(undefined);
  };

  const handleSave = (name: string) => {
    handleClose();
    setIsLoading(true);
    if (household) {
      if (categoryToChange) {
        updateCategory(household.id, categoryToChange.id, name)
          .then(() => {
            setCategoryToChange(undefined);
            notify.success('Category updated');
          })
          .catch(() => {
            notify.error('Category update failed');
          })
          .finally(() => {
            setIsLoading(false);
          })
      } else {
        createCategory(household.id, name)
          .then(() => {
            notify.success('Category created');
          })
          .catch(() => {
            notify.error('Category creation failed');
          });
      }
    }
  };

  const handleOpenDeleteDialog = (category: CategoryDoc) => {
    setIsDeleteDialogOpen(true);
    setCategoryToChange(category);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToChange(undefined);
  };

  const handleSaveDeleteDialog = () => {
    handleCloseDeleteDialog();
    setIsLoading(true);
    if (household && categoryToChange) {
      deleteCategory(household.id, categoryToChange.id)
        .then(() => {
          setCategoryToChange(undefined);
          setIsLoading(false);
          notify.success('Category deleted');
        })
        .catch(() => {
          notify.error('Category delete failed');
        })
    }
  };

  const handleLoadDefaults = async () => {
    if (!household) return;

    setIsLoadingDefaults(true);
    try {
      await loadDefaultCategories(household.id);
      notify.success('Default categories loaded');
    } catch (err: any) {
      notify.error('Failed to load default categories');
      console.error('Failed to load default categories', err);
    } finally {
      setIsLoadingDefaults(false);
    }
  };

  if (!household) {
    return (
      <EmptyState
        title="No Household Found"
        description="You need to create or join a household before you can manage categories. Head over to the Household page to get started."
        onAction={() => navigate('/household')}
      />
    );
  }

  if (categories.length === 0 && !isLoading) {
    return (
      <>
        <Box sx={{ maxWidth: 960, margin: '0 auto', mb: 4 }}>
          <Typography variant="h5">Categories</Typography>
        </Box>
        <EmptyCategoriesState
          onCreateFromScratch={() => handleOpen()}
          onLoadDefaults={handleLoadDefaults}
          isLoading={isLoadingDefaults}
        />
        <CategoryDialog open={open} onClose={handleClose} onSave={handleSave} categoryToEdit={categoryToChange} />
      </>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h5">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add category
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {isLoading ? <Skeleton variant="rounded" width="100%" height={60} /> : <List disablePadding>
            {categories.map((category, index) => (
              <ListItem
                key={category.id}
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom:
                    index < categories.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }} onClick={() => handleOpen(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(category)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>}
        </CardContent>
      </Card>

      <CategoryDialog open={open} onClose={handleClose} onSave={handleSave} categoryToEdit={categoryToChange} />
      <ConfirmationDialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} onSave={handleSaveDeleteDialog} />
    </Box>
  );
}
