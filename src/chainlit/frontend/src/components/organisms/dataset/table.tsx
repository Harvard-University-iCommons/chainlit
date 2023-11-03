import { useCallback, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useRecoilValue } from 'recoil';

import {
  Alert,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import { IChat } from 'state/chat';
import { clientState } from 'state/client';
import { datasetFiltersState } from 'state/dataset';

import DeleteConversationButton from './deleteConversationButton';
import DownloadConversationButton from './downloadConversationButton';
import OpenConversationButton from './openConversationButton';

export interface IPageInfo {
  hasNextPage: boolean;
  endCursor: any;
}

export interface IPagination {
  first: number;
  cursor?: string | number;
}

const BATCH_SIZE = 30;

const serializeDate = (timestamp: number | string) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  return new Date(timestamp).toLocaleDateString(undefined, dateOptions);
};

export default function ConversationTable() {
  const df = useRecoilValue(datasetFiltersState);
  const [conversations, setConversations] = useState<IChat[]>([]);
  const [prevPageInfo, setPrevPageInfo] = useState<IPageInfo | undefined>();
  const client = useRecoilValue(clientState);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(
    async (cursor?: string | number) => {
      try {
        const { pageInfo, data } = await client.getConversations(
          { first: BATCH_SIZE, cursor },
          df
        );
        setPrevPageInfo(pageInfo);
        setError(undefined);
        setConversations((prev) => [...prev, ...data]);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [client, df]
  );

  const refetchConversations = useCallback(async () => {
    setConversations([]);
    setLoading(true);
    setPrevPageInfo(undefined);
    fetchConversations(undefined);
  }, [fetchConversations]);

  useEffect(() => {
    refetchConversations();
  }, [refetchConversations]);

  const loadMoreItems = useCallback(() => {
    if (prevPageInfo?.hasNextPage) {
      fetchConversations(prevPageInfo.endCursor);
    }
  }, [prevPageInfo, fetchConversations]);

  if (error) {
    return <Alert severity="error">{(error as any).message}</Alert>;
  }
  if (loading) {
    return <Typography color="text.primary">Loading...</Typography>;
  }

  const itemCount = conversations.length;

  if (itemCount === 0) {
    return <Alert severity="info">No result</Alert>;
  }

  const columns = {
    Id: {
      minWidth: '60px',
      width: '5%'
    },
    Author: {
      minWidth: '130px',
      width: '25%'
    },
    Input: {
      minWidth: '200px',
      width: '35%'
    },
    Date: {
      minWidth: '120px',
      width: '25%'
    },
    Actions: {
      minWidth: '80px',
      width: '10%'
    }
  };

  const Row = ({ index, style }: any) => {
    const conversation = conversations[index];
    const overflowHidden = {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block',
      overflow: 'hidden'
    };
    return (
      <TableRow
        className="conversation-row"
        style={style}
        sx={{
          display: 'flex',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <TableCell align="left" sx={{ ...overflowHidden, ...columns.Id }}>
          {' '}
          {conversation.id}{' '}
        </TableCell>
        <TableCell align="left" sx={{ ...overflowHidden, ...columns.Author }}>
          {conversation.author?.email}
        </TableCell>
        <TableCell sx={{ ...overflowHidden, ...columns.Input }} align="left">
          {conversation.messages[0]?.content}
        </TableCell>
        <TableCell sx={{ ...columns.Date }} align="left">
          {serializeDate(conversation.createdAt)}
        </TableCell>
        <TableCell align="right" sx={{ ...columns.Actions }}>
          <Stack direction="row">
            <OpenConversationButton conversationId={conversation.id} />
            <DownloadConversationButton conversationId={conversation.id} />
            <DeleteConversationButton
              conversationId={conversation.id}
              onDelete={() => refetchConversations()}
            />
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const Header = (
    <TableHead>
      <TableRow>
        {Object.entries(columns).map(([key, value]) => (
          <TableCell
            key={key}
            sx={{
              fontSize: '0.875rem',
              width: value.width,
              minWidth: value.minWidth
            }}
            color="primary"
          >
            {key}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return (
    <TableContainer sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '40px',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      ></Box>
      <Table sx={{ height: '100%' }}>
        {Header}
        <TableBody>
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={(index) => !!conversations[index]}
                itemCount={
                  prevPageInfo?.hasNextPage ? itemCount + 1 : itemCount
                }
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <FixedSizeList
                    height={height!}
                    width={width!}
                    itemSize={55}
                    itemCount={itemCount}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                  >
                    {Row}
                  </FixedSizeList>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
