import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from 'pages/Page';

import Chat from 'components/organisms/chat/index';

export default function Home() {
  const navigate = useNavigate();
  const hostname = window.location.hostname;

  // List of domains to redirect to the landing page.
  const landingPageDomains = [
    'localhost',
    'sandbox.ai.huit.harvard.edu',
    'dev.sandbox.ai.huit.harvard.edu',
    'qa.sandbox.ai.huit.harvard.edu'
  ];

  // Check if the hostname matches any of the landing page domains.
  const isLandingPage = landingPageDomains.includes(hostname);

  useEffect(() => {
    if (isLandingPage) {
      navigate('/landing-page');
    }
  }, [isLandingPage, navigate]);

  return (
    <Page>
      <Chat />
    </Page>
  );
}
