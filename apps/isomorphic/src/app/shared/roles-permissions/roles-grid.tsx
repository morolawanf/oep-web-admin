'use client';

import RoleCard from '@/app/shared/roles-permissions/role-card';
import { useRoles } from '@/hooks/use-role-management';
import cn from '@core/utils/class-names';
import { Text } from 'rizzui';

interface RolesGridProps {
  className?: string;
  gridClassName?: string;
}

export default function RolesGrid({
  className,
  gridClassName,
}: RolesGridProps) {
  const { data: roles, isLoading, error } = useRoles();

  if (isLoading) {
    return (
      <div className={cn('@container', className)}>
        <div className="flex items-center justify-center py-10">
          <Text>Loading roles...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('@container', className)}>
        <div className="flex items-center justify-center py-10">
          <Text className="text-red-500">Error loading roles</Text>
        </div>
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className={cn('@container', className)}>
        <div className="flex items-center justify-center py-10">
          <Text className="text-gray-500">No roles found</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('@container', className)}>
      <div
        className={cn(
          'grid grid-cols-1 gap-6 @[36.65rem]:grid-cols-2 @[56rem]:grid-cols-3 @[78.5rem]:grid-cols-4 @[100rem]:grid-cols-5',
          gridClassName
        )}
      >
        {roles.map((role) => (
          <RoleCard key={role._id} role={role} />
        ))}
      </div>
    </div>
  );
}
