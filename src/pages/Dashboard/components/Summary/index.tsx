import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useMemo } from "react";
import type { RegistryEntryView } from "../../../../hooks/queries/useRegistryQuery";
import { useAuth } from "../../../../authentication/AuthContext/hooks";
import { EmojiEvents, Group, TrendingUp } from "@mui/icons-material";
import { getUserMap } from "../../../../utils/registryHelper";

type SummaryProps = {
  entries: RegistryEntryView[];
}

export const Summary: React.FC<SummaryProps> = ({entries}) => {
  const {user} = useAuth();

  const myPoints = useMemo(() => {
    if (!user) return 0;

    return entries
      .filter((entry) => entry.userId === user.uid)
      .reduce((accumulator, currentEntry) => {
        return accumulator + currentEntry.points;
      }, 0);
  }, [entries, user])

  const householdPoints = useMemo(() => {
    return entries
      .reduce((accumulator, currentEntry) => {
        return accumulator + currentEntry.points;
      }, 0);
  }, [entries])

  const topPerformer = useMemo(() => {
    const userMap = getUserMap(entries);
    const users = Object.values(userMap);
    const topUser = users.length === 0 ? null : users.reduce((prev, current) => {
      return (prev.points > current.points) ? prev : current;
    });

    return topUser;
  }, [entries])
  
  return (<Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: "#1976d220",
                color: "#1976d2",
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                My points
              </Typography>
              <Typography variant="h4">{myPoints}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: "#2e7d3220",
                color: "#2e7d32",
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Group sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Household total
              </Typography>
              <Typography variant="h4">{householdPoints}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: "#ed6c0220",
                color: "#ed6c02",
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmojiEvents sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Top performer
              </Typography>
              <Typography variant="h5">{`${topPerformer?.name} (${topPerformer?.points})`}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>)
};
