export type Role = "Admin" | "Manager" | "User";

export type Module = "users";

export type Action = "create" | "read" | "update" | "delete";

export type Permission = `${Module}:${Action}`;

const rolePermissions: Record<Role, Permission[]> = {
  Admin: ["users:create", "users:read", "users:update", "users:delete"],
  Manager: ["users:create", "users:read", "users:update"],
  User: ["users:read"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissions[role] ?? [];
}

export const allRoles: Role[] = ["Admin", "Manager", "User"];

export const allModules: Module[] = ["users"];

export const allActions: Action[] = ["create", "read", "update", "delete"];

export function generatePermissions(): Permission[] {
  const perms: Permission[] = [];
  for (const mod of allModules) {
    for (const action of allActions) {
      perms.push(`${mod}:${action}`);
    }
  }
  return perms;
}
