import AppWrapper from 'AppWrapper';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import './index.css';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    guestRoleArn:
      'arn:aws:iam::852971690794:role/RUM-Monitor-us-east-1-852971690794-7248872325961-Unauth',
    identityPoolId: 'us-east-1:415ccbd0-7a90-4a91-9d5c-86e777905441',
    endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: true,
    enableXRay: false
  };

  const APPLICATION_ID = '3bc175d7-be7d-46bd-ac23-b7553ed0f7f0';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'us-east-1';

  const awsRum: AwsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <AppWrapper />
    </RecoilRoot>
  </React.StrictMode>
);
