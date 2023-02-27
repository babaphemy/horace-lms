import React from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Coursebar = () => {
  return (
    <AppBar position="static" className="w-full flex-1">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Build Native Android & iOS App Using EXPO
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Coursebar;
