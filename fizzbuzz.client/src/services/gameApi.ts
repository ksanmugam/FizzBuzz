import type { GameAnswerDto, GameAnswerResponse, GameStartResponse, GameSummaryDto } from '../types/game.types';
import { apiClient } from './api';

export const gameApi = {
  async startGame(): Promise<GameStartResponse> {
    return apiClient.post<GameStartResponse>('/game/start');
  },

  async submitAnswer(answer: GameAnswerDto): Promise<GameAnswerResponse> {
    return apiClient.post<GameAnswerResponse>('/game/answer', answer);
  },

  async endGame(sessionId: string): Promise<GameSummaryDto> {
    return apiClient.post<GameSummaryDto>(`/game/end/${sessionId}`);
  },

  async getGameSummary(sessionId: string): Promise<GameSummaryDto> {
    return apiClient.get<GameSummaryDto>(`/game/summary/${sessionId}`);
  },
};
