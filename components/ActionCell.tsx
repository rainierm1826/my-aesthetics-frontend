"use client";

import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DeleteResponse } from "@/lib/types";

type ActionCellProps = {
  id: string;
  deleteFn: (id: string) => Promise<DeleteResponse>;
  infoDialog?: ReactNode;
  previewDialog?: ReactNode;
  editDialog?: ReactNode;
};

function ActionCell({
  id,
  deleteFn,
  infoDialog,
  previewDialog,
  editDialog,
}: ActionCellProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMoreInfoClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenMoreInfoDialog(true), 100);
  };

  const handleEditClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenEditDialog(true), 100);
  };

  const handlePreviewClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenPreviewDialog(true), 100);
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenDeleteDialog(true), 100);
  };

  const handleDelete = async () => {
    try {
      setLoading(true)
      const result = await deleteFn(id);
      console.log(result);
      setLoading(false)
    } catch (error) {
      setLoading(true)
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild className="focus-visible:border-0">
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-[#7C7C7C] hover:bg-transparent"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-blue-400 hover:text-blue-500"
            onSelect={handleEditClick}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-400 hover:text-red-500"
            onSelect={handleDeleteClick}
          >
            Delete
          </DropdownMenuItem>

          {infoDialog && (
            <DropdownMenuItem onSelect={handleMoreInfoClick}>
              More Info
            </DropdownMenuItem>
          )}

          {previewDialog && (
            <DropdownMenuItem onSelect={handlePreviewClick}>
              Preview
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* More Info Dialog */}
      {infoDialog && (
        <Dialog open={openMoreInfoDialog} onOpenChange={setOpenMoreInfoDialog}>
          <DialogContent>
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
            </VisuallyHidden>
            {infoDialog}
          </DialogContent>
        </Dialog>
      )}
      {/* Edit Dialog */}
      {editDialog && (
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
            </VisuallyHidden>
            {editDialog}
          </DialogContent>
        </Dialog>
      )}
      {/* Preview Dialog */}
      {previewDialog && (
        <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
          <DialogContent className="w-auto">
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
            </VisuallyHidden>
            {previewDialog}
          </DialogContent>
        </Dialog>
      )}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete data
              from your servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white hover:bg-red-400 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ActionCell;
