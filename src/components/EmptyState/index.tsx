import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel = 'Go to Household',
  onAction,
}) => {
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: 3
      }}>
        <Avatar
          sx={{
            bgcolor: 'warning.main',
            width: 80,
            height: 80,
            mb: 3
          }}
        >
          <Home sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          {description}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </Box>
    </Box>
  );
}
