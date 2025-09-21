import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRules } from '../useRules';
import { rulesApi } from '../../services/rulesApi';
import React, { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('../../services/rulesApi');
const mockRulesApi = rulesApi as jest.Mocked<typeof rulesApi>;

// Wrapper for hooks using React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, } },
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

describe('useRules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches rules on mount', async () => {
    const mockRules = [
      { id: 1, divisor: 3, replacementText: 'Fizz', isActive: true, createdAt: '', updatedAt: '' },
      { id: 2, divisor: 5, replacementText: 'Buzz', isActive: true, createdAt: '', updatedAt: '' }
    ];

    mockRulesApi.getAllRules.mockResolvedValueOnce(mockRules);

    const { result } = renderHook(() => useRules(), { wrapper: createWrapper() });

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.rules).toEqual(mockRules);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('createRule adds new rule to state', async () => {
  const existingRules = [
    { id: 1, divisor: 3, replacementText: 'Fizz', isActive: true, createdAt: '', updatedAt: '' }
  ];

  const newRuleDto = {
    divisor: 7,
    replacementText: 'Lucky',
    isActive: true
  };

  const createdRule = {
    id: 2,
    ...newRuleDto,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  mockRulesApi.getAllRules.mockResolvedValueOnce(existingRules);
  mockRulesApi.createRule.mockResolvedValueOnce(createdRule);

  const { result } = renderHook(() => useRules(), { wrapper: createWrapper() });

  // Wait for initial fetch
  await waitFor(() => expect(result.current.rules).toHaveLength(1));

  // Create new rule
  await act(async () => {
    await result.current.createRule(newRuleDto);
  });

  // Wait for rules array to include the new rule
  await waitFor(() => {
    expect(result.current.rules).toHaveLength(2);
    expect(result.current.rules).toContainEqual(createdRule);
  });
});

  
  test('handles API errors', async () => {
    mockRulesApi.getAllRules.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useRules(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.rules).toEqual([]);
  });
});
