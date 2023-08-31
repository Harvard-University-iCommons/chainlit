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
      component={Link}
      to={`/project/download_conversation/${conversationId}?format=text`}
      size="small"
      color="primary"
    >
      <DownloadIcon aria-label="view conversation" />
    </IconButton>
  );
}
