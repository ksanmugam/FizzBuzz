import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGame } from '../useGame';
import { gameApi } from '../../services/gameApi';
import React from 'react';

// Mock the gameApi
jest.mock('../../services/gameApi');
const mockGameApi = gameApi as jest.Mocked<typeof gameApi>;

// Utility to wrap hook in QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // disable retries in tests
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logs
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default state', () => {
    const { result } = renderHook(() => useGame(), { wrapper: createWrapper() });

    expect(result.current.gameState).toEqual({
      sessionId: null,
      currentNumber: null,
      rules: [],
      isPlaying: false,
      score: { correct: 0, total: 0 },
      lastResult: null,
    });
    expect(result.current.loading.any).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('startGame updates state correctly', async () => {
    const mockStartResponse = {
      sessionId: 'test-session',
      number: 42,
      rules: [{ id: 1, divisor: 3, replacementText: 'Fizz', isActive: true, createdAt: '', updatedAt: '' }],
    };

    mockGameApi.startGame.mockResolvedValueOnce(mockStartResponse);

    const { result } = renderHook(() => useGame(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.startGame();
    });

    expect(result.current.gameState.sessionId).toBe('test-session');
    expect(result.current.gameState.currentNumber).toBe(42);
    expect(result.current.gameState.isPlaying).toBe(true);
    expect(result.current.gameState.rules).toEqual(mockStartResponse.rules);
  });

  test('submitAnswer updates score correctly for correct answer', async () => {
    const mockStartResponse = {
      sessionId: 'test-session',
      number: 15,
      rules: [],
    };

    const mockAnswerResponse = {
      isCorrect: true,
      correctAnswer: 'FizzBuzz',
      nextNumber: 23,
      gameEnded: false,
    };

    mockGameApi.startGame.mockResolvedValueOnce(mockStartResponse);
    mockGameApi.submitAnswer.mockResolvedValueOnce(mockAnswerResponse);

    const { result } = renderHook(() => useGame(), { wrapper: createWrapper() });

    // Start game first
    await act(async () => {
      await result.current.startGame();
    });

    // Submit correct answer
    await act(async () => {
      await result.current.submitAnswer('FizzBuzz');
    });

    expect(result.current.gameState.score.correct).toBe(1);
    expect(result.current.gameState.score.total).toBe(1);
    expect(result.current.gameState.currentNumber).toBe(23);
    expect(result.current.gameState.lastResult).toEqual({
      isCorrect: true,
      correctAnswer: 'FizzBuzz',
      userAnswer: 'FizzBuzz',
    });
  });

  test('handles API errors gracefully', async () => {
    mockGameApi.startGame.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useGame(), { wrapper: createWrapper() });

    await expect(result.current.startGame()).rejects.toThrow('API Error');

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
    });

    expect(result.current.gameState.isPlaying).toBe(false);
  });
});
