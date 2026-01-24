import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { Assignment, Add } from '@mui/icons-material';

export interface EmptyChoresStateProps {
  onCreateFromScratch: () => void;
  onLoadDefaults: () => void;
  isLoading?: boolean;
  hasCategories: boolean;
}

export const EmptyChoresState: React.FC<EmptyChoresStateProps> = ({
  onCreateFromScratch,
  onLoadDefaults,
  isLoading = false,
  hasCategories,
}) => {
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
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
          <Assignment sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h5" gutterBottom>
          No Chores Yet
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          {hasCategories
            ? 'Get started by creating your first chore or load a predefined list of common household chores.'
            : 'You need to create some categories first before you can add chores.'}
        </Typography>

        {hasCategories && (
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
        )}
      </Box>
    </Box>
  );
}
