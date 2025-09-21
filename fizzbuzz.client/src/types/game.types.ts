import { GameRule } from "./rule.types";

export interface GameStartResponse {
  sessionId: string;
  number: number;
  rules: GameRule[];
}

export interface GameAnswerDto {
  sessionId: string;
  number: number;
  answer: string;
}

export interface GameAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  nextNumber: number;
  gameEnded: boolean;
}

export interface GameSummaryDto {
  sessionId: string;
  startedAt: string;
  endedAt: string;
  duration: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  questions: QuestionSummaryDto[];
}

export interface QuestionSummaryDto {
  number: number;
  expectedAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface GameState {
  sessionId: string | null;
  currentNumber: number | null;
  rules: GameRule[];
  isPlaying: boolean;
  score: {
    correct: number;
    total: number;
  };
  lastResult: {
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
  } | null;
}