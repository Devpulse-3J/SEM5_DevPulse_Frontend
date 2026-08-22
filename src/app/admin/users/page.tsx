"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/validators";
import { projectService } from "@/services/project.service";
import type { ProjectRoleLabel } from "@/types/adminProject";

/**
 * Admin → Members & Roles.
 *
 * The invite form posts to POST /api/projects/{id}/invite via
 * `projectService.inviteMember`. Admin-only: a non-admin caller gets a 403 and
 * an email already owned by another company gets a 409, so the form stays open
 * and keeps its values on failure — both rejections are worth re-reading with
 * the input still on screen.
 *
 * There is still no endpoint that lists every user in a company; members are
 * listed per project on /admin/projects/{id}.
 */
export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [role, setRole] = useState<ProjectRoleLabel>("DEVELOPER");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    projectId?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const closeForm = () => {
    setIsFormOpen(false);
    setFieldErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessNotice(null);

    const trimmedEmail = email.trim();
    const trimmedProjectId = projectId.trim();
    const errors: { email?: string; projectId?: string } = {};

    const emailError = validateEmail(trimmedEmail);
    if (emailError) errors.email = emailError;
    if (!trimmedProjectId) {
      errors.projectId = "Project id is required";
    } else if (!/^\d+$/.test(trimmedProjectId)) {
      errors.projectId = "Project id must be a number";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      // `role` is already UPPERCASE — the gateway's enum binding is
      // case-sensitive and answers a lowercase value with a 500, not a 400.
      await projectService.inviteMember(trimmedProjectId, {
        email: trimmedEmail,
        role,
      });
      setSuccessNotice(
        `${trimmedEmail} was invited to project ${trimmedProjectId} as ${role.toLowerCase()}.`
      );
      setEmail("");
      setProjectId("");
      setRole("DEVELOPER");
      setIsFormOpen(false);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not send the invite."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-0.5 text-xl font-bold">Members &amp; Roles</h1>
          <p className="text-xs text-subtle">
            Organisation members, roles, and access permissions
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => (isFormOpen ? closeForm() : setIsFormOpen(true))}
        >
          {isFormOpen ? "Cancel" : "+ Invite Member"}
        </Button>
      </div>

      {successNotice && !isFormOpen && (
        <p role="status" className="text-xs text-success">
          {successNotice}
        </p>
      )}

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex max-w-md flex-col gap-4 rounded-panel border border-border bg-surface-raised p-6"
        >
          <div>
            <h2 className="text-[15px] font-bold">Invite Member</h2>
            <p className="mt-1 text-[11px] text-subtle">
              Only company admins can invite. The invitee must not already belong
              to another company.
            </p>
          </div>

          <Input
            label="Work email"
            type="email"
            placeholder="newmember@yourcompany.com"
            value={email}
            error={fieldErrors.email}
            disabled={isSubmitting}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
          />

          <Input
            label="Project id"
            type="number"
            placeholder="1"
            value={projectId}
            error={fieldErrors.projectId}
            disabled={isSubmitting}
            onChange={(e) => {
              setProjectId(e.target.value);
              if (fieldErrors.projectId) {
                setFieldErrors((prev) => ({ ...prev, projectId: undefined }));
              }
            }}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="invite-role" className="text-xs font-medium text-muted">
              Project role
            </label>
            <select
              id="invite-role"
              value={role}
              disabled={isSubmitting}
              onChange={(e) => setRole(e.target.value as ProjectRoleLabel)}
              className="h-9 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40 disabled:opacity-60"
            >
              <option value="MANAGER">manager</option>
              <option value="DEVELOPER">developer</option>
            </select>
            <p className="text-[11px] text-subtle">
              Roles are per project — the same person can be a manager on one and a
              developer on another.
            </p>
          </div>

          {submitError && (
            <p role="alert" className="text-[11px] text-danger">
              {submitError}
            </p>
          )}

          <div className="mt-1 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isSubmitting}
              onClick={closeForm}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Send Invite
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-panel border border-dashed border-border p-8 text-center">
        <h2 className="text-sm font-semibold text-ink">No members to list</h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
          There is no endpoint that lists every user in a company. Members are
          listed per project — open a project from Projects to see and manage its
          members.
        </p>
      </div>
    </div>
  );
}
