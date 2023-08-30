import * as React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/DoubleArrow';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';

import HarvardIcon from '../assets/HarvardUniversity_Horizontal_Large_Shield_RGB.png';
import DarkHarvardIcon from '../assets/HarvardUniversity_Horizontal_Large_Shield_Reverse_RGB.png';

const drawerWidth = 340;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  width: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  console.log('mode', theme.palette.mode);
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open sidebar"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          mb: { lg: '7rem' },
          ml: '2px',
          mr: 0,
          bottom: '22rem',
          ...(open && { display: 'none' })
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          },
          '& .MuiPaper-root': {
            marginTop: '4rem'
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} aria-label="close sidebar">
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <div style={{ padding: '1rem' }}>
          <img
            src={theme.palette.mode == 'dark' ? DarkHarvardIcon : HarvardIcon}
            alt="harvard icon"
            style={{ width: '18rem' }}
          />
          <h1>AI Sandbox</h1>
          <h2>(Pilot Version)</h2>
          <p>
            Use of this AI Sandbox is subject to data handling practices as
            outlined in the
            <a href="https://policy.security.harvard.edu/">
              {' '}
              University's Information Security Policies
            </a>
            . The AI Sandbox is approived for use with Medium Risk Confidential
            data(L3) and below. Do not enter any High Risk Confidential data (L4
            or above). For additional information, review the University's
            guidelines for the use of generative AI.
          </p>
        </div>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
