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

export const DashboardPage: React.FC = () => {
  const {user} = useAuth();
  const {household} = useSettingsProvider();

  const [filter, setFilter] = useState<RegistryDateFilter>(RegistryDateFilter.Today);
  const { entries: choresDone } = useRegistryView(household?.id || '', filter);

  const [isChoreDialogOpen, setIsChoreDialogOpen] = useState(false);

  const handleDateFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as RegistryDateFilter)
  }

  const handleCloseChoreDialog = () => {
    setIsChoreDialogOpen(false);
  }

  const handleSaveChoreDialog = async (selectedChore: ChoreDoc) => {
    setIsChoreDialogOpen(false);
    if (household && user) {
      await registerChoreDone({
        householdId: household.id,
        choreId: selectedChore.id,
        userId: user?.uid,
        points: selectedChore.points,
      });
    }
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
            {Object.values(RegistryDateFilter).map((dateFilter) => <MenuItem value={dateFilter} key={dateFilter}>{dateFilter}</MenuItem>)}
          </Select>
          <Button variant="contained" size="medium" startIcon={<Add />} onClick={() => setIsChoreDialogOpen(true)}>Register Chore</Button>
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
      <RegisterChoreDialog
        open={isChoreDialogOpen}
        onClose={handleCloseChoreDialog}
        onSave={handleSaveChoreDialog}
      />
    </Box>
  );
}
