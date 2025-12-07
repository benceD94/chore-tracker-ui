import React, { useState } from "react";
import { AppBar, Box, IconButton,  Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet } from "react-router";
import { UserAvatar } from "./components/UserAvatar";
import { Navigation } from "./components/Navigation";
import { DRAWER_WIDTH } from "./constant";

export const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Chore Tracker
          </Typography>
          <UserAvatar />
        </Toolbar>
      </AppBar>

      <Navigation isMobileOpen={isMobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
