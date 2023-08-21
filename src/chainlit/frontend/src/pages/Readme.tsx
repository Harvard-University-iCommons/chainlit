import Page from 'pages/Page';

import { Box } from '@mui/material';

import Head from 'components/Head';
import WelcomeScreen from 'components/organisms/chat/welcomeScreen';

export default function Readme() {
  return (
    <Page>
      <Head title="Readme" description="Readme" />
      <Box sx={{ px: 2 }}>
        <WelcomeScreen />
      </Box>
    </Page>
  );
}
