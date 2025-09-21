import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import type { GameSummaryDto } from '../../types/game.types';
import { GameSummary } from './GameSummary';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useErrorToast, useSuccessToast } from '../../hooks/useToasts';

export const Game: React.FC = () => {
  const { gameState, loading, error, startGame, submitAnswer, endGame } = useGame();
  const [userAnswer, setUserAnswer] = useState('');
  const [gameSummary, setGameSummary] = useState<GameSummaryDto | null>(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartGame = useCallback(async () => {
    await startGame();
    setGameSummary(null);
  }, [startGame]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    await submitAnswer(userAnswer);
    setUserAnswer('');
  };

  const handleEndGame = async () => {
    try {
      const summary = await endGame(gameState.sessionId);
      if (summary) setGameSummary(summary);
    } catch (err: any) {
      errorToast({ title: "Failed to end game", description: err.message || "Unknown error" });
    }
  };

  const handleNewGame = () => {
    setGameSummary(null);
    handleStartGame();
  };

  useEffect(() => {
    if (!gameState.lastResult) return;

    const isCorrect = gameState.lastResult.isCorrect;

    if (isCorrect) {
      successToast({title: "Correct!"});
    }
    else {
      errorToast({title: "Wrong!", description: `You answered "${gameState.lastResult.userAnswer}" but the correct answer was "${gameState.lastResult.correctAnswer}"`});
    }

    if (gameState.isPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.lastResult]);

  if (gameSummary) {
    return (
      <GameSummary
        summary={gameSummary}
        onNewGame={handleNewGame}
        onBackToMenu={() => setGameSummary(null)}
      />
    );
  }

  return (
    <Flex justify="center" className="p-6">
      <Box maxW="2xl" w="full" bg={'white'}  rounded="lg" shadow="lg" p={8}>

        {error && (
          <Alert status="error" mb={4} rounded="md">
            <AlertIcon />
            <AlertTitle mr={2}>Error:</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!gameState.isPlaying ? (
          <VStack spacing={6}>
            <Text color="gray.600" textAlign="center">
              Ready to test your FizzBuzz skills? Click start to begin!
            </Text>
            <Button
              colorScheme="green"
              onClick={handleStartGame}
              isLoading={loading.start}
              loadingText="Starting..."
              size="lg"
            >
              Start Game
            </Button>
          </VStack>
        ) : (
          <VStack spacing={6}>
            {/* Game Rules */}
            <Box w="full" bg="gray.100" p={4} rounded="md">
              <Text fontWeight="semibold" mb={2}>
                Current Rules:
              </Text>
              <VStack align="start" spacing={1}>
                {gameState.rules
                  .filter((rule) => rule.isActive)
                  .map((rule) => (
                    <Text key={rule.id} fontSize="sm" color="gray.700">
                      Numbers divisible by {rule.divisor} → "{rule.replacementText}"
                    </Text>
                  ))}
              </VStack>
            </Box>

            {/* Score */}
            <HStack spacing={4} bg="blue.100" px={4} py={2} rounded="md">
              <Text fontWeight="semibold" color="blue.800">
                Score: {gameState.score.correct}/{gameState.score.total}
              </Text>
              {gameState.score.total > 0 && (
                <Text color="blue.600">
                  ({Math.round((gameState.score.correct / gameState.score.total) * 100)}%)
                </Text>
              )}
            </HStack>

            {/* Current Question */}
            <VStack spacing={2} className="mb-6">
              <Text fontSize="6xl" fontWeight="bold" color="gray.800">
                {gameState.currentNumber}
              </Text>
              <Text color="gray.600">What should this number be replaced with?</Text>
            </VStack>

            {/* Answer Form */}
            <form onSubmit={handleSubmitAnswer} style={{ width: '100%' }} className="mb-4">
              <HStack spacing={2}>
                <FormControl isDisabled={loading.submit} flex={1}>
                  <Input
                    value={userAnswer}
                    ref={inputRef}  
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    autoFocus
                    size="lg"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isDisabled={!userAnswer.trim() || loading.submit}
                  isLoading={loading.submit}
                  loadingText="Submitting..."
                  minW="100px"
                >
                  Submit
                </Button>
              </HStack>
            </form>

            {/* End Game Button */}
            <Button colorScheme="red" onClick={handleEndGame} isLoading={loading.end} isDisabled={loading.end} loadingText="Ending..." w="full">
              End Game
            </Button>
          </VStack>
        )}
      </Box>
    </Flex>
  );
};
