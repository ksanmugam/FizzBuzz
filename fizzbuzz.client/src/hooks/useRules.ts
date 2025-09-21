import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rulesApi } from '../services/rulesApi';
import type { UpdateRuleDto, GameRule } from '../types/rule.types';

export const useRules = () => {
  const queryClient = useQueryClient();

  // Fetch rules
  const rulesQuery = useQuery({
    queryKey: ['rules'],
    queryFn: rulesApi.getAllRules,
  });

  // Create Rule
  const createRuleMutation = useMutation({
    mutationFn: rulesApi.createRule,
    onSuccess: (newRule: GameRule) => {
      queryClient.setQueryData<GameRule[]>(['rules'], (old) => (old ? [...old, newRule] : [newRule]));
    },
  });

  // Update Rule
  const updateRuleMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateRuleDto }) =>
      rulesApi.updateRule(id, updates),
    onSuccess: (updatedRule: GameRule) => {
      queryClient.setQueryData<GameRule[]>(['rules'], (old) =>
        old ? old.map((rule) => (rule.id === updatedRule.id ? updatedRule : rule)) : []
      );
    },
  });

  // Delete Rule
  const deleteRuleMutation = useMutation({
    mutationFn: (id: number) => rulesApi.deleteRule(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<GameRule[]>(['rules'], (old) =>
        old ? old.filter((rule) => rule.id !== id) : []
      );
    },
  });

  const getErrorMessage = (err: unknown): string | null => {
    if (!err) return null;
    return err instanceof Error ? err.message : String(err);
  };

  const combinedError =
    getErrorMessage(createRuleMutation.error) ||
    getErrorMessage(updateRuleMutation.error) ||
    getErrorMessage(deleteRuleMutation.error) ||
    getErrorMessage(rulesQuery.error);

  return {
    rules: rulesQuery.data ?? [],
    isLoading: rulesQuery.isFetching,
    isError: rulesQuery.isError,
    error: combinedError,
    refetch: rulesQuery.refetch,
    createRule: createRuleMutation.mutateAsync,
    updateRule: updateRuleMutation.mutateAsync,
    deleteRule: deleteRuleMutation.mutateAsync,
  };
};
