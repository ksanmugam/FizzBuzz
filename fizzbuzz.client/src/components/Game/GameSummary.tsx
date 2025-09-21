import React from 'react';
import type { GameSummaryDto } from '../../types/game.types';
import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';

interface GameSummaryProps {
  summary: GameSummaryDto;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  summary,
  onNewGame,
  onBackToMenu,
}) => {
  const formatDuration = (duration: string) => {
    const parts = duration.split(':');
    const minutes = parseInt(parts[1]);
    const seconds = Math.floor(parseFloat(parts[2]));
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Box rounded="lg" shadow="lg" p={8} bg={'white'}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6} color="gray.800">
          Game Summary
        </Text>

        {/* Overall Stats */}
        <SimpleGrid columns={2} spacing={3} mb={2}>
          <Box bg="blue.100" p={4} rounded="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.800">
              {summary.totalQuestions}
            </Text>
            <Text color="blue.600">Total Questions</Text>
          </Box>
          <Box bg="green.100" p={4} rounded="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="green.800">
              {summary.correctAnswers}
            </Text>
            <Text color="green.600">Correct Answers</Text>
          </Box>
          <Box bg="purple.100" p={4} rounded="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="purple.800">
              {summary.accuracyPercentage}%
            </Text>
            <Text color="purple.600">Accuracy</Text>
          </Box>
          <Box bg="gray.100" p={4} rounded="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {formatDuration(summary.duration)}
            </Text>
            <Text color="gray.600">Duration</Text>
          </Box>
        </SimpleGrid>

        {/* Question Details */}
        {summary.questions.length > 0 && (
          <Box mb={8}>
            <Text fontSize="xl" fontWeight="semibold" mb={4}>
              Question History
            </Text>
            <Box maxH={{ base: "240px", md: "384px", lg: "512px" }} overflowY="auto" borderWidth="1px" borderColor="gray.300" borderRadius="md" shadow="sm">
              <Table variant="simple" size="sm">
                <Thead bg="gray.100">
                  <Tr>
                    <Th textAlign="center">Number</Th>
                    <Th textAlign="center">Your Answer</Th>
                    <Th textAlign="center">Correct Answer</Th>
                    <Th textAlign="center">Result</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {summary.questions.map((question, index) => (
                    <Tr key={index} bg={question.isCorrect ? 'green.50' : 'red.50'}>
                      <Td textAlign="center" fontFamily="mono">{question.number}</Td>
                      <Td textAlign="center" fontFamily="mono">{question.userAnswer}</Td>
                      <Td textAlign="center" fontFamily="mono">{question.expectedAnswer}</Td>
                      <Td textAlign="center">
                        <Text fontWeight="bold" color={question.isCorrect ? 'green.600' : 'red.600'}>
                          {question.isCorrect ? '✓' : '✗'}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <HStack justify="center" spacing={3}>
          <Button colorScheme="green" onClick={onNewGame}>
            Play Again
          </Button>
          <Button colorScheme="gray" onClick={onBackToMenu}>
            Back to Menu
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
