import { Stack, Typography } from '@mui/material';

import { Logo } from 'components/atoms/logo';

export default function WaterMark() {
  return (
    <Stack mx="auto">
      <a
        href="https://huit.harvard.edu"
        target="_blank"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}
      >
        <Typography fontSize="12px" color="text.secondary">
          Powered by HUIT
        </Typography>
      </a>
    </Stack>
  );
}
