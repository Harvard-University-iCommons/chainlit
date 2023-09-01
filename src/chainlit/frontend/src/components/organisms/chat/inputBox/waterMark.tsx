import { useEffect, useState } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
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
          display: { xs: 'inline', md: 'flex', lg: 'flex' },
          justifyContent: 'center'
        }}
      >
        The AI Sandbox may generate responses that are inaccurate, misleading,
        or incomplete. Use of this service is subject to it's&nbsp;
        <a
          href="https://huit.harvard.edu/ai-sandbox/terms-of-use"
          target="_blank"
          style={{
            display: 'flex',
            textDecoration: 'underline',
            color: borderColor
          }}
          aria-label="Terms of Use / FAQ"
        >
          Terms of Use.
        </a>
      </Box>
      <Stack mx="auto">
        <Stack
          direction="row"
          divider={
            <Divider sx={{ borderColor }} orientation="vertical" flexItem />
          }
          spacing={2}
        >
          <a
            href="https://huit.harvard.edu/ai-sandbox/get-started"
            target="_blank"
            style={{
              display: 'flex',
              textDecoration: 'underline',
              color: borderColor
            }}
            aria-label="Getting started"
          >
            <Typography fontSize="12px" color="text.secondary">
              Getting started
            </Typography>
          </a>
          <a
            href="https://harvard.az1.qualtrics.com/jfe/form/SV_6A5lw98k350Ey3A"
            target="_blank"
            style={{
              display: 'flex',
              textDecoration: 'underline',
              color: borderColor
            }}
            aria-label="Feedback"
          >
            <Typography fontSize="12px" color="text.secondary">
              Feedback
            </Typography>
          </a>
          <a
            href="https://accessibility.huit.harvard.edu/digital-accessibility-policy"
            target="_blank"
            style={{
              display: 'flex',
              textDecoration: 'underline',
              color: borderColor
            }}
            aria-label="Digital Accessibility"
          >
            <Typography fontSize="12px" color="text.secondary">
              Digital Accessibility
            </Typography>
          </a>
          <a
            href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=ed94e064478d71506b944f53636d4380"
            target="_blank"
            style={{
              display: 'flex',
              textDecoration: 'underline',
              color: borderColor
            }}
            aria-label="Terms of Use / FAQ"
          >
            <Typography fontSize="12px" color="text.secondary">
              Terms of Use / FAQ
            </Typography>
          </a>
        </Stack>
        <a
          href="https://huit.harvard.edu"
          target="_blank"
          style={{
            display: 'flex',
            textDecoration: 'none',
            justifyContent: 'center',
            color: borderColor
          }}
          aria-label="Powered by HUIT"
        >
          <Typography fontSize="12px" color="text.secondary">
            Powered by HUIT
          </Typography>
        </a>
      </Stack>
    </>
  );
}
