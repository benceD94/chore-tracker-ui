import { Avatar, Box, Card, CardContent, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import React, { useMemo } from "react";
import type { RegistryEntryView } from "../../../../hooks/queries/useRegistryQuery";
import { EmojiEvents } from "@mui/icons-material";
import { getUserMap } from "../../../../utils/registryHelper";

type SummaryProps = {
  entries: RegistryEntryView[];
}

export const Leaderboard: React.FC<SummaryProps> = ({entries}) => {
  const leaderboard = useMemo(() => {
    const userMap = getUserMap(entries);
    const leaderboard = Object.entries(userMap)
      .map(([id, user]) => ({
        id, 
        ...user 
      }))
      .sort((a, b) => b.points - a.points);
    return leaderboard;
  }, [entries])
  
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Leaderboard
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {leaderboard.length >= 2 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <PieChart
                series={[
                  {
                    data: leaderboard.map((member) => ({
                      id: member.id,
                      value: member.points,
                      label: member.name,
                    })),
                    innerRadius: 30,
                  },
                ]}
                width={250}
                height={200}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                  },
                }}
              />
            </Box>
          )}
          <List disablePadding>
            {leaderboard.map((member, index) => (
              <ListItem
                key={member.id}
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom:
                    index < leaderboard.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    minWidth: 32,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {(index + 1) === 1 ? (
                    <EmojiEvents sx={{ color: '#ffd700' }} />
                  ) : (
                    <Typography variant="h6" color="text.secondary">
                      {index + 1}
                    </Typography>
                  )}
                </Box>
                <ListItemAvatar>
                  <Avatar src={member.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={`${member.points} points`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>)
};
