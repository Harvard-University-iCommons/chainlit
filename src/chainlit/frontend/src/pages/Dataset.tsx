import Page from 'pages/Page';

import Head from 'components/Head';
import Conversation from 'components/organisms/dataset';

export default function Dataset() {
  return (
    <>
      <Head title="History" description="History" />
      <Page>
        <Conversation />
      </Page>
    </>
  );
}
