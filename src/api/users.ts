/**
 * Users API – all user CRUD requests go through this module.
 */
import {
  adminUsersApi,
  type AdminUser,
  type CreateUserPayload,
  type VerificationStatus,
} from "@/lib/adminApi";

export type { AdminUser, CreateUserPayload, VerificationStatus };

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: VerificationStatus;
  isBlocked?: boolean;
}

export interface ListUsersResponse {
  data: AdminUser[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const usersApi = {
  list: (params?: ListUsersParams) =>
    adminUsersApi.list(params) as Promise<ListUsersResponse>,

  getById: (id: string) =>
    adminUsersApi.getById(id),

  create: (body: CreateUserPayload) =>
    adminUsersApi.create(body),

  update: (
    id: string,
    body: Partial<{
      firstName: string;
      lastName: string;
      verificationStatus: VerificationStatus;
      isBlocked: boolean;
    }>
  ) => adminUsersApi.update(id, body),

  delete: (id: string) =>
    adminUsersApi.delete(id),
};
