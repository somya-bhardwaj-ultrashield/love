/**
 * CMS API – fetch and update About, T&C, Privacy content.
 */
import { adminCmsApi, type CmsItem, type CmsType } from "@/lib/adminApi";

export type { CmsItem, CmsType };

export const cmsApi = {
  list: () => adminCmsApi.list(),
  update: (body: { type: CmsType; description?: string }) =>
    adminCmsApi.update(body),
};
