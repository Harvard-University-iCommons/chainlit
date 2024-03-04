import { wsEndpoint } from 'api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Page from 'pages/Page';

import { Box } from '@mui/material';

import Head from 'components/Head';
import WaterMark from 'components/landing_page/landingPageWaterMark';

import { sessionIdState } from 'state/user';

export default function LandingPage() {
  const sessionId = useRecoilValue(sessionIdState);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const errorMessage = 'An error occurred. Could not fetch AI sandboxes.';

  useEffect(() => {
    if (!sessionId) {
      // Redirect to login page if sessionId is not available.
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${wsEndpoint}/projects/${sessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          console.log('response:', response);
          throw new Error('Failed to fetch projects.');
        }
        const responseData = await response.json();
        setProjects(responseData.projects || []);
        setError(null); // Clear error state upon request success.
        // console.log('Response Data: ', responseData.projects); // Print projects data
      } catch (error) {
        console.error('Error fetching data:', error);
        setProjects([]);
        setError(error instanceof Error ? error.message : errorMessage); // Setting error message.
      }
    };

    fetchProjects();
  }, [sessionId, navigate]);

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
                {/* Display error message if there's an error. */}
                {error ? (
                  <p>Error: {errorMessage}</p>
                ) : (
                  <div>
                    {/* Display projects as clickable links. */}
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
