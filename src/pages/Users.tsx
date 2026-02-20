import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data";
import { hasPermission } from "@/lib/rbac";
import type { AdminUser } from "@/api/users";
import { usersApi } from "@/api/users";
import { UserTable } from "@/components/users/UserTable";
import { UserFilters, type StatusFilter, type VerificationFilter } from "@/components/users/UserFilters";
import { UserEditSheet } from "@/components/users/UserEditSheet";
import { UserCreateSheet } from "@/components/users/UserCreateSheet";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { TablePagination } from "@/components/TablePagination";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, userAdded, userUpdated, userRemoved } from "@/store/slices/usersSlice";

const DEFAULT_LIMIT = 10;

function displayName(user: AdminUser): string {
  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return user.phoneNumber ?? "User";
}

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { toast: toastHook } = useToast();
  const currentUser = getCurrentUser();
  const { items: users, pagination, loading, error } = useAppSelector((s) => s.users);
  const total = pagination.total;
  const totalPages = pagination.totalPages;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>("all");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const canCreate = hasPermission(currentUser.role, "users:create");
  const canUpdate = hasPermission(currentUser.role, "users:update");
  const canDelete = hasPermission(currentUser.role, "users:delete");

  const listParams = useCallback(() => {
    const isBlocked = statusFilter === "all" ? undefined : statusFilter === "inactive";
    const verificationStatus = verificationFilter === "all" ? undefined : verificationFilter;
    return { page, limit, isBlocked, verificationStatus };
  }, [page, limit, statusFilter, verificationFilter]);

  useEffect(() => {
    dispatch(fetchUsers(listParams()));
  }, [dispatch, listParams]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error, toast]);

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleVerificationChange = useCallback((value: VerificationFilter) => {
    setVerificationFilter(value);
    setPage(1);
  }, []);

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
  };

  const handleSaveEdit = useCallback(
    async (
      id: string,
      data: {
        firstName?: string;
        lastName?: string;
        verificationStatus?: "pending" | "accepted" | "rejected";
        isBlocked?: boolean;
      }
    ) => {
      const res = await usersApi.update(id, data);
      const user = (res as { user?: AdminUser }).user;
      if (user) dispatch(userUpdated(user));
      toastHook({ title: "User updated", description: "Changes saved." });
    },
    [dispatch, toastHook]
  );

  const handleDeleteClick = (user: AdminUser) => {
    setDeletingUser(user);
  };

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingUser) return;
    try {
      await usersApi.delete(deletingUser._id);
      dispatch(userRemoved(deletingUser._id));
      toastHook({
        title: "User deleted",
        description: `${displayName(deletingUser)} has been removed.`,
        variant: "destructive",
      });
      setDeletingUser(null);
      setPage(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }, [deletingUser, dispatch, toastHook]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Users</h2>
            <p className="text-muted-foreground mt-1">
              Manage user accounts and profile status.
            </p>
          </div>
          {canCreate && (
            <Button className="shrink-0" onClick={() => setCreateSheetOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create User
            </Button>
          )}
        </div>

        <UserFilters
          statusFilter={statusFilter}
          verificationFilter={verificationFilter}
          onStatusChange={handleStatusChange}
          onVerificationChange={handleVerificationChange}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <UserTable
            users={users}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
          <TablePagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            itemLabel="users"
          />
        </>
      )}

      <UserEditSheet
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={handleSaveEdit}
      />

      <UserCreateSheet
        open={createSheetOpen}
        onClose={() => setCreateSheetOpen(false)}
        onSuccess={(user) => {
          if (user) {
            if (page === 1) dispatch(userAdded(user));
            else dispatch(fetchUsers({ ...listParams(), page: 1 }));
          }
          toastHook({ title: "User created", description: "The user has been added." });
          setPage(1);
        }}
      />

      <DeleteUserDialog
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        userName={deletingUser ? displayName(deletingUser) : ""}
      />
    </div>
  );
}
