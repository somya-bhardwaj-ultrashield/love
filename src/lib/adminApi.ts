/**
 * Admin panel API client for backend /api/v1/admin
 */

const BASE_URL = process.env.VITE_ADMIN_BACKEND_API_URL;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  [key: string]: unknown;
  data?: T;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T & ApiResponse> {
  const json = (await res.json()) as ApiResponse & T;
  if (!res.ok) {
    const message = (json as { message?: string }).message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return json as T & ApiResponse;
}

export const adminApi = {
  async post<T>(path: string, body?: unknown): Promise<T & ApiResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T & ApiResponse> {
    const search = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';
    const res = await fetch(`${BASE_URL}${path}${search}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(res);
  },

  async patch<T>(path: string, body?: unknown): Promise<T & ApiResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown): Promise<T & ApiResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string): Promise<T & ApiResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(res);
  },
};

// Admin User (from DB)
export type VerificationStatus = 'pending' | 'accepted' | 'rejected';

export interface AdminUser {
  _id: string;
  phoneNumber?: string;
  countryCode?: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  verificationStatus?: VerificationStatus;
  isBlocked?: boolean;
  createdAt: string;
  updatedAt?: string;
  /** Populated: { _id, title }[] */
  interests?: { _id: string; title: string }[];
  /** Populated: { _id, title } or null */
  occupation?: { _id: string; title: string } | null;
}

export interface CreateUserPayload {
  phoneNumber: string;
  countryCode?: string;
  firstName?: string | null;
  lastName?: string | null;
  verificationStatus?: VerificationStatus;
  isBlocked?: boolean;
  gender?: string | null;
  sexualOrientation?: string | null;
  height?: number | null;
  bio?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  interests?: string[];
  occupation?: string | null;
  relationshipGoal?: string | null;
  smokingHabit?: string | null;
  drinkingHabit?: string | null;
  exerciseHabit?: string | null;
  education?: string | null;
}

export const adminUsersApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    verificationStatus?: VerificationStatus;
    isBlocked?: boolean;
  }) =>
    adminApi.get<{
      data: AdminUser[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>('/users', params as Record<string, string | number | boolean | undefined>),
  getById: (id: string) =>
    adminApi.get<{ user: AdminUser }>(`/users/${id}`),
  create: (body: CreateUserPayload) =>
    adminApi.post<{ user: AdminUser }>('/users', body),
  update: (id: string, body: Partial<{ firstName: string; lastName: string; verificationStatus: VerificationStatus; isBlocked: boolean }>) =>
    adminApi.patch<{ user: AdminUser }>(`/users/${id}`, body),
  delete: (id: string) =>
    adminApi.delete<{ deleted: boolean; id: string }>(`/users/${id}`),
};

// Auth API
export const adminAuthApi = {
  login: (email: string, password: string) =>
    adminApi.post<{ accessToken: string }>('/auth/login', { email, password }),

  forgotPassword: (email: string) =>
    adminApi.post<{ message: string; otpHint?: string }>('/auth/forgot-password', { email }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    adminApi.post<{ message: string }>('/auth/reset-password', { email, otp, newPassword }),
};

// Interest type and API
export interface Interest {
  _id: string;
  title: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminInterestsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }) =>
    adminApi.get<{ data: Interest[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
      '/interests',
      params as Record<string, string | number | boolean | undefined>
    ),
  create: (body: { title: string; description?: string; isActive?: boolean }) =>
    adminApi.post<{ interest: Interest }>('/interests', body),
  update: (id: string, body: { title?: string; description?: string; isActive?: boolean }) =>
    adminApi.patch<{ interest: Interest }>(`/interests/${id}`, body),
  delete: (id: string) => adminApi.delete<{ deleted: boolean; id: string }>(`/interests/${id}`),
};

// Occupation type and API
export interface Occupation {
  _id: string;
  title: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminOccupationsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }) =>
    adminApi.get<{
      data: Occupation[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>('/occupations', params as Record<string, string | number | boolean | undefined>),
  create: (body: { title: string; description?: string; isActive?: boolean }) =>
    adminApi.post<{ occupation: Occupation }>('/occupations', body),
  update: (id: string, body: { title?: string; description?: string; isActive?: boolean }) =>
    adminApi.patch<{ occupation: Occupation }>(`/occupations/${id}`, body),
  delete: (id: string) => adminApi.delete<{ deleted: boolean; id: string }>(`/occupations/${id}`),
};

// CMS types: "about" | "t&c" | "privacy"
export type CmsType = 'about' | 't&c' | 'privacy';

export interface CmsItem {
  _id: string;
  type: CmsType;
  description: string;
  createdAt: string;
}

export const adminCmsApi = {
  list: () =>
    adminApi.get<{ items: CmsItem[] }>('/cms'),
  update: (body: { type: CmsType; description?: string }) =>
    adminApi.put<{ cms: CmsItem }>('/cms', body),
};
