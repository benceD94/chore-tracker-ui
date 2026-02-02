import { Avatar, Card, CardContent, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useMemo } from "react";
import type { RegistryEntryView } from "../../../../hooks/queries/useRegistryQuery";

type SummaryProps = {
  choresDone: RegistryEntryView[];
}

export const RegisteredChoresList: React.FC<SummaryProps> = ({choresDone}) => {
  
  const grouped = useMemo(() => {
    type GroupChore = {
      choreId: string;
      name: string;
      count: number;
      totalPoints: number;
    };

    type Group = {
      key: string;
      userId: string;
      userName: string;
      userPhotoURL?: string;
      completedAt: Date | null;
      chores: GroupChore[];
      totalPoints: number;
    };

    const map = new Map<string, Group>();

    choresDone.forEach((entry) => {
      const timeKey =
        entry.completedAt?.getTime().toString() ?? `no-time-${entry.id}`;
      const key = `${entry.userId}-${timeKey}`;

      let group = map.get(key);
      if (!group) {
        group = {
          key,
          userId: entry.userId,
          userName: entry.userName,
          userPhotoURL: entry.userPhotoURL,
          completedAt: entry.completedAt,
          chores: [],
          totalPoints: 0,
        };
        map.set(key, group);
      }

      // group by choreId inside this group
      let chore = group.chores.find((c) => c.choreId === entry.choreId);
      if (!chore) {
        chore = {
          choreId: entry.choreId,
          name: entry.choreName,
          count: 0,
          totalPoints: 0,
        };
        group.chores.push(chore);
      }

      chore.count += 1;
      chore.totalPoints += entry.points;
      group.totalPoints += entry.points;
    });

    // sort groups by time desc
    return Array.from(map.values()).sort((a, b) => {
      const at = a.completedAt?.getTime() ?? 0;
      const bt = b.completedAt?.getTime() ?? 0;
      return bt - at;
    });
  }, [choresDone]);
  
  return (
    <Grid size={{ xs: 12, sm: 6, md: 7 }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent activity
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {grouped.map((group) => (
              <ListItem
                key={group.key}
                sx={{
                  px: 0,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={group.userPhotoURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography>
                      <strong>{group.userName.split(' ')[0]}</strong> completed{' '}
                      {group.chores
                        .map((c) =>
                          c.count > 1 ? `${c.name} x${c.count}` : c.name
                        )
                        .join(', ')}{' '}
                      (+{group.totalPoints})
                    </Typography>
                  }
                  secondary={group.completedAt?.toDateString()}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>)
};
