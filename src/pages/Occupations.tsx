import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Occupation } from "@/api/occupations";
import { occupationsApi } from "@/api/occupations";
import { OccupationTable } from "@/components/occupations/OccupationTable";
import { OccupationDrawer } from "@/components/occupations/OccupationDrawer";
import { DeleteOccupationDialog } from "@/components/occupations/DeleteOccupationDialog";
import { TablePagination } from "@/components/TablePagination";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOccupations, occupationAdded, occupationUpdated, occupationRemoved } from "@/store/slices/occupationsSlice";

const DEFAULT_LIMIT = 10;

export default function OccupationsPage() {
  const dispatch = useAppDispatch();
  const { toast: toastHook } = useToast();
  const { items: occupations, pagination, loading, error } = useAppSelector((s) => s.occupations);
  const total = pagination.total;
  const totalPages = pagination.totalPages;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingOccupation, setEditingOccupation] = useState<Occupation | null>(null);
  const [deletingOccupation, setDeletingOccupation] = useState<Occupation | null>(null);

  const listParams = useCallback(() => ({ page, limit }), [page, limit]);

  useEffect(() => {
    dispatch(fetchOccupations(listParams()));
  }, [dispatch, listParams]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error, toast]);

  const handleCreate = () => {
    setEditingOccupation(null);
    setDrawerOpen(true);
  };

  const handleEdit = (occupation: Occupation) => {
    setEditingOccupation(occupation);
    setDrawerOpen(true);
  };

  const handleSave = async (data: { title: string; description?: string; isActive?: boolean }) => {
    try {
      if (editingOccupation) {
        const res = await occupationsApi.update(editingOccupation._id, data);
        const occupation = (res as { occupation?: Occupation }).occupation;
        if (occupation) dispatch(occupationUpdated(occupation));
        toastHook({ title: "Occupation updated", description: `${data.title} has been updated.` });
      } else {
        const res = await occupationsApi.create(data);
        const occupation = (res as { occupation?: Occupation }).occupation;
        if (occupation) {
          if (page === 1) dispatch(occupationAdded(occupation));
          else dispatch(fetchOccupations({ page: 1, limit }));
        }
        toastHook({ title: "Occupation created", description: `${data.title} has been added.` });
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
    if (!deletingOccupation) return;
    try {
      await occupationsApi.delete(deletingOccupation._id);
      dispatch(occupationRemoved(deletingOccupation._id));
      toastHook({
        title: "Occupation deleted",
        description: `${deletingOccupation.title} has been removed.`,
        variant: "destructive",
      });
      setDeletingOccupation(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Occupations</h2>
          <p className="text-muted-foreground mt-1">Manage occupations for user profiles.</p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Create Occupation
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <OccupationTable
            occupations={occupations}
            onEdit={handleEdit}
            onDelete={setDeletingOccupation}
          />
          <TablePagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            itemLabel="occupations"
          />
        </>
      )}

      <OccupationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        occupation={editingOccupation}
        onSave={handleSave}
      />

      <DeleteOccupationDialog
        open={!!deletingOccupation}
        onClose={() => setDeletingOccupation(null)}
        onConfirm={handleDelete}
        title={deletingOccupation?.title ?? ""}
      />
    </div>
  );
}
