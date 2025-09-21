import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';

interface HeaderProps {
  currentView: 'game' | 'admin';
  onViewChange: (view: 'game' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <Box p={4}>
      <Flex
        maxW="container.xl"
        mx="auto"
        direction="column"
        align="center"
        gap={4}
      >
        <Heading as="h1" size="lg" fontWeight="bold" textAlign="center">
          FizzBuzz Game
        </Heading>

        <Flex w="100%" justify="space-between" maxW="md">
          <Button
            mr={4}
            onClick={() => onViewChange('game')}
            colorScheme="blue"
            variant={currentView === 'game' ? 'solid' : 'outline'}
          >
            Play Game
          </Button>
          <Button
            onClick={() => onViewChange('admin')}
            colorScheme="blue"
            variant={currentView === 'admin' ? 'solid' : 'outline'}
          >
            Admin Panel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
