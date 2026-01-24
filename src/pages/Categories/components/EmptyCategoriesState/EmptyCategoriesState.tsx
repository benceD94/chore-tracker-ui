import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { Category, Add } from '@mui/icons-material';

export interface EmptyCategoriesStateProps {
  onCreateFromScratch: () => void;
  onLoadDefaults: () => void;
  isLoading?: boolean;
}

export const EmptyCategoriesState: React.FC<EmptyCategoriesStateProps> = ({
  onCreateFromScratch,
  onLoadDefaults,
  isLoading = false,
}) => {
  return (
    <Box sx={{ maxWidth: 960, margin: '0 auto' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        px: 3
      }}>
        <Avatar
          sx={{
            bgcolor: 'primary.light',
            width: 80,
            height: 80,
            mb: 3
          }}
        >
          <Category sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h5" gutterBottom>
          No Categories Yet
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Get started by creating your first category or load a predefined list of common household categories.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Add />}
            onClick={onCreateFromScratch}
            disabled={isLoading}
            sx={{ minWidth: 180 }}
          >
            Start from Scratch
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={onLoadDefaults}
            disabled={isLoading}
            sx={{ minWidth: 180 }}
          >
            {isLoading ? 'Loading...' : 'Load Defaults'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
