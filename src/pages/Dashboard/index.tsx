import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Stack,
  Button,
  Select,
  MenuItem,
  type SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { RegisterChoreDialog } from './components/RegisterChoreDialog';
import type { ChoreDoc } from '../../types/firestore';
import { registerChoreDone } from '../../infra/chore';
import { useSettingsProvider } from '../../authentication/SettingsProvider';
import { useAuth } from '../../authentication/AuthContext';
import { useRegistryView, RegistryDateFilter } from '../../hooks/useRegistry';
import { Summary } from './components/Summary';
import { Leaderboard } from './components/Leaderboard';
import { useToast } from '../../components/ToastProvider';

export const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const {notify} = useToast();
  const {user} = useAuth();
  const {household} = useSettingsProvider();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filter, setFilter] = useState<RegistryDateFilter>(RegistryDateFilter.Today);
  const { entries: choresDone } = useRegistryView(household?.id || '', filter);

  const [isChoreDialogOpen, setIsChoreDialogOpen] = useState(false);

  const handleDateFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as RegistryDateFilter)
  }

  const handleCloseChoreDialog = () => {
    setIsChoreDialogOpen(false);
  }

  const handleSaveChoreDialog = (selectedChore: ChoreDoc) => {
    setIsChoreDialogOpen(false);
    if (household && user) {
      registerChoreDone({
        householdId: household.id,
        choreId: selectedChore.id,
        userId: user?.uid,
        points: selectedChore.points,
      })
      .then(() => {
        notify.success('Chore registed');
      })
      .catch(() => {
        notify.error('Chore register failed');
      })
    }
  }

  const registerButton = (size: 'small' | 'medium' | 'large' = 'medium') => <Button variant="contained" size={size} startIcon={<Add />} onClick={() => setIsChoreDialogOpen(true)}>Register Chore</Button>;

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
            {Object.values(RegistryDateFilter).map((dateFilter) => <MenuItem value={dateFilter} key={dateFilter}>{dateFilter}</MenuItem>)}
          </Select>
          {!isMobile && registerButton('medium')}
        </Box>
      </Stack>

      <Summary entries={choresDone} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {choresDone.map((chore) => (
                  <ListItem
                    key={chore.id}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={chore.userPhotoURL} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography>
                          <strong>{chore.userName}</strong> completed{' '}
                          {chore.choreName} (+{chore.points})
                        </Typography>
                      }
                      secondary={chore.completedAt?.toDateString()}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Leaderboard */}
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
