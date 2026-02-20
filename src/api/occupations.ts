/**
 * Occupations API – all occupation CRUD requests go through this module.
 */
import { adminOccupationsApi, type Occupation } from "@/lib/adminApi";

export type { Occupation };

export interface ListOccupationsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ListOccupationsResponse {
  data: Occupation[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const occupationsApi = {
  list: (params?: ListOccupationsParams) =>
    adminOccupationsApi.list(params) as Promise<ListOccupationsResponse>,

  create: (body: { title: string; description?: string; isActive?: boolean }) =>
    adminOccupationsApi.create(body),

  update: (
    id: string,
    body: { title?: string; description?: string; isActive?: boolean }
  ) => adminOccupationsApi.update(id, body),

  delete: (id: string) =>
    adminOccupationsApi.delete(id),
};
