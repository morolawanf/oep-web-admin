'use client';

import { useState } from 'react';
import {
  Modal,
  Button,
  Title,
  Text,
  Checkbox,
  ActionIcon,
} from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import { useEditUserRoles, type Role } from '@/hooks/use-role-management';
import toast from 'react-hot-toast';

interface EditRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRoles: Role[];
  allRoles: Role[];
}

export default function EditRolesModal({
  isOpen,
  onClose,
  userId,
  currentRoles,
  allRoles,
}: EditRolesModalProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    currentRoles.map((r) => r._id)
  );
  const editUserRolesMutation = useEditUserRoles();

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async () => {
    if (selectedRoleIds.length === 0) {
      toast.error('Please select at least one role');
      return;
    }

    try {
      await editUserRolesMutation.mutateAsync({
        userId,
        payload: { roleIds: selectedRoleIds },
      });
      toast.success('User roles updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update user roles');
      console.error('Error updating roles:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-xl font-semibold">
            Edit User Roles
          </Title>
          <ActionIcon size="sm" variant="text" onClick={onClose}>
            <PiXBold className="h-5 w-5" />
          </ActionIcon>
        </div>

        <div className="mb-6">
          <Text className="mb-4 text-gray-600">
            Select the roles you want to assign to this user:
          </Text>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allRoles.map((role) => (
              <div
                key={role._id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-gray-300 transition-colors"
              >
                <Checkbox
                  checked={selectedRoleIds.includes(role._id)}
                  onChange={() => handleToggleRole(role._id)}
                  label={
                    <div>
                      <Text className="font-semibold">{role.name}</Text>
                      {role.description && (
                        <Text className="text-sm text-gray-500">
                          {role.description}
                        </Text>
                      )}
                      <Text className="text-xs text-gray-400 mt-1">
                        {role.permissions.length}{' '}
                        {role.permissions.length === 1
                          ? 'permission'
                          : 'permissions'}
                      </Text>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={editUserRolesMutation.isPending}
            disabled={selectedRoleIds.length === 0}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
