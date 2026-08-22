"use client";

import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalField,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/validators";
import type { InviteMemberRequest, ProjectRoleLabel } from "@/types/adminProject";

export interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberRequest) => Promise<void>;
}

export function InviteMemberModal({ open, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ProjectRoleLabel>("DEVELOPER");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setEmail("");
    setRole("DEVELOPER");
    setEmailError(undefined);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Same rule the server enforces on register — see lib/validators.
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      await onInvite({ email: email.trim(), role });
      // Only clear on success. A rejected invite (403 non-admin, 409 email
      // belongs to another company) leaves the form filled in to retry.
      reset();
      onClose();
    } catch {
      // The provider has already raised the error toast.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader
        title="Invite Member"
        description="Adds the person to this project. Company admins only."
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Input
            label="Email address"
            type="email"
            placeholder="newmember@yourcompany.com"
            value={email}
            error={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
          />

          <ModalField label="Role">
            <div className="flex flex-col gap-2">
              {(["DEVELOPER", "MANAGER"] as ProjectRoleLabel[]).map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2.5 text-xs text-ink"
                >
                  <input
                    type="radio"
                    name="invite-role"
                    value={option}
                    checked={role === option}
                    onChange={() => setRole(option)}
                    className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-accent)]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-subtle">
              Roles are per project — the same person can be a manager on one and a
              developer on another.
            </p>
          </ModalField>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
            Send Invite
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default InviteMemberModal;
