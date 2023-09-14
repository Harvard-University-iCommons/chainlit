import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';

import { useAuth } from 'hooks/auth';

import { projectSettingsState } from 'state/project';
import { settingsState } from 'state/settings';

interface Props {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

export default function UserMenu({ anchorEl, open, handleClose }: Props) {
  const { user, logout } = useAuth();
  const pSettings = useRecoilValue(projectSettingsState);
  const setAppSettings = useSetRecoilState(settingsState);
  const requiredKeys = !!pSettings?.project?.user_env?.length;

  const userNameItem = user && (
    <ListItem key="user-name" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography width="100%" fontSize="14px" fontWeight={700}>
        {user.name}
      </Typography>
      <Typography width="100%" fontSize="13px" fontWeight={400}>
        {user.email}
      </Typography>
    </ListItem>
  );

  const settingsItem = (
    <>
      <MenuItem
        key="close"
        aria-label="Close options menu"
        onClick={() => {
          handleClose();
        }}
        tabIndex={0}
        sx={{
          pr: 0,
          pb: { xs: 0, sm: '10px', md: 1, lg: 1 },
          pt: { xs: 0, sm: '10px', md: 1, lg: 1 },
          mb: { xs: '-5px' }
        }}
      >
        <ListItemIcon sx={{ marginLeft: 'auto', height: 20 }}>
          <CloseIcon
            fontSize="small"
            aria-label="Close icon"
            sx={{ minWidth: { xs: 50, sm: 50, md: 50, lg: 50 } }}
          />
        </ListItemIcon>
      </MenuItem>
      <Divider />
      <MenuItem
        key="settings"
        onClick={() => {
          setAppSettings((old) => ({ ...old, open: true }));
          handleClose();
        }}
        tabIndex={0}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" aria-label="Settings Menu" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <MenuItem
        tabIndex={0}
        key="logout"
        onClick={() => {
          // redirect to IdP logout URL
          console.log('redirect to logout url');
          window.location.href = '/logout';
        }}
      >
        <ListItemIcon>
          <LogoutIcon
            style={{ paddingLeft: 0 }}
            fontSize="small"
            aria-label="logout"
          />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </>
  );

  const apiKeysItem = requiredKeys && (
    <MenuItem key="env" component={Link} to="/env">
      <ListItemIcon>
        <KeyIcon fontSize="small" />
      </ListItemIcon>
      API keys
    </MenuItem>
  );

  const logoutItem = user && (
    <MenuItem
      key="logout"
      onClick={() => {
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
        handleClose();
      }}
    >
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  );

  const menuItems = [
    userNameItem,
    settingsItem,
    apiKeysItem,
    logoutItem
  ].filter((i) => !!i);

  const itemsWithDivider = menuItems.reduce((acc, curr, i) => {
    if (i === menuItems.length - 1) {
      return [...acc, curr];
    }
    return [...acc, curr, <Divider sx={{ my: 1 }} key={`divider-${i}`} />];
  }, [] as React.ReactNode[]);

  return (
    <Popover
      tabIndex={0}
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 220,
          overflow: 'visible',
          mt: 1.5,
          backgroundImage: 'none',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0px 2px 4px 0px #0000000D'
              : '0px 10px 10px 0px #0000000D',
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
            tabIndex: 0
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {itemsWithDivider}
    </Popover>
  );
}
