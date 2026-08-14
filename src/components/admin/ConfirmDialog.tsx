"use client";

import { Modal, ModalHeader, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  /** Label for the destructive action, e.g. "Delete" or "Remove". */
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Reusable confirm-before-destroy dialog. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} width={420}>
      <ModalHeader title={title} onClose={onCancel} />
      <p className="text-xs text-muted">{message}</p>
      <ModalFooter>
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="danger" size="md" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ConfirmDialog;
