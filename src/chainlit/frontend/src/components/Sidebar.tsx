import { huitColorPaletteV3 } from 'palette';
import { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

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
  const matches = useMediaQuery('(max-width:480px');
  const [open, setOpen] = useState(matches ? false : true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const linkStyle = {
    color:
      theme.palette.mode == 'dark'
        ? huitColorPaletteV3.yellow
        : huitColorPaletteV3.blue
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
          position: { xs: 'inherit', lg: 'absolute' },
          mb: { xs: '25rem', md: '14rem', lg: '14rem' },
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
        <div style={{ padding: '1rem', fontSize: '1.1rem' }}>
          <img
            src={theme.palette.mode == 'dark' ? DarkHarvardIcon : HarvardIcon}
            alt="harvard icon"
            style={{ width: '18rem' }}
          />
          <h3>
            AI Sandbox
            <br />
            (Pilot Version)
          </h3>
          <p>
            Use of this AI Sandbox is subject to data handling practices as
            outlined in the
            <a
              href="https://policy.security.harvard.edu/"
              aria-label="university's information security policies"
              style={linkStyle}
              target="_blank"
            >
              {' '}
              University's Information Security Policy
            </a>
            {'. '} The AI Sandbox is approved for use with
            <a
              href="https://security.harvard.edu/data-classification-table"
              aria-label="Medium Risk Confidential data (L3)"
              style={linkStyle}
              target="_blank"
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
            Before using the AI Sandbox, please{' '}
            <a
              href="https://huit.harvard.edu/ai-sandbox/get-started"
              aria-label="guidelines and instructions"
              style={linkStyle}
              target="_blank"
            >
              review these guidelines and instructions
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
