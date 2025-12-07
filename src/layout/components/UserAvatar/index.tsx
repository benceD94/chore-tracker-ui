import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useAuth } from "../../../authentication/AuthContext";

export const UserAvatar: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleUserMenuClick}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }} src={user?.photoURL || ''} />
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
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  )
};
