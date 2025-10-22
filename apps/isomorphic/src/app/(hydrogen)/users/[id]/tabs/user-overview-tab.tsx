'use client';

import { useState } from 'react';
import { Title, Text, Button, Select } from 'rizzui';
import { PiWarning, PiTrash, PiUserGear } from 'react-icons/pi';
import { Modal } from '@core/modal-views/modal';
import type { User, UserRole } from '@/types/user';

interface UserOverviewTabProps {
  user: User;
  totalReturns: number;
  averageRating: number;
  onSuspend: () => void;
  onDelete: () => void;
  onUpdateRole: (role: UserRole) => void;
}

export default function UserOverviewTab({
  user,
  totalReturns,
  averageRating,
  onSuspend,
  onDelete,
  onUpdateRole,
}: UserOverviewTabProps) {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'owner', label: 'Owner' },
  ];

  const handleUpdateRole = () => {
    onUpdateRole(selectedRole);
    setShowRoleModal(false);
  };

  const handleSuspend = () => {
    onSuspend();
    setShowSuspendModal(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 @lg:grid-cols-2">
      {/* User Information */}
      <div className="rounded-lg border border-muted bg-white p-6">
        <Title as="h3" className="mb-4 text-lg font-semibold">
          User Information
        </Title>
        <div className="space-y-3">
          <div>
            <Text className="text-sm text-gray-600">Full Name</Text>
            <Text className="font-medium">
              {user.firstName} {user.lastName}
            </Text>
          </div>
          <div>
            <Text className="text-sm text-gray-600">Email</Text>
            <Text className="font-medium">{user.email}</Text>
          </div>
          <div>
            <Text className="text-sm text-gray-600">Role</Text>
            <Text className="font-medium capitalize">{user.role}</Text>
          </div>
          {user.country && (
            <div>
              <Text className="text-sm text-gray-600">Country</Text>
              <Text className="font-medium">{user.country}</Text>
            </div>
          )}
          {user.dob && (
            <div>
              <Text className="text-sm text-gray-600">Date of Birth</Text>
              <Text className="font-medium">
                {new Date(user.dob).toLocaleDateString()}
              </Text>
            </div>
          )}
          <div>
            <Text className="text-sm text-gray-600">Joined Date</Text>
            <Text className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="rounded-lg border border-muted bg-white p-6">
        <Title as="h3" className="mb-4 text-lg font-semibold">
          Statistics
        </Title>
        <div className="space-y-3">
          <div>
            <Text className="text-sm text-gray-600">Total Returns</Text>
            <Text className="font-medium">{totalReturns}</Text>
          </div>
          <div>
            <Text className="text-sm text-gray-600">Average Review Rating</Text>
            <Text className="font-medium">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No reviews yet'}
            </Text>
          </div>
          <div>
            <Text className="text-sm text-gray-600">Account Status</Text>
            <Text className="font-medium">
              {user.suspended ? 'Suspended' : 'Active'}
            </Text>
          </div>
          <div>
            <Text className="text-sm text-gray-600">Email Verification</Text>
            <Text className="font-medium">
              {user.emailVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-full rounded-lg border border-muted bg-white p-6">
        <Title as="h3" className="mb-4 text-lg font-semibold">
          User Actions
        </Title>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setShowRoleModal(true)}
            variant="outline"
            className="h-10"
          >
            <PiUserGear className="me-2 size-5" />
            Update Role
          </Button>
          <Button
            onClick={() => setShowSuspendModal(true)}
            variant="outline"
            color={user.suspended ? 'secondary' : 'danger'}
            className="h-10"
          >
            <PiWarning className="me-2 size-5" />
            {user.suspended ? 'Unsuspend User' : 'Suspend User'}
          </Button>
          <Button
            onClick={() => setShowDeleteModal(true)}
            variant="outline"
            color="danger"
            className="h-10"
          >
            <PiTrash className="me-2 size-5" />
            Delete User
          </Button>
        </div>
      </div>

      {/* Update Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        containerClassName="max-w-md"
      >
        <div className="p-6">
          <Title as="h3" className="mb-4 text-lg font-semibold">
            Update User Role
          </Title>
          <Text className="mb-4 text-gray-600">
            Select a new role for {user.firstName} {user.lastName}
          </Text>
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={(value: string) => setSelectedRole(value as UserRole)}
            displayValue={(selected: string) =>
              roleOptions.find((option) => option.value === selected)?.label || 'User'
            }
            className="mb-4"
          />
          <div className="flex gap-3">
            <Button onClick={handleUpdateRole} className="flex-1">
              Update Role
            </Button>
            <Button onClick={() => setShowRoleModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Suspend/Unsuspend Modal */}
      <Modal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        containerClassName="max-w-md"
      >
        <div className="p-6">
          <Title as="h3" className="mb-4 text-lg font-semibold">
            {user.suspended ? 'Unsuspend User' : 'Suspend User'}
          </Title>
          <Text className="mb-4 text-gray-600">
            Are you sure you want to {user.suspended ? 'unsuspend' : 'suspend'} {user.firstName}{' '}
            {user.lastName}?
          </Text>
          <div className="flex gap-3">
            <Button onClick={handleSuspend} color={user.suspended ? 'secondary' : 'danger'} className="flex-1">
              {user.suspended ? 'Unsuspend' : 'Suspend'}
            </Button>
            <Button onClick={() => setShowSuspendModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        containerClassName="max-w-md"
      >
        <div className="p-6">
          <Title as="h3" className="mb-4 text-lg font-semibold text-red-600">
            Delete User
          </Title>
          <Text className="mb-4 text-gray-600">
            Are you sure you want to delete {user.firstName} {user.lastName}? This action cannot be
            undone.
          </Text>
          <div className="flex gap-3">
            <Button onClick={handleDelete} color="danger" className="flex-1">
              Delete
            </Button>
            <Button onClick={() => setShowDeleteModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
