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
      onClick={async () => {
        await fetch(`/conversations/${conversationId}/text`, {
          headers: {
            'content-type': 'text/plain'
          },
          method: 'GET'
        })
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `conversation_${conversationId}.txt`;
            document.body.appendChild(a); // append the element to the dom
            a.click();
            a.remove(); // afterwards, remove the element
          })
          .catch((error) => {
            console.error(error);
          });
      }}
    >
      <DownloadIcon aria-label="download conversation" />
    </IconButton>
  );
}
