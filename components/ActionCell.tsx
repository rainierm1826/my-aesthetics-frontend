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
import { DeleteResponse } from "@/lib/types/types";
import { useBaseMutation } from "@/hooks/useBaseMutation";
import { patchAppointment } from "@/api/appointment";

type ActionCellProps = {
  id: string;
  deleteFn: (id: string) => Promise<DeleteResponse>;
  deleteMessage: string;
  queryKey: string[] | string;
  infoDialog?: ReactNode;
  previewDialog?: ReactNode;
  editDialog?: ReactNode;
  editAppointmentStatus?: boolean;
};

function ActionCell({
  id,
  queryKey,
  deleteFn,
  deleteMessage,
  infoDialog,
  previewDialog,
  editDialog,
  editAppointmentStatus,
}: ActionCellProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleSuccessClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenSuccessDialog(true), 100); 
  };

  const deleteMutation = useBaseMutation("delete", {
    deleteFn: deleteFn,
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    successMessages: {
      delete: deleteMessage || "Deleted Successfully",
    },
  });

  const successAppointmentMutation = useBaseMutation("patch", {
    updateFn: patchAppointment,
    queryKey: ["appointment"], 
    successMessages: {
      update: "Appointment updated successfully",
    },
    onSuccess: () => {
      setOpenSuccessDialog(false);
    },
  });

  const handleSuccessAppointment = (id: string) => {
    successAppointmentMutation.mutate({
      appointment_id: id,
      status: "completed",
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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

          {editAppointmentStatus && (
            <DropdownMenuItem
              className="text-green-400 hover:text-green-500"
              onSelect={handleSuccessClick}
            >
              Mark as Complete
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

      {/* Delete Dialog */}
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
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(id)}
              disabled={deleteMutation.isPending}
              className="bg-red-500 text-white hover:bg-red-400 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success/Complete Appointment Dialog */}
      {editAppointmentStatus && (
        <AlertDialog
          open={openSuccessDialog}
          onOpenChange={setOpenSuccessDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark Appointment as Complete?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The appointment status will be
                updated to completed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={successAppointmentMutation.isPending}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleSuccessAppointment(id)}
                disabled={successAppointmentMutation.isPending}
                className="bg-green-500 text-white hover:bg-green-400 disabled:opacity-50"
              >
                {successAppointmentMutation.isPending
                  ? "Updating..."
                  : "Mark Complete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default ActionCell;
