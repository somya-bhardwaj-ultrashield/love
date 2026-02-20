import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Interest } from "@/api/interests";
import { interestsApi } from "@/api/interests";
import { InterestTable } from "@/components/interests/InterestTable";
import { InterestDrawer } from "@/components/interests/InterestDrawer";
import { DeleteInterestDialog } from "@/components/interests/DeleteInterestDialog";
import { TablePagination } from "@/components/TablePagination";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInterests, interestAdded, interestUpdated, interestRemoved } from "@/store/slices/interestsSlice";

const DEFAULT_LIMIT = 10;

export default function InterestsPage() {
  const dispatch = useAppDispatch();
  const { toast: toastHook } = useToast();
  const { items: interests, pagination, loading, error } = useAppSelector((s) => s.interests);
  const total = pagination.total;
  const totalPages = pagination.totalPages;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [deletingInterest, setDeletingInterest] = useState<Interest | null>(null);

  const listParams = useCallback(() => ({ page, limit }), [page, limit]);

  useEffect(() => {
    dispatch(fetchInterests(listParams()));
  }, [dispatch, listParams]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error, toast]);

  const handleCreate = () => {
    setEditingInterest(null);
    setDrawerOpen(true);
  };

  const handleEdit = (interest: Interest) => {
    setEditingInterest(interest);
    setDrawerOpen(true);
  };

  const handleSave = async (data: { title: string; description?: string; isActive?: boolean }) => {
    try {
      if (editingInterest) {
        const res = await interestsApi.update(editingInterest._id, data);
        const interest = (res as { interest?: Interest }).interest;
        if (interest) dispatch(interestUpdated(interest));
        toastHook({ title: "Interest updated", description: `${data.title} has been updated.` });
      } else {
        const res = await interestsApi.create(data);
        const interest = (res as { interest?: Interest }).interest;
        if (interest) {
          if (page === 1) dispatch(interestAdded(interest));
          else dispatch(fetchInterests({ page: 1, limit }));
        }
        toastHook({ title: "Interest created", description: `${data.title} has been added.` });
      }
      setDrawerOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleDelete = async () => {
    if (!deletingInterest) return;
    try {
      await interestsApi.delete(deletingInterest._id);
      dispatch(interestRemoved(deletingInterest._id));
      toastHook({
        title: "Interest deleted",
        description: `${deletingInterest.title} has been removed.`,
        variant: "destructive",
      });
      setDeletingInterest(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Interests</h2>
          <p className="text-muted-foreground mt-1">Manage interests for user profiles.</p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Create Interest
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <InterestTable
            interests={interests}
            onEdit={handleEdit}
            onDelete={setDeletingInterest}
          />
          <TablePagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            itemLabel="interests"
          />
        </>
      )}

      <InterestDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        interest={editingInterest}
        onSave={handleSave}
      />

      <DeleteInterestDialog
        open={!!deletingInterest}
        onClose={() => setDeletingInterest(null)}
        onConfirm={handleDelete}
        title={deletingInterest?.title ?? ""}
      />
    </div>
  );
}
