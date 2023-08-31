import { Link } from 'react-router-dom';

import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';

interface Props {
  conversationId: number;
}

export default function DownloadConversationButton({ conversationId }: Props) {
  return (
    <IconButton
      className="download-conversation-button"
      // component={Link}
      // to={`/conversations/${conversationId}/text`}
      size="small"
      color="primary"
      onClick={async () =>
        await fetch(`/conversations/${conversationId}/text`, {
          headers: {
            'content-type': 'text/plain'
          },
          method: 'GET'
        })
      }
    >
      <DownloadIcon aria-label="download conversation" />
    </IconButton>
  );
}
