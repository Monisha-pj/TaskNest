// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Box,
  Menu,
  MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/register', label: 'Register', icon: <PersonAddIcon /> },
    { to: '/login', label: 'Login', icon: <LoginIcon /> }
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: darkMode ? '#222' : '#B299FF', // Lavender Purple
        color: '#fff',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentTurnedInIcon sx={{ mr: 1, color: '#fff' }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              letterSpacing: 1,
              color: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            TaskNest
          </Typography>
        </Box>

        {/* Navigation */}
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.to}
                  component={Link}
                  to={link.to}
                  onClick={handleMenuClose}
                >
                  {link.icon} &nbsp; {link.label}
                </MenuItem>
              ))}
              {token && (
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  <LogoutIcon /> &nbsp; Logout
                </MenuItem>
              )}
              <MenuItem onClick={() => { setDarkMode(!darkMode); handleMenuClose(); }}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />} &nbsp;
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={{ color: '#fff', textTransform: 'none' }}
              >
                {link.label}
              </Button>
            ))}

            {token && (
              <IconButton color="inherit" onClick={handleLogout} title="Logout">
                <LogoutIcon />
              </IconButton>
            )}

            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
