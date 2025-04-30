import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  Public as PublicIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Tag as TagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { getConversations } from '../services/slackService';

const Sidebar = ({ selectedChannel, onChannelSelect }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    channels: true,
    directMessages: true
  });

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        setError(error.error || 'Failed to fetch conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  const renderSection = (title, section, items, emptyMessage) => (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        py: 1,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
      }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <IconButton 
          size="small" 
          onClick={() => toggleSection(section)}
        >
          {expandedSections[section] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>
      {expandedSections[section] && (
        items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            {emptyMessage}
          </Typography>
        ) : (
          <List dense disablePadding>
            {items.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedChannel?.id === item.id}
                  onClick={() => onChannelSelect(item)}
                  sx={{ 
                    py: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getChannelIcon(item)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name}
                    primaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )
      )}
    </>
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: 260,
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Slack Integration</Typography>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <>
            {renderSection(
              'Channels',
              'channels',
              conversations.filter(c => !c.is_im && !c.is_mpim),
              'No channels available'
            )}
            <Divider />
            {renderSection(
              'Direct Messages',
              'directMessages',
              conversations.filter(c => c.is_im || c.is_mpim),
              'No direct messages'
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Sidebar; 