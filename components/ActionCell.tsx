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

type ActionCellProps<T> = {
  data: T;
  getId?: (data: T) => string;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onMoreInfo?: (data: T) => void;
  onPreview?: (data: T) => void;
  infoDialog?: ReactNode;
  previewDialog?: ReactNode;
};

function ActionCell<T>({
  data,
  getId,
  onEdit,
  onDelete,
  onMoreInfo,
  infoDialog,
  onPreview,
  previewDialog,
}: ActionCellProps<T>) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMoreInfoClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenMoreInfoDialog(true), 100);
  };

  const handlePreviewClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenPreviewDialog(true), 100);
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenDeleteDialog(true), 100);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(data);
    setOpenDeleteDialog(false);
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

          {onEdit && (
            <DropdownMenuItem
              className="text-blue-400 hover:text-blue-500"
              onSelect={() => onEdit(data)}
            >
              Edit
            </DropdownMenuItem>
          )}

          {onDelete && (
            <DropdownMenuItem
              className="text-red-400 hover:text-red-500"
              onSelect={handleDeleteClick}
            >
              Delete
            </DropdownMenuItem>
          )}

          {onMoreInfo && (
            <DropdownMenuItem onSelect={handleMoreInfoClick}>
              More Info
            </DropdownMenuItem>
          )}

          {onPreview && (
            <DropdownMenuItem onSelect={handlePreviewClick}>
              Preview
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* More Info Dialog */}
      {onMoreInfo && (
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

      {/* Preview Dialog */}
      {onPreview && (
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

      {/* Delete Dialog */}
      {onDelete && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {getId ? `item with ID ${getId(data)}` : "this item"} and remove
                it from your servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-400"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default ActionCell;
