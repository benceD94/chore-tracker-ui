import { Avatar, Box, Button, Card, CardContent, Chip, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import type { HouseholdDoc } from "../../../../types/firestore";
import { MoreVert } from "@mui/icons-material";
import { InviteMemberDialog } from "../InviteMemberDialog";

export interface MembersProps {
  household: HouseholdDoc;
  onAddMember: (memberId: string) => void;
}

export const Members: React.FC<MembersProps> = ({ household, onAddMember }) => {
  const [openInviteDialog, setOpenInviteDialog] = useState(false);

  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true);
  }

  const handleInviteMemberClose = () => {
    setOpenInviteDialog(false);
  }
  
  const handleInviteMemberSave = (memberId: string) => {
    setOpenInviteDialog(false);
    onAddMember(memberId)
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Members</Typography>
          <Box>
            <Button sx={{mr: 2}} size="small" variant="outlined" onClick={handleOpenInviteDialog}>Invite</Button>
            <Chip label={`${household?.memberIds.length ?? 0} members`} size="small" />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {(household.memberDetails ?? []).map((member) => (
            <ListItem
              key={member.id}
              sx={{
                px: 0,
                py: 1,
              }}
              secondaryAction={
                <IconButton edge="end" aria-label="more actions">
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={member.photoURL} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{member.displayName}</span>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <InviteMemberDialog
        open={openInviteDialog}
        onClose={handleInviteMemberClose}
        onSave={handleInviteMemberSave}
      />
    </Card>
  );
}