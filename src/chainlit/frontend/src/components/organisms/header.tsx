import { huitColorPaletteV3 } from 'palette';
import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Popover,
  Stack,
  Toolbar,
  useTheme
} from '@mui/material';
import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import RegularButton from 'components/atoms/buttons/button';
import GithubButton from 'components/atoms/buttons/githubButton';
import UserButton from 'components/atoms/buttons/userButton';
import NewChatButton from 'components/molecules/newChatButton';

import { projectSettingsState } from 'state/project';

interface INavItem {
  to: string;
  label: string;
  target?: string;
}

interface IMenuItem {
  to: string;
  label: string;
  target?: string;
  tabIndex: number;
}
function ActiveNavItem({ to, label }: INavItem) {
  return (
    <RegularButton component={Link} to={to} key={to}>
      {label}
    </RegularButton>
  );
}

const styleOverrides = {
  inactive: {
    textTransform: 'none',
    color: 'text.secondary',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      outline: '2px solid ' + huitColorPaletteV3.blue,
      background: 'transparent'
    },
    fontSize: '1rem'
  },
  active: {
    textTransform: 'none',
    color: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'text.primary'
        : theme.palette.primary.main,
    background: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? huitColorPaletteV3.white
        : theme.palette.primary.light,
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      outline: '2px solid ' + huitColorPaletteV3.blue,
      background: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? huitColorPaletteV3.white
          : theme.palette.primary.light
    },
    marginTop: 1,
    marginBottom: 1
  }
};

function NavItem({ to, label, target }: INavItem) {
  return (
    <Button
      component={Link}
      to={to}
      key={to}
      target={target}
      sx={styleOverrides.inactive}
    >
      {label}
    </Button>
  );
}

const ActiveMenuItem = ({ to, label, tabIndex }: IMenuItem) => (
  <MenuItem
    component={Link}
    key={to}
    to={to}
    tabIndex={tabIndex}
    autoFocus={true}
    sx={styleOverrides.active}
  >
    {label}
  </MenuItem>
);

interface NavProps {
  hasDb?: boolean;
  hasReadme?: boolean;
}

function Nav({ hasDb, hasReadme }: NavProps) {
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<any>();

  let anchorEl;

  if (open && ref.current) {
    anchorEl = ref.current;
  }

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const tabs = [{ to: '/', label: 'Chat', target: '' }];

  if (hasDb) {
    tabs.push({ to: '/dataset', label: 'History', target: '' });
  }

  if (hasReadme) {
    tabs.push({ to: '/readme', label: 'Readme', target: '' });
  }

  tabs.push({
    to: 'https://huit.harvard.edu/',
    label: 'Get help',
    target: '_blank'
  });

  const nav = (
    <Stack direction={matches ? 'column' : 'row'} spacing={1}>
      {tabs.map((t) => {
        const active = location.pathname === t.to;
        return (
          <div key={t.to}>
            {active ? <ActiveNavItem {...t} /> : <NavItem {...t} />}
          </div>
        );
      })}
    </Stack>
  );

  if (matches) {
    return (
      <>
        <IconButton
          ref={ref}
          edge="start"
          aria-label="open nav"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Popover
          key="nav dropdown"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              p: 1,
              backgroundImage: 'none',
              mt: -2,
              ml: -1,
              overflow: 'visible',
              overflowY: 'auto',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) =>
                theme.palette.mode === 'light'
                  ? '0px 2px 4px 0px #0000000D'
                  : '0px 10px 10px 0px #0000000D'
            }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MenuItem
            key="close"
            aria-label="Close navigation menu"
            onClick={() => {
              setOpen(false);
            }}
            tabIndex={0}
            sx={{ pr: 0, pb: 0, pt: { xs: 0, sm: 1 }, mt: '-5px', mb: '-5px' }}
          >
            <ListItemIcon sx={{ marginLeft: 'auto', height: 20 }}>
              <CloseIcon
                fontSize="small"
                aria-label="Close icon"
                sx={{ minWidth: '40px' }}
              />
            </ListItemIcon>
          </MenuItem>
          <Divider />
          {tabs.map((t) => {
            const active = location.pathname === t.to;
            return active ? (
              <ActiveMenuItem {...t} tabIndex={0} />
            ) : (
              <MenuItem
                sx={styleOverrides.inactive}
                key={t.to}
                component={Link}
                to={t.to}
                tabIndex={0}
              >
                {t.label}
              </MenuItem>
            );
          })}
        </Popover>
      </>
    );
  } else {
    return nav;
  }
}

export default function Header() {
  const pSettings = useRecoilValue(projectSettingsState);

  return (
    <AppBar elevation={0} color="transparent" position="static">
      <Toolbar
        sx={{
          minHeight: '60px !important',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          background: (theme) => theme.palette.background.paper,
          borderBottomColor: (theme) => theme.palette.divider
        }}
      >
        <Stack alignItems="center" direction="row">
          <Nav
            hasDb={!!pSettings?.project?.database}
            hasReadme={!!pSettings?.markdown}
          />
        </Stack>
        <Stack
          alignItems="center"
          sx={{ ml: 'auto' }}
          direction="row"
          spacing={1}
          color="text.primary"
        >
          <NewChatButton />
          <Box ml={1} />
          <GithubButton href={pSettings?.ui?.github} />
          <UserButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
