import React from 'react';
import type { GameRule, UpdateRuleDto } from '../../types/rule.types';
import {
  Text,
  VStack,
} from '@chakra-ui/react';
import { RuleItem } from './RuleItem';

interface RuleListProps {
  rules: GameRule[];
  editingRuleId: number | null;
  onEdit: (id: number | null) => void;
  onUpdate: (id: number, updates: UpdateRuleDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleActive: (id: number, isActive: boolean) => Promise<void>;
  loading: boolean;
}

export const RuleList: React.FC<RuleListProps> = ({
  rules,
  editingRuleId,
  onEdit,
  onUpdate,
  onDelete,
  onToggleActive,
  loading,
}) => {
  if (rules.length === 0) {
    return (
      <Text textAlign="center" py={8} color="gray.500">
        No rules found. Create your first rule to get started!
      </Text>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="semibold" color="gray.800">
        Existing Rules ({rules.length})
      </Text>

      {rules.map((rule) => (
        <RuleItem
          key={rule.id}
          rule={rule}
          editingRuleId={editingRuleId}
          onEdit={onEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          loading={loading}
        />
      ))}
    </VStack>
  );
};
