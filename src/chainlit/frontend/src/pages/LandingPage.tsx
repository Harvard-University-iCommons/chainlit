import { Box } from '@mui/material';

import Head from 'components/Head';
import WaterMark from 'components/landing_page/landingPageWaterMark';

export default function LandingPage() {
  return (
    <>
      <Head title="Landing Page" description="Landing Page" />
      <Box sx={{ px: 2 }}>
        <h1>Welcome to the Landing Page!</h1>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        position="fixed"
        width="100%"
        gap={1}
        py={2}
        bottom={0}
      >
        <WaterMark />
      </Box>
    </>
  );
}
