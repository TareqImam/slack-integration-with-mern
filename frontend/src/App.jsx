import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4A154B',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F8F8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}>
        <Sidebar 
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
        />
        <MainContent 
          selectedChannel={selectedChannel}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
