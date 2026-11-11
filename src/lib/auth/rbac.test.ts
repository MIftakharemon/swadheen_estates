import { describe, expect, it } from 'vitest'
import { can, hasTwoFactorRequirement } from '@/lib/auth/rbac'

describe('RBAC policy', () => {
  it('denies missing context by default', () => {
    expect(can(null, 'property:write')).toBe(false)
  })

  it('allows managers to manage inventory but not settings', () => {
    const manager = { userId: 'manager-1', role: 'MANAGER' as const }
    expect(can(manager, 'property:write')).toBe(true)
    expect(can(manager, 'settings:write')).toBe(false)
  })

  it('limits sales agents to their assigned leads', () => {
    const agent = { userId: 'agent-1', role: 'SALES_AGENT' as const }
    expect(can(agent, 'lead:write', { assignedTo: 'agent-1' })).toBe(true)
    expect(can(agent, 'lead:write', { assignedTo: 'agent-2' })).toBe(false)
  })

  it('requires two factor for privileged staff roles', () => {
    expect(hasTwoFactorRequirement('SUPER_ADMIN')).toBe(true)
    expect(hasTwoFactorRequirement('MANAGER')).toBe(true)
    expect(hasTwoFactorRequirement('SALES_AGENT')).toBe(false)
  })
})
