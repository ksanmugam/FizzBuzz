import React, { useState } from 'react';
import { useRules } from '../../hooks/useRules';
import { RuleList } from './RuleList';
import { RuleForm } from './RuleForm';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import { CreateRuleDto, UpdateRuleDto } from '../../types/rule.types';
import { useErrorToast, useSuccessToast } from '../../hooks/useToasts';
import { instructions } from '../../utils/rules';

export const AdminPanel: React.FC = () => {
  const { 
    rules, 
    isLoading, 
    isError, 
    error, 
    createRule, 
    updateRule, 
    deleteRule 
  } = useRules();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const handleCreateRule = async (ruleData: CreateRuleDto) => {
    try {
      await createRule(ruleData);
      setShowCreateForm(false);
      successToast({ title: "Rule created successfully!" });
    } catch {
      errorToast({ description: 'Failed to create rule' });
    }
  };

  const handleUpdateRule = async (id: number, updates: UpdateRuleDto) => {
    try {
      await updateRule({ id, updates });
      setEditingRuleId(null);
      successToast({ title: "Rule updated successfully!" });
    } catch {
      errorToast({ description: 'Failed to update rule' });
    }
  };

  const handleDeleteRule = async (id: number) => {
    try {
      await deleteRule(id);
      successToast({ title: "Rule deleted successfully!" });
    } catch {
      errorToast({ description: 'Failed to delete rule' });
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await updateRule({ id, updates: { isActive: !isActive } });
      successToast({ title: `Rule ${!isActive ? 'activated' : 'deactivated'} successfully!` });
    } catch {
      errorToast({ description: 'Failed to toggle rule status' });
    }
  };

  return (
    <Box bg="white" className="max-w-6xl mx-auto p-6">
      <Box rounded="lg" shadow="lg" p={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Game Rules Management
          </Text>
          <Button
            colorScheme="green"
            onClick={() => setShowCreateForm(true)}
            isDisabled={isLoading}
          >
            Add New Rule
          </Button>
        </Flex>

        {/* Error Display */}
        {isError && error && (
          <Alert status="error" mb={4} rounded="sm">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <VStack spacing={2} mb={6}>
            <Spinner size="lg" color="blue.500" />
            <Text color="gray.600">Loading...</Text>
          </VStack>
        )}

        {/* Create Rule Form */}
        {showCreateForm && (
          <Box mb={6} p={4} borderWidth="1px" borderColor="gray.300" rounded="lg">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="lg" fontWeight="semibold">
                Create New Rule
              </Text>
              <CloseButton size="md" variant="ghost" onClick={() => setShowCreateForm(false)} />
            </Flex>
            <RuleForm
              onSubmit={handleCreateRule}
              onCancel={() => setShowCreateForm(false)}
              loading={isLoading}
            />
          </Box>
        )}

        {/* Rules List */}
        {!isLoading && (
          <RuleList
            rules={rules}
            editingRuleId={editingRuleId}
            onEdit={setEditingRuleId}
            onUpdate={handleUpdateRule}
            onDelete={handleDeleteRule}
            onToggleActive={handleToggleActive}
            loading={isLoading}
          />
        )}

        {/* Game Rules Info */}
        <Box mt={8} p={4} bg="blue.50" rounded="lg">
          <Text fontWeight="semibold" color="blue.800" mb={2}>
            How It Works:
          </Text>
          <VStack align="start" spacing={1}>
            {instructions.map((instruction) => (
              <Text key={instruction.id} fontSize="sm" color="blue.700">
                • {instruction.text}
              </Text>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};
