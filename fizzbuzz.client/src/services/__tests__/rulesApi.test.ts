import { BASE_URL } from '../../constants/game.constants';
import type { CreateRuleDto, UpdateRuleDto } from '../../types/rule.types';
import { rulesApi } from '../rulesApi';

global.fetch = jest.fn();

describe('rulesApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getAllRules', () => {
    test('fetches all rules successfully', async () => {
      const mockRules = [
        { id: 1, divisor: 3, replacementText: 'Fizz', isActive: true },
        { id: 2, divisor: 5, replacementText: 'Buzz', isActive: true }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRules,
        headers: { get: () => 'application/json' }
      });

      const result = await rulesApi.getAllRules();

      expect(fetch).toHaveBeenCalledWith(
        BASE_URL + '/rules',
        expect.objectContaining({ method: 'GET' })
      );

      expect(result).toEqual(mockRules);
    });
  });

  describe('createRule', () => {
    test('creates new rule successfully', async () => {
      const newRule: CreateRuleDto = {
        divisor: 7,
        replacementText: 'Lucky',
        isActive: true
      };

      const createdRule = {
        id: 3,
        ...newRule,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdRule,
        headers: { get: () => 'application/json' }
      });

      const result = await rulesApi.createRule(newRule);

      expect(fetch).toHaveBeenCalledWith(
        BASE_URL + '/rules',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newRule)
        })
      );

      expect(result).toEqual(createdRule);
    });
  });

  describe('updateRule', () => {
    test('updates rule successfully', async () => {
      const updates: UpdateRuleDto = {
        replacementText: 'Updated Text'
      };

      const updatedRule = {
        id: 1,
        divisor: 3,
        replacementText: 'Updated Text',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T01:00:00Z'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedRule,
        headers: { get: () => 'application/json' }
      });

      const result = await rulesApi.updateRule(1, updates);

      expect(fetch).toHaveBeenCalledWith(
        BASE_URL + '/rules/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updates)
        })
      );

      expect(result).toEqual(updatedRule);
    });
  });

  describe('deleteRule', () => {
    test('deletes rule successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => '',
        headers: { get: () => null }
      });

      await rulesApi.deleteRule(1);

      expect(fetch).toHaveBeenCalledWith(
        BASE_URL + '/rules/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});