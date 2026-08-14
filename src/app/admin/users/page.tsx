"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PROJECT_ROLES } from "@/lib/constants";

/**
 * Admin → Members & Roles.
 *
 * UI SCAFFOLD ONLY — there is no backend for this yet.
 *
 * TODO: wire to an invitation endpoint when one exists. It needs at minimum
 * { email, projectId, role } where role is "manager" | "developer", matching
 * the per-project roles returned by GET /api/auth/me. Until then `handleSubmit`
 * does not clear the form or claim the invite was sent.
 *
 * Note: today a new user joins by registering with your company id — there is
 * no invitation flow on the backend at all.
 */
export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [role, setRole] = useState<string>(PROJECT_ROLES.DEVELOPER);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(
      "Not connected yet — there is no invitation endpoint on the backend. Your input has been kept in the form."
    );
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
        <Button variant="primary" size="md" onClick={() => setIsFormOpen((v) => !v)}>
          {isFormOpen ? "Cancel" : "+ Invite Member"}
        </Button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex max-w-md flex-col gap-4 rounded-panel border border-border bg-surface-raised p-6"
        >
          <div>
            <h2 className="text-[15px] font-bold">Invite Member</h2>
            <p className="mt-1 text-[11px] text-subtle">
              Not wired to the backend yet — no invitation endpoint exists.
            </p>
          </div>

          <Input
            label="Work email"
            type="email"
            placeholder="newmember@yourcompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Project id"
            type="number"
            placeholder="1"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="invite-role" className="text-xs font-medium text-muted">
              Project role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40"
            >
              <option value={PROJECT_ROLES.MANAGER}>manager</option>
              <option value={PROJECT_ROLES.DEVELOPER}>developer</option>
            </select>
            <p className="text-[11px] text-subtle">
              Roles are per project — the same person can be a manager on one and a
              developer on another.
            </p>
          </div>

          {notice && (
            <p role="status" className="text-[11px] text-warning">
              {notice}
            </p>
          )}

          <div className="mt-1 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                setIsFormOpen(false);
                setNotice(null);
              }}
            >
              Close
            </Button>
            <Button type="submit" variant="primary" size="md">
              Send Invite
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-panel border border-dashed border-border p-8 text-center">
        <h2 className="text-sm font-semibold text-ink">No members to list</h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
          There is no endpoint that lists users in a company. New users currently
          join by registering with your company id.
        </p>
      </div>
    </div>
  );
}
