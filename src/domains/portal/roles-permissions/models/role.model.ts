export interface Role {
  id: number
  name: string
  slug: string
  description?: string
  is_system_role: boolean
  organization_id?: number
  permissions?: Permission[]
  user_count?: number
  created_at?: string
  updated_at?: string
}

export interface Permission {
  id: number
  name: string
  slug: string
  module: string
  description?: string
  organization_id?: number
}

export interface HRModule {
  name: string
  module: string
  permissions: Permission[]
}

export interface PermissionMatrix {
  [module: string]: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
}

