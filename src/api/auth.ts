/**
 * Auth API – all auth requests go through this module.
 */
import { adminAuthApi } from "@/lib/adminApi";

export const authApi = {
  login: (email: string, password: string) =>
    adminAuthApi.login(email, password),

  forgotPassword: (email: string) =>
    adminAuthApi.forgotPassword(email),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    adminAuthApi.resetPassword(email, otp, newPassword),
};
