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

const drawerWidth = 340;
const HarvardIcon =
  'https://genai-static-temp.s3.amazonaws.com/HarvardUniversity_Horizontal_Large_Shield_RGB.png';
const DarkHarvardIcon =
  'https://genai-static-temp.s3.amazonaws.com/HarvardUniversity_Horizontal_Large_Shield_Reverse_RGB.png';

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
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open sidebar"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          mb: { md: '14rem', lg: '14rem' },
          mt: { xs: '10rem' },
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
          <h2 style={{ fontSize: '2em' }}>(Pilot Version)</h2>
          <p>
            Use of this AI Sandbox is subject to data handling practices as
            outlined in the
            <a
              href="https://policy.security.harvard.edu/"
              aria-label="university's information security policies"
            >
              {' '}
              University's Information Security Policies
            </a>
            {'. '} The AI Sandbox is approived for use with
            <a
              href="https://security.harvard.edu/data-classification-table"
              aria-label="Medium Risk Confidential data(L3)"
            >
              {' '}
              Medium Risk Confidential data(L3)
            </a>{' '}
            and below. Do not enter any High Risk Confidential data (L4 or
            above).
            <br />
            <Divider
              sx={{
                borderColor: theme.palette.mode == 'dark' ? 'white' : 'black',
                mt: '1rem',
                mb: '1rem'
              }}
            />
            Before using the AI Sandbox, please review the guidelines and
            instructions in
            <a
              href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=ca9dd14447f07950566cf147536d433b"
              aria-label="Getting started with the AI Sandbox"
            >
              {' '}
              “Getting started with the AI Sandbox”
            </a>
            .
            <br />
            <Divider
              sx={{
                borderColor: theme.palette.mode == 'dark' ? 'white' : 'black',
                mt: '1rem',
                mb: '1rem'
              }}
            />
            Chat history cleared at end of session.
          </p>
        </div>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
