import { useRecoilState, useRecoilValue } from 'recoil';

import CloseIcon from '@mui/icons-material/Close';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import ExpandIcon from '@mui/icons-material/Expand';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material';

import Switch from 'components/atoms/switch';

import { settingsState, versionState } from 'state/settings';

export default function SettingsModal() {
  const [settings, setSettings] = useRecoilState(settingsState);
  const { version } = useRecoilValue(versionState);
  const handleClose = () => setSettings((old) => ({ ...old, open: false }));
  return (
    <Dialog
      open={settings.open}
      onClose={handleClose}
      id="settings-dialog"
      PaperProps={{
        sx: {
          backgroundImage: 'none'
        }
      }}
    >
      <DialogContent>
        <List
          sx={{ width: '100%', maxWidth: 360 }}
          subheader={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListSubheader>Settings</ListSubheader>
              <IconButton
                edge={false}
                sx={{ ml: 'auto' }}
                onClick={handleClose}
                aria-label="close settings modal"
              >
                <CloseIcon />
              </IconButton>
            </div>
          }
        >
          <ListItem sx={{ display: 'flex', gap: 2 }}>
            <ListItemIcon>
              <ExpandIcon />
            </ListItemIcon>
            <ListItemText id="list-expand-all" primary="Expand Messages" />
            <Box>
              <Switch
                id="switch-expand-all-messages"
                onChange={() =>
                  setSettings((old) => ({ ...old, expandAll: !old.expandAll }))
                }
                checked={settings.expandAll}
                inputProps={{
                  'aria-label': 'Expand Messages'
                }}
              />
            </Box>
          </ListItem>
          <ListItem sx={{ display: 'flex', gap: 2 }}>
            <ListItemIcon>
              <EmojiObjectsIcon />
            </ListItemIcon>
            <ListItemText id="hide-cot" primary="Hide Chain of Thought" />
            <Box>
              <Switch
                id="switch-hide-cot"
                onChange={() =>
                  setSettings((old) => ({ ...old, hideCot: !old.hideCot }))
                }
                checked={settings.hideCot}
                inputProps={{
                  'aria-labelledby': 'hide-cot'
                }}
              />
            </Box>
          </ListItem>
          <ListItem sx={{ display: 'flex', gap: 2 }}>
            <ListItemIcon>
              <DarkModeOutlined />
            </ListItemIcon>
            <ListItemText id="switch-theme" primary="Dark mode" />
            <Box>
              <Switch
                id="switch-theme"
                onChange={() => {
                  const variant = settings.theme === 'light' ? 'dark' : 'light';
                  localStorage.setItem('themeVariant', variant);
                  setSettings((old) => ({ ...old, theme: variant }));
                }}
                checked={settings.theme === 'dark'}
                inputProps={{
                  'aria-labelledby': 'switch-theme'
                }}
              />
            </Box>
          </ListItem>
          {version ? (
            <ListItem>
              {' '}
              Version:{' '}
              <Link
                href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=8840006747e1f950453d7134846d4397"
                target="_blank"
                aria-label="Release notes"
              >
                {version}
              </Link>
            </ListItem>
          ) : (
            ''
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
