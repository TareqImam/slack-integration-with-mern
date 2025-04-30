import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import { getMessages, sendMessage } from '../services/slackService';

const MainContent = ({ selectedChannel }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel) return;

      setIsLoading(true);
      setError('');
      setMessages([]);

      try {
        const data = await getMessages(selectedChannel.id);
        setMessages(data);
      } catch (error) {
        setError(error.error || 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      await sendMessage(selectedChannel.id, newMessage);
      setNewMessage('');

      const data = await getMessages(selectedChannel.id);
      setMessages(data);
    } catch (error) {
      setError(error.error || 'Failed to send message');
    }
  };

  const getChannelIcon = (channel) => {
    if (channel.is_private) {
      return <LockIcon fontSize="small" />;
    } else if (channel.is_im) {
      return <PersonIcon fontSize="small" />;
    } else if (channel.is_mpim) {
      return <TagIcon fontSize="small" />;
    } else {
      return <PublicIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {selectedChannel ? (
        <>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {getChannelIcon(selectedChannel)}
            <Typography variant="h6">{selectedChannel.name}</Typography>
          </Paper>

          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : messages.length === 0 ? (
              <Alert severity="info">No messages in this channel</Alert>
            ) : (
              <List>
                {messages.map((message, index) => (
                  <React.Fragment key={message.ts}>
                    <ListItem alignItems="flex-start" disablePadding>
                      <Box sx={{ 
                        display: 'flex', 
                        width: '100%',
                        gap: 2,
                        py: 1
                      }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {message.user.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" component="span">
                              {message.user}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(parseFloat(message.ts) * 1000).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {message.text}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < messages.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
              </List>
            )}
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: 1
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              maxRows={4}
              size="small"
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Paper>
        </>
      ) : (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2,
          p: 3
        }}>
          <Typography variant="h6" color="text.secondary">
            Select a channel to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MainContent; 