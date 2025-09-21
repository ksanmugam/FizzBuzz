import React, { useState } from 'react';
import type { CreateRuleDto, GameRule, UpdateRuleDto } from '../../types/rule.types';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';

interface RuleFormProps {
  rule?: GameRule;
  onSubmit: (data: CreateRuleDto) => Promise<void> | ((id: number, data: UpdateRuleDto) => Promise<void>);
  onCancel: () => void;
  loading: boolean;
}

export const RuleForm: React.FC<RuleFormProps> = ({ rule, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    divisor: rule?.divisor || '',
    replacementText: rule?.replacementText || '',
    isActive: rule?.isActive ?? true,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const divisor = parseInt(formData.divisor.toString());
    if (isNaN(divisor) || divisor < 1) {
      setFormError('Divisor must be a positive number');
      return;
    }

    if (!formData.replacementText.trim()) {
      setFormError('Replacement text is required');
      return;
    }

    if (formData.replacementText.trim().length > 50) {
      setFormError('Replacement text must be 50 characters or less');
      return;
    }

    try {
      await onSubmit({
        divisor,
        replacementText: formData.replacementText.trim(),
        isActive: formData.isActive,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <Box bg="red.100" borderWidth="1px" borderColor="red.400" textColor="red.700" px={3} py={2} rounded="md">
          <Text fontSize="sm">{formError}</Text>
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Divisor *</FormLabel>
          <Input
            type="number"
            min={1}
            value={formData.divisor}
            onChange={(e) => setFormData(prev => ({ ...prev, divisor: e.target.value }))}
            placeholder="e.g., 3"
            isDisabled={loading}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Replacement Text *</FormLabel>
          <Input
            type="text"
            value={formData.replacementText}
            onChange={(e) => setFormData(prev => ({ ...prev, replacementText: e.target.value }))}
            placeholder="e.g., Fizz"
            maxLength={50}
            isDisabled={loading}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center" justifyContent="flex-start">
          <Checkbox
            isChecked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            isDisabled={loading}
          >
            <Text fontSize="sm" fontWeight="medium" ml={2}>Active</Text>
          </Checkbox>
        </FormControl>
      </SimpleGrid>

      <Flex mt={2} className="space-x-2" gap={2}>
        <Button colorScheme="blue" type="submit" isDisabled={loading}>
          {loading ? 'Saving...' : (rule ? 'Update Rule' : 'Create Rule')}
        </Button>
        <Button colorScheme="gray" type="button" onClick={onCancel} isDisabled={loading}>
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};
