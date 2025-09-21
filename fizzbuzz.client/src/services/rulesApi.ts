import type { CreateRuleDto, GameRule, UpdateRuleDto } from '../types/rule.types';
import { apiClient } from './api';

export const rulesApi = {
  async getAllRules(): Promise<GameRule[]> {
    return apiClient.get<GameRule[]>('/rules');
  },

  async getActiveRules(): Promise<GameRule[]> {
    return apiClient.get<GameRule[]>('/rules/active');
  },

  async getRule(id: number): Promise<GameRule> {
    return apiClient.get<GameRule>(`/rules/${id}`);
  },

  async createRule(rule: CreateRuleDto): Promise<GameRule> {
    return apiClient.post<GameRule>('/rules', rule);
  },

  async updateRule(id: number, rule: UpdateRuleDto): Promise<GameRule> {
    return apiClient.put<GameRule>(`/rules/${id}`, rule);
  },

  async deleteRule(id: number): Promise<void> {
    return apiClient.delete<void>(`/rules/${id}`);
  },
};
