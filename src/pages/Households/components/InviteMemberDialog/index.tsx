import {
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useUsersQuery } from '../../../../hooks/queries';
import type { UserResponseDto } from '../../../../api/types';

export interface InviteMemberDialogProps {
  open: boolean;
  existingMemberIds: string[];
  onClose: () => void;
  onSave: (userIds: string[]) => void;
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  open,
  existingMemberIds,
  onClose,
  onSave,
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { data: users, isLoading } = useUsersQuery();

  const availableUsers = (users ?? []).filter(
    (user: UserResponseDto) => !existingMemberIds.includes(user.uid)
  );

  const handleToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleClose = () => {
    setSelectedUserIds([]);
    onClose();
  };

  const handleSave = () => {
    onSave(selectedUserIds);
    setSelectedUserIds([]);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>Invite Members</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />
        ) : availableUsers.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No users available to invite.
          </Typography>
        ) : (
          <List disablePadding>
            {availableUsers.map((user: UserResponseDto) => (
              <ListItem key={user.uid} disablePadding>
                <ListItemButton onClick={() => handleToggle(user.uid)} dense>
                  <Checkbox
                    edge="start"
                    checked={selectedUserIds.includes(user.uid)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemAvatar>
                    <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.displayName || user.email || user.uid}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={selectedUserIds.length === 0}
        >
          Send Invite{selectedUserIds.length > 1 ? 's' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
