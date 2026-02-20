import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import type { Occupation } from "@/api/occupations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface OccupationTableProps {
  occupations: Occupation[];
  onEdit: (occupation: Occupation) => void;
  onDelete: (occupation: Occupation) => void;
}

export function OccupationTable({ occupations, onEdit, onDelete }: OccupationTableProps) {
  const isMobile = useIsMobile();

  const formatDate = (d: string) => (d ? new Date(d).toLocaleDateString() : "—");

  if (isMobile) {
    return (
      <div className="space-y-3">
        {occupations.map((occupation) => (
          <Card key={occupation._id} className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{occupation.title}</p>
                  {occupation.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{occupation.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={occupation.isActive !== false ? "default" : "outline"} className="text-xs">
                      {occupation.isActive !== false ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(occupation)}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(occupation)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occupations.map((occupation) => (
              <TableRow key={occupation._id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{occupation.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {occupation.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={occupation.isActive !== false ? "default" : "outline"}>
                    {occupation.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(occupation.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(occupation)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(occupation)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
