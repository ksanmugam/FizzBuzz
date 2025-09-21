import { BASE_URL } from '../../constants/game.constants';
import { gameApi } from '../gameApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('gameApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('startGame', () => {
    test('calls correct endpoint and returns game start data', async () => {
      const mockResponse = {
        sessionId: 'test-session-id',
        number: 42,
        rules: [
          { id: 1, divisor: 3, replacementText: 'Fizz', isActive: true }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: { get: () => 'application/json' }
      });

      const result = await gameApi.startGame();

      expect(fetch).toHaveBeenCalledWith(
        BASE_URL + '/game/start',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('throws error when request fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Server Error'
      });

      await expect(gameApi.startGame()).rejects.toThrow('Server Error');
    });
  });

  describe('submitAnswer', () => {
    test('submits answer and returns response', async () => {
      const answerDto = {
        sessionId: 'test-session',
        number: 15,
        answer: 'FizzBuzz'
      };

      const mockResponse = {
        isCorrect: true,
        correctAnswer: 'FizzBuzz',
        nextNumber: 23,
        gameEnded: false
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: { get: () => 'application/json' }
      });

      const result = await gameApi.submitAnswer(answerDto);

      expect(fetch).toHaveBeenCalledWith(
        BASE_URL + '/game/answer',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(answerDto),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });
});