import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import type { Interest } from "@/api/interests";
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

interface InterestTableProps {
  interests: Interest[];
  onEdit: (interest: Interest) => void;
  onDelete: (interest: Interest) => void;
}

export function InterestTable({ interests, onEdit, onDelete }: InterestTableProps) {
  const isMobile = useIsMobile();

  const formatDate = (d: string) => (d ? new Date(d).toLocaleDateString() : "—");

  if (isMobile) {
    return (
      <div className="space-y-3">
        {interests.map((interest) => (
          <Card key={interest._id} className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{interest.title}</p>
                  {interest.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{interest.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={interest.isActive !== false ? "default" : "outline"} className="text-xs">
                      {interest.isActive !== false ? "Active" : "Inactive"}
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
                    <DropdownMenuItem onClick={() => onEdit(interest)}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(interest)} className="text-destructive">
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
            {interests.map((interest) => (
              <TableRow key={interest._id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{interest.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {interest.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={interest.isActive !== false ? "default" : "outline"}>
                    {interest.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(interest.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(interest)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(interest)}
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
