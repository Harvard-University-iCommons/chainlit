import { Box, Typography } from '@mui/material';

import WaterMark from '../chat/inputBox/waterMark';
import Filters from './filters';
import ConversationTable from './table';

export default function Conversation() {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        width={{ xs: '90%', lg: '100%' }}
        maxWidth="60rem"
        mx="auto"
        flexGrow={1}
      >
        <Box my={2} />
        <Typography>Chat history cleared at end of session. </Typography>
        <Filters />
        <Box my={2} />
        <ConversationTable />
      </Box>
      <WaterMark />
    </>
  );
}
