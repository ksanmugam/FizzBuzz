import { useMutation } from '@tanstack/react-query';
import { gameApi } from '../services/gameApi';
import type { GameState, } from '../types/game.types';
import { useState } from 'react';

const initialGameState: GameState = {
  sessionId: null,
  currentNumber: null,
  rules: [],
  isPlaying: false,
  score: { correct: 0, total: 0 },
  lastResult: null,
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const startGameMutation = useMutation(gameApi.startGame, {
    onSuccess: (data) => {
      setGameState({
        sessionId: data.sessionId,
        currentNumber: data.number,
        rules: data.rules,
        isPlaying: true,
        score: { correct: 0, total: 0 },
        lastResult: null,
      });
    },
  });

  const submitAnswerMutation = useMutation(gameApi.submitAnswer, {
    onSuccess: (response, variables) => {
      setGameState((prev) => ({
        ...prev,
        currentNumber: response.nextNumber,
        score: {
          correct: prev.score.correct + (response.isCorrect ? 1 : 0),
          total: prev.score.total + 1,
        },
        lastResult: {
          isCorrect: response.isCorrect,
          correctAnswer: response.correctAnswer,
          userAnswer: variables.answer,
        },
      }));
    },
  });

  const endGameMutation = useMutation(gameApi.endGame, {
    onSuccess: () => {
      setGameState(initialGameState);
    },
  });

  // Actions
  const startGame = async () => {
    return await startGameMutation.mutateAsync();
  };

  const submitAnswer = async (answer: string) => {
    if (!gameState.sessionId || gameState.currentNumber === null) {
      throw new Error('Game not started');
    }

    return await submitAnswerMutation.mutateAsync({
      sessionId: gameState.sessionId!,
      number: gameState.currentNumber!,
      answer: answer.trim(),
    });
  };

  const endGame = (sessionId: string | null) =>
    sessionId ? endGameMutation.mutateAsync(sessionId) : Promise.resolve(null);

  const getErrorMessage = (err: unknown): string | null => {
    if (!err) return null;
    return err instanceof Error ? err.message : String(err);
  };

  const error =
    getErrorMessage(startGameMutation.error) ||
    getErrorMessage(submitAnswerMutation.error) ||
    getErrorMessage(endGameMutation.error);

  const loading = {
    start: startGameMutation.isPending,
    submit: submitAnswerMutation.isPending,
    end: endGameMutation.isPending,
    any:
      startGameMutation.isPending ||
      submitAnswerMutation.isPending ||
      endGameMutation.isPending,
  };

  return {
    gameState,
    loading: loading,
    error: error,
    startGame,
    submitAnswer,
    endGame,
  };
};
