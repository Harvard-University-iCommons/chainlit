import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { router } from 'router';
import makeTheme from 'theme';

import { Box, GlobalStyles, ThemeProvider } from '@mui/material';

import Hotkeys from 'components/Hotkeys';
import SettingsModal from 'components/molecules/settingsModal';
import Socket from 'components/socket';

import { useAuth } from 'hooks/auth';

import { clientState } from 'state/client';
import { settingsState } from 'state/settings';
import { accessTokenState, roleState } from 'state/user';

import './App.css';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    guestRoleArn:
      'arn:aws:iam::852971690794:role/RUM-Monitor-us-east-1-852971690794-7248872325961-Unauth',
    identityPoolId: 'us-east-1:415ccbd0-7a90-4a91-9d5c-86e777905441',
    endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false
  };

  const APPLICATION_ID = '3bc175d7-be7d-46bd-ac23-b7553ed0f7f0';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'us-east-1';

  const awsRum: AwsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

function App() {
  const client = useRecoilValue(clientState);
  const { theme: themeVariant } = useRecoilValue(settingsState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const setRole = useSetRecoilState(roleState);
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth();
  const theme = makeTheme(themeVariant);

  useEffect(() => {
    if (isAuthenticated && accessToken === undefined) {
      getAccessTokenSilently({
        authorizationParams: {
          audience: 'chainlit-cloud'
        }
      })
        .then((token) => setAccessToken(token))
        .catch((err) => {
          console.error(err);
          logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
        });
    }
  }, [isAuthenticated, getAccessTokenSilently, accessToken, setAccessToken]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    client.setAccessToken(accessToken);
    client
      .getRole()
      .then(async (role) => {
        setRole(role);
      })
      .catch((err) => {
        console.log(err);
        setRole('ANONYMOUS');
      });
  }, [accessToken]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.background.default }
        }}
      />
      <Toaster
        toastOptions={{
          className: 'toast',
          style: {
            fontFamily: 'brandon-grotesque',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(1),
            color: theme.palette.text.primary,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 2px 4px 0px #0000000D'
                : '0px 10px 10px 0px #0000000D'
          }
        }}
      />
      <Box display="flex" height="100vh" width="100vw">
        <Socket />
        <Hotkeys />
        <SettingsModal />
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
