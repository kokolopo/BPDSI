import { useAuthStore } from "@/stores/auth.store";
import { hasPermission, Permission } from "./permissions";

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  const can = (permission: Permission): boolean => {
    if (!isAuthenticated || !user) return false;
    return hasPermission(user.role, permission);
  };

  const cannot = (permission: Permission): boolean => {
    return !can(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((p) => can(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((p) => can(p));
  };

  return {
    can,
    cannot,
    hasAnyPermission,
    hasAllPermissions,
    role: user?.role,
    isSuperAdmin: user?.role === "super_admin",
  };
};
