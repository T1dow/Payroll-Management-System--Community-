import { UserRole } from '../../App';

export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'super-admin':
      return 'bg-red-100 text-red-800';
    case 'payroll-admin':
      return 'bg-blue-100 text-blue-800';
    case 'hr':
      return 'bg-green-100 text-green-800';
    case 'manager':
      return 'bg-purple-100 text-purple-800';
    case 'employee':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusBadgeColor = (status: 'active' | 'inactive'): string => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const canManageUsers = (role: UserRole): boolean => {
  return role === 'super-admin';
};

export const canManageSystem = (role: UserRole): boolean => {
  return ['super-admin', 'payroll-admin'].includes(role);
};