import Page from 'pages/Page';

import Head from 'components/Head';
import Conversation from 'components/organisms/dataset';

export default function Dataset() {
  return (
    <Page>
      <Head title="dataset" desccription="dataset" />
      <Conversation />
    </Page>
  );
}
