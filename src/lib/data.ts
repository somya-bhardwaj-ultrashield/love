import { Role } from "./rbac";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: "Active" | "Inactive";
  createdAt: string;
}

const initialUsers: User[] = [
  { id: "1", firstName: "Alice", lastName: "Johnson", email: "alice@example.com", role: "Admin", status: "Active", createdAt: "2024-12-01" },
  { id: "2", firstName: "Bob", lastName: "Smith", email: "bob@example.com", role: "Manager", status: "Active", createdAt: "2024-12-05" },
  { id: "3", firstName: "Charlie", lastName: "Davis", email: "charlie@example.com", role: "User", status: "Active", createdAt: "2025-01-10" },
  { id: "4", firstName: "Diana", lastName: "Lee", email: "diana@example.com", role: "User", status: "Inactive", createdAt: "2025-01-15" },
  { id: "5", firstName: "Edward", lastName: "Brown", email: "edward@example.com", role: "Manager", status: "Active", createdAt: "2025-01-20" },
  { id: "6", firstName: "Fiona", lastName: "Clark", email: "fiona@example.com", role: "User", status: "Active", createdAt: "2025-02-01" },
  { id: "7", firstName: "George", lastName: "Miller", email: "george@example.com", role: "User", status: "Inactive", createdAt: "2025-02-05" },
  { id: "8", firstName: "Hannah", lastName: "Wilson", email: "hannah@example.com", role: "Admin", status: "Active", createdAt: "2025-02-08" },
];

const STORAGE_KEY = "admin_panel_users";
const CURRENT_USER_KEY = "admin_panel_current_user";

function getStoredUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers;
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getUsers(): User[] {
  return getStoredUsers();
}

export function getUserById(id: string): User | undefined {
  return getStoredUsers().find((u) => u.id === id);
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const users = getStoredUsers();
  const newUser: User = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt">>): User | undefined {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

export function getCurrentUser(): User {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (stored) return JSON.parse(stored);
  const admin = getStoredUsers().find((u) => u.role === "Admin") ?? getStoredUsers()[0];
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(admin));
  return admin;
}

export function setCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}
