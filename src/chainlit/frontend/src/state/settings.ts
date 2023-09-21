import { atom, selector } from 'recoil';

import { wsEndpoint } from '../api';

type ThemeVariant = 'dark' | 'light';

const defaultTheme = 'light';

const preferredTheme = localStorage.getItem(
  'themeVariant'
) as ThemeVariant | null;

const theme = preferredTheme ? preferredTheme : defaultTheme;

export const settingsState = atom<{
  open: boolean;
  expandAll: boolean;
  hideCot: boolean;
  theme: ThemeVariant;
}>({
  key: 'AppSettings',
  default: {
    open: false,
    expandAll: false,
    hideCot: false,
    theme
  }
});

export const versionState = atom<{
  version: string;
}>({
  key: 'version',
  default: selector({
    key: 'version/default',
    get: async () => {
      const res = await fetch(`${wsEndpoint}/version`, {
        headers: {
          'content-type': 'application/json'
        },
        method: 'GET'
      });
      return res.json();
    }
  })
});
