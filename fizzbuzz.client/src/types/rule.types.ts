export interface GameRule {
  id: number;
  divisor: number;
  replacementText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRuleDto {
  divisor: number;
  replacementText: string;
  isActive: boolean;
}

export interface UpdateRuleDto {
  divisor?: number;
  replacementText?: string;
  isActive?: boolean;
}