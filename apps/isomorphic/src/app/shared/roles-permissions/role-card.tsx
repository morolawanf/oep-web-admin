'use client';

import { PiDotsThreeBold } from 'react-icons/pi';
import { Title, ActionIcon, Dropdown, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import UserCog from '@core/components/icons/user-cog';
import { useModal } from '@/app/shared/modal-views/use-modal';
import ModalButton from '@/app/shared/modal-button';
import EditRole from '@/app/shared/roles-permissions/edit-role';
import CreateUser from '@/app/shared/roles-permissions/create-user';
import { useDeleteRole, type Role } from '@/hooks/use-role-management';

interface RoleCardProps {
  role: Role;
  className?: string;
}

export default function RoleCard({ role, className }: RoleCardProps) {
  const { openModal, closeModal } = useModal();
  const deleteRoleMutation = useDeleteRole();

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete the "${role.name}" role?`)
    ) {
      try {
        await deleteRoleMutation.mutateAsync(role._id);
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  return (
    <div className={cn('rounded-lg border border-muted p-5', className)}>
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">

          <div>
            <Title as="h5" className="font-medium">
              {role.name}
            </Title>
            {!role.isActive && (
              <Text className="text-xs text-red-500">Inactive</Text>
            )}
          </div>
        </div>

        <Dropdown className={className} placement="bottom-end">
          <Dropdown.Trigger>
            <ActionIcon
              as="span"
              variant="text"
              className="ml-auto h-auto w-auto p-1"
            >
              <PiDotsThreeBold className="h-auto w-6" />
            </ActionIcon>
          </Dropdown.Trigger>
          <Dropdown.Menu className="!z-0">
            <Dropdown.Item className="gap-2 text-xs sm:text-sm" onClick={() =>
                  openModal({
                    customSize: 700,
                    view: <EditRole role={role} />
                  })
                }>

                Edit Role

            </Dropdown.Item>
            <Dropdown.Item
              className="gap-2 text-xs text-red-500 sm:text-sm"
              onClick={handleDelete}
            >
              Delete Role
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

      {role.description && (
        <Text className=" text-sm text-gray-500">{role.description}</Text>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Text className="text-sm text-gray-600 font-semibold">
          {role.permissions.length} permission
          {role.permissions.length !== 1 ? 's' : ''}
        </Text>
      </div>
{/* 
      <ModalButton
        customSize={700}
        variant="outline"
        label="Edit Role"
        icon={<UserCog className="h-5 w-5" />}
        view={<EditRole role={role} />}
        className="mt-6 w-full items-center gap-1 text-gray-800"
      /> */}
    </div>
  );
}
