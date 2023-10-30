import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';

import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import ThumbDownAltOutlined from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import { Checkbox, Stack, Tooltip } from '@mui/material';

import { IMessage, messagesState } from 'state/chat';
import { clientState } from 'state/client';

const size = '16px';

interface Props {
  message: IMessage;
}

export default function FeedbackButtons({ message }: Props) {
  const messages = useRecoilValue(messagesState);
  const [feedback, setFeedback] = useState(message.humanFeedback || 0);
  const client = useRecoilValue(clientState);

  const onClick = async (value: number) => {
    try {
      await toast.promise(client.setHumanFeedback(message.id!, value), {
        loading: 'Updating...',
        success: 'Feedback updated!',
        error: (err) => {
          return <span>{err.message}</span>;
        }
      });

      const globalMessage = messages.find((m) => m.id === message.id);
      if (globalMessage) {
        globalMessage.humanFeedback = value;
      }
      setFeedback(value);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Negative feedback">
        <Checkbox
          className={`negative-feedback-${feedback === -1 ? 'on' : 'off'}`}
          onClick={() => onClick(feedback === -1 ? 0 : -1)}
          size="small"
          aria-checked={feedback == -1}
          aria-label="negative feedback"
          checked={feedback == -1}
          icon={<ThumbDownAltOutlined sx={{ width: size, height: size }} />}
          checkedIcon={<ThumbDownAlt sx={{ width: size, height: size }} />}
        />
      </Tooltip>
      <Tooltip title="Positive feedback">
        <Checkbox
          className={`positive-feedback-${feedback === 1 ? 'on' : 'off'}`}
          onClick={() => onClick(feedback === 1 ? 0 : 1)}
          size="small"
          aria-checked={feedback == 1}
          aria-label="positive feedback"
          checked={feedback == 1}
          icon={<ThumbUpAltOutlined sx={{ width: size, height: size }} />}
          checkedIcon={<ThumbUpAlt sx={{ width: size, height: size }} />}
        />
      </Tooltip>
    </Stack>
  );
}
