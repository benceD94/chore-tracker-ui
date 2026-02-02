import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  Select,
  MenuItem,
  type SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { RegisterChoreDialog, type ChoreSelection } from './components/RegisterChoreDialog';
import { useCreateBatchRegistryMutation } from '../../hooks/mutations';
// import { useSettingsProvider } from '../../authentication/SettingsProvider';
// import { useAuth } from '../../authentication/AuthContext';
import { useRegistryViewQuery } from '../../hooks/queries';
import type { RegistryDateFilter } from '../../api/types';
import { Summary } from './components/Summary';
import { Leaderboard } from './components/Leaderboard';
// import { useToast } from '../../components/ToastProvider';
import { RegisteredChoresList } from './components/RegisteredChoresList';
import { useNavigate } from 'react-router';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../components/ToastProvider/hooks';
import { useAuth } from '../../authentication/AuthContext/hooks';
import { useSettingsProvider } from '../../authentication/SettingsProvider/useSettingsProvider';

enum RegistryDateFilterEnum {
  Today = 'today',
  Yesterday = 'yesterday',
  ThisWeek = 'thisWeek',
  LastWeek = 'lastWeek',
  ThisMonth = 'thisMonth',
  All = 'all',
}

export const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {notify} = useToast();
  const {user} = useAuth();
  const {household} = useSettingsProvider();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filter, setFilter] = useState<RegistryDateFilter>(RegistryDateFilterEnum.Today);
  const { data: choresDone = [] } = useRegistryViewQuery(household?.id || null, filter);

  const createBatchRegistryMutation = useCreateBatchRegistryMutation(household?.id || '');

  const [isChoreDialogOpen, setIsChoreDialogOpen] = useState(false);

  const handleDateFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as RegistryDateFilter)
  }

  const handleCloseChoreDialog = () => {
    setIsChoreDialogOpen(false);
  }

  const handleSaveChoreDialog = (selections: ChoreSelection[]) => {
    if (!household || !user || selections.length === 0) return;

    createBatchRegistryMutation.mutate(
      {
        chores: selections.map(s => ({
          choreId: s.choreId,
          userId: user.uid,
          times: s.times,
        })),
      },
      {
        onSuccess: () => {
          const totalChores = selections.reduce((sum, s) => sum + s.times, 0);
          notify.success(`${totalChores} chore${totalChores > 1 ? 's' : ''} registered`);
          setIsChoreDialogOpen(false);
        },
        onError: () => {
          notify.error('Chore register failed');
        },
      }
    );
  }

  const registerButton = (size: 'small' | 'medium' | 'large' = 'medium') => <Button variant="contained" size={size} startIcon={<Add />} onClick={() => setIsChoreDialogOpen(true)}>Register Chore</Button>;

  if (!household) {
    return (
      <EmptyState
        title="No Household Found"
        description="You need to create or join a household before you can start tracking chores. Head over to the Household page to get started."
        onAction={() => navigate('/household')}
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Stack sx={{ mb: 4 }} flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">Dashboard</Typography>
        <Box>
          <Select
            sx={{mr: 4}}
            size="small"
            labelId="date-filter-label"
            id="date-filter"
            value={filter}
            onChange={handleDateFilterChange}
          >
            {Object.values(RegistryDateFilterEnum).map((dateFilter) => <MenuItem value={dateFilter} key={dateFilter}>{dateFilter}</MenuItem>)}
          </Select>
          {!isMobile && registerButton('medium')}
        </Box>
      </Stack>

      <Summary entries={choresDone} />

      <Grid container spacing={3}>
        <RegisteredChoresList choresDone={choresDone} />
        <Leaderboard entries={choresDone} />
      </Grid>
      {isMobile && <Box sx={{position: 'fixed', bottom: 10, left: 'calc(50% - 105px)'}}>{registerButton('large')}</Box>}
      <RegisterChoreDialog
        open={isChoreDialogOpen}
        onClose={handleCloseChoreDialog}
        onSave={handleSaveChoreDialog}
      />
    </Box>
  );
}
