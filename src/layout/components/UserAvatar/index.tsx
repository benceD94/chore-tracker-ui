import { Avatar, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../../authentication/AuthContext/hooks';
import { usePendingInvitesQuery } from '../../../hooks/queries';
import { PendingInvitesDialog } from '../PendingInvitesDialog';

export const UserAvatar: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: pendingInvites } = usePendingInvitesQuery();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [invitesDialogOpen, setInvitesDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const inviteCount = pendingInvites?.length ?? 0;

  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyUserId = () => {
    if (user) navigator.clipboard.writeText(user.uid);
    setAnchorEl(null);
  };

  const handleOpenInvites = () => {
    setAnchorEl(null);
    setInvitesDialogOpen(true);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleUserMenuClick}>
        <Badge badgeContent={inviteCount} color="error">
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
            src={user?.photoURL || ''}
          />
        </Badge>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleUserMenuClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={handleOpenInvites}>
          Pending Invites{inviteCount > 0 ? ` (${inviteCount})` : ''}
        </MenuItem>
        <MenuItem onClick={handleCopyUserId}>Copy user ID</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
      <PendingInvitesDialog
        open={invitesDialogOpen}
        onClose={() => setInvitesDialogOpen(false)}
      />
    </>
  );
};
