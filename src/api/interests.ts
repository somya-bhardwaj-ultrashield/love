/**
 * Interests API – all interest CRUD requests go through this module.
 */
import { adminInterestsApi, type Interest } from "@/lib/adminApi";

export type { Interest };

export interface ListInterestsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ListInterestsResponse {
  data: Interest[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const interestsApi = {
  list: (params?: ListInterestsParams) =>
    adminInterestsApi.list(params) as Promise<ListInterestsResponse>,

  create: (body: { title: string; description?: string; isActive?: boolean }) =>
    adminInterestsApi.create(body),

  update: (
    id: string,
    body: { title?: string; description?: string; isActive?: boolean }
  ) => adminInterestsApi.update(id, body),

  delete: (id: string) =>
    adminInterestsApi.delete(id),
};
