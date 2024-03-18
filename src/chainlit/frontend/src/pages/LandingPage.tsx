import { wsEndpoint } from 'api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from 'pages/Page';

import { Box } from '@mui/material';

import Head from 'components/Head';
import Sidebar from 'components/Sidebar';
import WaterMark from 'components/landing_page/landingPageWaterMark';

export default function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const errorMessage = 'An error occurred. Could not fetch AI sandboxes.';
  
  const landingPageDomains = [
    'localhost',
    'sandbox.ai.huit.harvard.edu',
    'dev.sandbox.ai.huit.harvard.edu',
    'stage.sandbox.ai.huit.harvard.edu',
    'qa.sandbox.ai.huit.harvard.edu'
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${wsEndpoint}/projects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          // console.log(response);
        }
        const responseData = await response.json();
        setProjects(responseData.projects || []);
        setError(null); // Clear error state upon request success.
        // console.log('Response Data: ', responseData.projects); // Print projects data.
      } catch (error) {
        console.error(error);
        setProjects([]);
        setError(error instanceof Error ? error.message : errorMessage);
      }
    };

    fetchProjects();
  }, [navigate]);

  // Get hostname from current URL.
  const currentHostname = window.location.hostname;

  // Find the most similar domain from landingPageDomains.
  const getMatchingDomain = () => {
    let matchingDomain = '';
    for (const domain of landingPageDomains) {
      if (currentHostname.endsWith(domain)) {
        matchingDomain = domain;
        break;
      }
    }
    return matchingDomain;
  };

  return (
    <>
      <Page>
        <Box sx={{ px: 2, display: 'flex' }}>
          <Sidebar />
          <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
            <Head title="Landing Page" description="Landing Page" />
            <Box
              id="landing-page"
              sx={{
                minHeight: '100vh',
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
              <div  style={{ fontWeight: 'bold' }}>
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
                              <a
                                href={`https://${project}.${getMatchingDomain() || currentHostname}`}
                                tabIndex={0}
                              >
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
              <Box
                justifyContent="center"
                position="fixed"
                width="100%"
                gap={1}
                py={2}
                bottom={0}
                maxWidth="60rem"
                m="auto"
                flexDirection="column"
              >
                <WaterMark />
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  );
}
