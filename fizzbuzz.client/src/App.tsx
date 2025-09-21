import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Game } from './components/Game/Game';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Box, Container } from '@chakra-ui/react';

type ViewType = 'game' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('game');

  return (
    <Box
      minH="100vh"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Container maxW="container.md">
        {/* Header and content stacked */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={6}>
          <Header currentView={currentView} onViewChange={setCurrentView} />
          {currentView === 'game' ? <Game /> : <AdminPanel />}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
