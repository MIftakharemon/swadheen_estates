import type { Property } from '@/types/property'

export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'SALES_AGENT' | 'CONTENT_EDITOR' | 'CUSTOMER'
export type Permission =
  'property:read' | 'property:write' | 'lead:read' | 'lead:write' | 'settings:write' | 'reports:read'

const permissionMap: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: [
    'property:read',
    'property:write',
    'lead:read',
    'lead:write',
    'settings:write',
    'reports:read',
  ],
  MANAGER: ['property:read', 'property:write', 'lead:read', 'lead:write', 'reports:read'],
  SALES_AGENT: ['property:read', 'lead:read', 'lead:write'],
  CONTENT_EDITOR: ['property:read', 'property:write'],
  CUSTOMER: ['property:read'],
}

export type AccessContext = { userId: string; role: Role; assignedUserId?: string }

export function can(
  context: AccessContext | null,
  permission: Permission,
  resource?: { assignedTo?: string } | Property,
): boolean {
  if (!context || !permissionMap[context.role].includes(permission)) return false
  if (
    permission.startsWith('lead:') &&
    context.role === 'SALES_AGENT' &&
    resource &&
    'assignedTo' in resource
  ) {
    return resource.assignedTo === context.userId
  }
  return true
}

export function hasTwoFactorRequirement(role: Role): boolean {
  return role === 'SUPER_ADMIN' || role === 'MANAGER'
}
