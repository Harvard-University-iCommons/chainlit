import { useRecoilValue } from 'recoil';

import Page from 'pages/Page';

import { Box } from '@mui/material';

import Head from 'components/Head';
import WaterMark from 'components/landing_page/landingPageWaterMark';

import { userSandboxState } from 'state/user';

export default function LandingPage() {
  const { projects } = useRecoilValue(userSandboxState);
  return (
    <>
      <Head title="Landing Page" description="Landing Page" />
      <Page>
        <Box sx={{ px: 2 }}>
          <Box overflow="auto" flexGrow={1}>
            <Box
              id="welcome-screen"
              sx={{
                maxWidth: '60rem',
                width: '100%',
                m: 'auto',
                color: 'text.primary',
                lineHeight: '25px',
                fontSize: '1rem',
                fontFamily:
                  '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h1>Welcome to the AI Sandbox Landing Page!</h1>
              <div>
                {/* Display projects as clickable links. If there are no projects, display message indicating no access. */}
                {projects && projects.length === 0 ? (
                  <p>You do not have access to any AI sandboxes.</p>
                ) : (
                  <div>
                    <p>AI Sandboxes you have access to:</p>
                    <ul>
                      {projects.map((project, index) => (
                        <li key={index}>
                          <a href={`/${project}`} tabIndex={0}>
                            {project}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Box>
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
        </Box>
      </Page>
    </>
  );
}
