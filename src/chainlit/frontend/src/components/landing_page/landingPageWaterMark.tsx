import { useEffect, useState } from 'react';

import { Divider, Link, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function WaterMark() {
  const theme = useTheme();
  const [borderColor, setBorderColor] = useState('black');
  useEffect(() => {
    setBorderColor(theme.palette.mode == 'dark' ? 'white' : 'black');
  });
  return (
    <>
      <Stack
        sx={{
          mx: { xs: '5px', md: 'auto', lg: 'auto' }
        }}
      >
        <Stack
          direction="row"
          divider={
            <Divider sx={{ borderColor }} orientation="vertical" flexItem />
          }
          spacing={2}
        >
          <Link
            href="https://huit.harvard.edu/ai-sandbox/get-started"
            target="_blank"
            sx={{
              display: 'flex',

              color: borderColor
            }}
            aria-label="Get started"
          >
            <Typography fontSize="12px" color="text.secondary">
              Get started
            </Typography>
          </Link>
          <Link
            href="https://icommons-tools.tlt.harvard.edu/qualtrics_taker_auth/?qtarget=aHR0cHM6Ly9oYXJ2YXJkLmF6MS5xdWFsdHJpY3MuY29tL2pmZS9mb3JtL1NWX2VSdVg2NTRFOUxuVXdicw=="
            target="_blank"
            sx={{
              display: 'flex',

              color: borderColor
            }}
            aria-label="Send feedback"
          >
            <Typography fontSize="12px" color="text.secondary">
              Send feedback
            </Typography>
          </Link>
          <Link
            href="https://accessibility.huit.harvard.edu/digital-accessibility-policy"
            target="_blank"
            sx={{
              display: 'flex',

              color: borderColor
            }}
            aria-label="Digital Accessibility"
          >
            <Typography fontSize="12px" color="text.secondary">
              Digital Accessibility
            </Typography>
          </Link>
          <Link
            href="https://huit.harvard.edu/ai-sandbox/terms-of-use"
            target="_blank"
            sx={{
              display: 'flex',

              color: borderColor
            }}
            aria-label="Terms of Use"
          >
            <Typography fontSize="12px" color="text.secondary">
              Terms of Use
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
