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
import { useAuthStore } from "@/provider/store/authStore";

type AppointmentStatus = "completed" | "cancelled" | "on-process" | "waiting";

type StatusConfig = {
  label: string;
  value: AppointmentStatus;
  dialogTitle: string;
  dialogDescription: string;
  buttonColor: string;
  buttonHoverColor: string;
};

const statusConfigs: StatusConfig[] = [
  {
    label: "Mark as Complete",
    value: "completed",
    dialogTitle: "Mark Appointment as Complete?",
    dialogDescription: "The appointment status will be updated to completed.",
    buttonColor: "bg-green-500",
    buttonHoverColor: "hover:bg-green-400",
  },
  {
    label: "Mark as Cancelled",
    value: "cancelled",
    dialogTitle: "Cancel Appointment?",
    dialogDescription: "The appointment status will be updated to cancelled.",
    buttonColor: "bg-red-500",
    buttonHoverColor: "hover:bg-red-400",
  },
  {
    label: "Mark as On Process",
    value: "on-process",
    dialogTitle: "Mark Appointment as On Process?",
    dialogDescription: "The appointment status will be updated to on process.",
    buttonColor: "bg-yellow-500",
    buttonHoverColor: "hover:bg-yellow-400",
  },
  {
    label: "Mark as Confirmed",
    value: "waiting",
    dialogTitle: "Mark Appointment as Confirmed?",
    dialogDescription: "The appointment status will be updated to confirmed.",
    buttonColor: "bg-blue-500",
    buttonHoverColor: "hover:bg-blue-400",
  },
];

type ActionCellProps = {
  id: string;
  deleteFn?: (id: string) => Promise<DeleteResponse>;
  deleteMessage?: string;
  queryKey: string[] | string;
  infoDialog?: ReactNode;
  previewDialog?: ReactNode;
  editDialog?: ReactNode;
  editAppointmentStatus?: boolean;
  changeAestheticianDialog?: ReactNode;
  hasAesthetician?: boolean;
  isCompleted?: boolean;
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
  changeAestheticianDialog,
  hasAesthetician = true,
  isCompleted = false,
}: ActionCellProps) {
  const { access_token } = useAuthStore();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openChangeAestheticianDialog, setOpenChangeAestheticianDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusConfig | null>(
    null
  );
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

  const handleStatusClick = (status: StatusConfig) => {
    setSelectedStatus(status);
    setDropdownOpen(false);
    setTimeout(() => setOpenStatusDialog(true), 100);
  };

  const handleChangeAestheticianClick = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpenChangeAestheticianDialog(true), 100);
  };

  const deleteMutation = useBaseMutation("delete", {
    deleteFn: deleteFn,
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    successMessages: {
      delete: deleteMessage || "Deleted Successfully",
    },
  });

  const statusUpdateMutation = useBaseMutation("patch", {
    updateFn: patchAppointment,
    queryKey: [
      ["appointment"],
      ["aesthetician-name"],
      ["aesthetician"],
      ["appointment-summary"],
      ["sales-summary"],
      ["analytics-appointments"],
      ["analytics-sales"],
    ],
    successMessages: {
      update: "Appointment updated successfully",
    },
    onSuccess: () => {
      setOpenStatusDialog(false);
      setSelectedStatus(null);
    },
  });

  const handleStatusUpdate = (id: string, status: AppointmentStatus) => {
    statusUpdateMutation.mutate({
      data: {
        appointment_id: id,
        status: status,
      },
      token: access_token || "",
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

          {/* Show Preview first if appointment is completed */}
          {isCompleted && previewDialog && (
            <DropdownMenuItem onSelect={handlePreviewClick}>
              Preview
            </DropdownMenuItem>
          )}

          {/* Show other actions only if not completed */}
          {!isCompleted && (
            <>
              {editDialog && (
                <DropdownMenuItem onSelect={handleEditClick}>
                  Update
                </DropdownMenuItem>
              )}

              {editAppointmentStatus && (
                <>
                  {statusConfigs.map((status) => {
                    // Disable completed, on-process, and waiting (confirm) if no aesthetician assigned
                    const requiresAesthetician = ['completed', 'on-process', 'waiting'].includes(status.value);
                    const isDisabled = requiresAesthetician && !hasAesthetician;
                    
                    return (
                      <DropdownMenuItem
                        key={status.value}
                        onSelect={() => !isDisabled && handleStatusClick(status)}
                        disabled={isDisabled}
                        className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {status.label}
                        {isDisabled && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Assign aesthetician first)
                          </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </>
              )}

              {changeAestheticianDialog && (
                <DropdownMenuItem onSelect={handleChangeAestheticianClick}>
                  {hasAesthetician ? "Change Aesthetician" : "Assign Aesthetician"} 
                </DropdownMenuItem>
              )}

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

              {deleteFn && deleteMessage && (
                <DropdownMenuItem onSelect={handleDeleteClick}>
                  Delete
                </DropdownMenuItem>
              )}
            </>
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

      {/* Change Aesthetician Dialog */}
      {changeAestheticianDialog && (
        <Dialog open={openChangeAestheticianDialog} onOpenChange={setOpenChangeAestheticianDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Change Aesthetician</DialogTitle>
            </DialogHeader>
            {changeAestheticianDialog}
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

      {/* Status Update Dialog */}
      {editAppointmentStatus && selectedStatus && (
        <AlertDialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedStatus.dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. {selectedStatus.dialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={statusUpdateMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusUpdate(id, selectedStatus.value)}
                disabled={statusUpdateMutation.isPending}
                className={`${selectedStatus.buttonColor} text-white ${selectedStatus.buttonHoverColor} disabled:opacity-50`}
              >
                {statusUpdateMutation.isPending
                  ? "Updating..."
                  : "Update Status"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default ActionCell;
