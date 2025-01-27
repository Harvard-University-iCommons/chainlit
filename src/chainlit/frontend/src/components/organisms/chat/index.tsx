import { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { Alert, Box } from '@mui/material';

import Head from 'components/Head';
import Sidebar from 'components/Sidebar';
import SideView from 'components/atoms/element/sideView';
import ErrorBoundary from 'components/atoms/errorBoundary';
import TaskList from 'components/molecules/tasklist';

import { useAuth } from 'hooks/auth';

import { actionState } from 'state/action';
import {
  IMessage,
  askUserState,
  messagesState,
  sessionState
} from 'state/chat';
import { chatHistoryState } from 'state/chatHistory';
import { elementState, tasklistState } from 'state/element';
import { projectSettingsState } from 'state/project';

import Playground from '../playground';
import InputBox from './inputBox';
import MessageContainer from './message/container';
import ChatSettingsModal from './settings';
import WelcomeScreen from './welcomeScreen';

const Chat = () => {
  const { user, isAuthenticated } = useAuth();
  const session = useRecoilValue(sessionState);
  const askUser = useRecoilValue(askUserState);
  const [messages, setMessages] = useRecoilState(messagesState);
  const elements = useRecoilValue(elementState);
  const tasklistElements = useRecoilValue(tasklistState);
  const actions = useRecoilValue(actionState);
  const pSettings = useRecoilValue(projectSettingsState);
  const setChatHistory = useSetRecoilState(chatHistoryState);

  const [autoScroll, setAutoScroll] = useState(true);

  const onSubmit = useCallback(
    async (msg: string) => {
      const sessionId = session?.socket.id;

      if (!sessionId) {
        return;
      }

      const message: IMessage = {
        id: uuidv4(),
        author: user?.name || 'User',
        authorIsUser: true,
        content: msg,
        createdAt: new Date().toISOString()
      };

      setChatHistory((old) => {
        const MAX_SIZE = 50;
        const messages = [...(old.messages || [])];
        messages.push({
          content: msg,
          createdAt: new Date().getTime()
        });

        return {
          ...old,
          messages:
            messages.length > MAX_SIZE
              ? messages.slice(messages.length - MAX_SIZE)
              : messages
        };
      });

      setAutoScroll(true);
      setMessages((oldMessages) => [...oldMessages, message]);
      session?.socket.emit('ui_message', message);
    },
    [user, session, isAuthenticated, pSettings]
  );

  const onReply = useCallback(
    async (msg: string) => {
      if (!askUser) return;
      const message = {
        id: uuidv4(),
        author: user?.name || 'User',
        authorIsUser: true,
        content: msg,
        createdAt: new Date().toISOString()
      };

      askUser.callback(message);

      setAutoScroll(true);
      setMessages((oldMessages) => [...oldMessages, message]);
    },
    [askUser, user]
  );

  const tasklist = tasklistElements.at(-1);

  return (
    <Box
      sx={{
        width: {
          xs: '80%',
          md: '100%',
          lg: '100%'
        },
        display: 'flex',
        height: 0
      }}
      flexGrow={1}
    >
      <Head title="Chat" description="Chat" />
      <Sidebar />
      <Playground />
      <ChatSettingsModal />
      <TaskList tasklist={tasklist} isMobile={false} />
      <SideView>
        <Box mx={1} />
        <TaskList tasklist={tasklist} isMobile={true} />
        {session?.error && (
          <Alert id="session-error" severity="error">
            Please refresh the page and if the issue persists, contact the{' '}
            <a href="https://huit.harvard.edu/" aria-label="HUIT service desk">
              HUIT Service Desk.
            </a>
          </Alert>
        )}
        {!!messages.length && (
          <ErrorBoundary>
            <MessageContainer
              actions={actions}
              elements={elements}
              messages={messages}
              autoScroll={autoScroll}
              setAutoScroll={setAutoScroll}
            />
          </ErrorBoundary>
        )}
        {!messages.length && <WelcomeScreen />}
        <InputBox onReply={onReply} onSubmit={onSubmit} />
      </SideView>
    </Box>
  );
};

export default Chat;
