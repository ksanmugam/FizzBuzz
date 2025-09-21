import { memo, useRef } from "react";
import { GameRule, UpdateRuleDto } from "../../types/rule.types";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { RuleForm } from "./RuleForm";

export const RuleItem = memo(
  ({
    rule,
    editingRuleId,
    onEdit,
    onUpdate,
    onDelete,
    onToggleActive,
    loading,
  }: {
    rule: GameRule;
    editingRuleId: number | null;
    onEdit: (id: number | null) => void;
    onUpdate: (id: number, updates: UpdateRuleDto) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onToggleActive: (id: number, isActive: boolean) => Promise<void>;
    loading: boolean;
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        {editingRuleId === rule.id ? (
          <RuleForm
            rule={rule}
            onSubmit={(updates) => onUpdate(rule.id, updates)}
            onCancel={() => onEdit(null)}
            loading={loading}
          />
        ) : (
          <Flex justify="space-between" gap={2} align="center">
            <HStack spacing={4} align="center">
              <Badge
                colorScheme={rule.isActive ? 'green' : 'gray'}
                px={3}
                py={1}
                fontSize="sm"
                fontWeight="medium"
                borderRadius="full"
              >
                {rule.isActive ? 'Active' : 'Inactive'}
              </Badge>

              <Text fontSize="lg" fontFamily="mono">
                <Text as="span" color="gray.600">
                  n %{' '}
                </Text>
                <Text as="span" fontWeight="bold">
                  {rule.divisor}
                </Text>
                <Text as="span" color="gray.600">
                  {' '}
                  === 0 →{' '}
                </Text>
                <Text as="span" fontWeight="bold" color="blue.600">
                  "{rule.replacementText}"
                </Text>
              </Text>
            </HStack>

            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme={rule.isActive ? 'yellow' : 'green'}
                onClick={() => onToggleActive(rule.id, rule.isActive)}
                isDisabled={loading}
              >
                {rule.isActive ? 'Deactivate' : 'Activate'}
              </Button>

              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => onEdit(rule.id)}
                isDisabled={loading}
              >
                Edit
              </Button>

              <Button size="sm" colorScheme="red" onClick={onOpen} isDisabled={loading}>
                Delete
              </Button>

              <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Rule
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          onDelete(rule.id);
                          onClose();
                        }}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </HStack>
          </Flex>
        )}
      </Box>
    );
  }
);