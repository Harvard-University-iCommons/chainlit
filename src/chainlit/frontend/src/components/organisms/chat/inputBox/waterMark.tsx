import { useEffect, useState } from 'react';

import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function WaterMark() {
  const theme = useTheme();
  const [borderColor, setBorderColor] = useState('black');
  useEffect(() => {
    setBorderColor(theme.palette.mode == 'dark' ? 'white' : 'black');
  });
  return (
    <>
      <Box
        sx={{
          display: { xs: 'inline', sm: 'inline', md: 'inline', lg: 'flex' },
          justifyContent: 'center',
          mx: { xs: '5px' },
          fontWeight: 500
        }}
      >
        The AI Sandbox may generate responses that are inaccurate, misleading,
        or incomplete. Use of this service is subject to its&nbsp;
        <Link
          href="https://huit.harvard.edu/ai-sandbox/terms-of-use"
          target="_blank"
          sx={{
            display: 'inline-block',
            color: borderColor
          }}
          aria-label="Terms of Use / FAQ"
        >
          Terms of Use.
        </Link>
      </Box>
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
            href="https://harvard.az1.qualtrics.com/jfe/form/SV_6A5lw98k350Ey3A"
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
