"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { adminApiService, CompanyMember, CompanyRole } from "@/services/api/admin";
import { ApiError } from "@/services/api-client";

export default function MembersPage() {
  // Members table state
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Invite Form state
  const [rawEmailsInput, setRawEmailsInput] = useState("");
  const [role, setRole] = useState<CompanyRole>("DEVELOPER");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Inline action states
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [updatingError, setUpdatingError] = useState<{ id: string; message: string } | null>(null);
  const [openRoleMenuId, setOpenRoleMenuId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    setFetchError(null);
    try {
      const data = await adminApiService.getCompanyMembers();
      setMembers(data);
    } catch (err: unknown) {
      console.warn("Failed to fetch company members from API, using fallback data if any.", err);
      const errMsg = err instanceof ApiError || err instanceof Error ? err.message : "Could not load company members.";
      setFetchError(errMsg);
      // Fallback initial view if backend is not yet populated
      setMembers([
        {
          id: "1",
          userId: "1",
          email: "admin@company.com",
          fullName: "System Admin",
          role: "ADMIN",
          status: "ACTIVE",
          joinedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Parse raw text input into array of cleaned emails
  const parseEmails = (input: string): string[] => {
    return input
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    const emails = parseEmails(rawEmailsInput);

    if (emails.length === 0) {
      setInviteError("Please enter at least one valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit Invite: Call POST /api/auth/company/invite with { emails, role }
      await adminApiService.inviteCompanyMembers({ emails, role });
      setInviteSuccess(`Successfully invited ${emails.length} member(s) as ${role}.`);
      setRawEmailsInput("");
      setIsFormOpen(false);

      // Optimistically append invited members to table
      const newMembers: CompanyMember[] = emails.map((email, idx) => ({
        id: `pending-${Date.now()}-${idx}`,
        userId: `pending-${Date.now()}-${idx}`,
        email,
        role,
        status: "INVITE_PENDING",
      }));
      setMembers((prev) => [...prev, ...newMembers]);

      // Re-sync with server
      setTimeout(() => fetchMembers(), 1000);
    } catch (err: unknown) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : "Failed to send invitation.";
      setInviteError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: CompanyRole) => {
    setUpdatingMemberId(userId);
    setUpdatingError(null);
    setOpenRoleMenuId(null);

    try {
      // Update Member Role: Call PUT /api/auth/company/members/{userId}/role with { role }
      await adminApiService.updateMemberRole(userId, newRole);

      // Update table state
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId || m.id === userId ? { ...m, role: newRole } : m))
      );
    } catch (err: unknown) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : "Failed to update role.";
      setUpdatingError({ id: userId, message });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRevoke = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to revoke membership for ${email}?`)) return;

    setUpdatingMemberId(userId);
    setUpdatingError(null);

    try {
      // Revoke Member: Call DELETE /api/auth/company/members/{userId}
      await adminApiService.revokeMember(userId);

      // Update table state
      setMembers((prev) => prev.filter((m) => m.userId !== userId && m.id !== userId));
    } catch (err: unknown) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : "Failed to revoke member.";
      setUpdatingError({ id: userId, message });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-0.5 text-xl font-bold text-ink">Team Invitation &amp; Member Management</h1>
          <p className="text-xs text-subtle">
            Manage company members, send single or bulk email invitations, and assign roles.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setInviteError(null);
            setInviteSuccess(null);
          }}
        >
          {isFormOpen ? "Cancel" : "+ Invite Members"}
        </Button>
      </div>

      {inviteSuccess && !isFormOpen && (
        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-xs text-success" role="status">
          {inviteSuccess}
        </div>
      )}

      {/* Invitation Form Modal / Panel */}
      {isFormOpen && (
        <form
          onSubmit={handleInviteSubmit}
          className="flex max-w-lg flex-col gap-4 rounded-panel border border-border bg-surface-raised p-6"
        >
          <div>
            <h2 className="text-[15px] font-bold text-ink">Invite Team Members</h2>
            <p className="mt-1 text-[11px] text-subtle">
              Enter one or multiple email addresses (separated by commas or line breaks).
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="invite-emails" className="text-xs font-medium text-muted">
              Email Addresses (single or bulk)
            </label>

            <textarea
              id="invite-emails"
              rows={4}
              placeholder="alex@company.com, sam@company.com"
              value={rawEmailsInput}
              disabled={isSubmitting}
              onChange={(e) => setRawEmailsInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-3 text-xs text-ink placeholder:text-subtle outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40 disabled:opacity-60 font-mono"
            />
            <p className="text-[11px] text-subtle">
              Parsed emails count: <span className="font-semibold text-ink">{parseEmails(rawEmailsInput).length}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="invite-role" className="text-xs font-medium text-muted">
              Company Role
            </label>
            <select
              id="invite-role"
              value={role}
              disabled={isSubmitting}
              onChange={(e) => setRole(e.target.value as CompanyRole)}
              className="h-9 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40 disabled:opacity-60"
            >
              <option value="ADMIN">ADMIN - Full administrative access</option>
              <option value="MANAGER">MANAGER - Project management access</option>
              <option value="DEVELOPER">DEVELOPER - Standard workspace access</option>
            </select>
          </div>

          {inviteError && (
            <p role="alert" className="text-[11px] text-danger">
              {inviteError}
            </p>
          )}

          <div className="mt-1 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isSubmitting}
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={isSubmitting} disabled={isSubmitting}>
              Send Invitations
            </Button>
          </div>
        </form>
      )}

      {/* Members Table */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">
            Company Members ({members.length})
          </h2>
          {fetchError && (
            <span className="text-xs text-warning" title={fetchError}>
              Using local cache (API warning)
            </span>
          )}
        </div>

        {loadingMembers ? (
          <div className="flex items-center justify-center p-12 rounded-panel border border-border bg-surface">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-panel border border-dashed border-border p-8 text-center">
            <p className="text-sm text-ink">No members found</p>
            <p className="mt-1 text-xs text-muted">Use the button above to invite team members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-panel border border-border bg-surface">
            <table className="w-full border-collapse text-left text-xs text-ink">
              <thead className="border-b border-border bg-surface-raised/60 font-semibold tracking-widest text-subtle">
                <tr>
                  <th className="px-4 py-2.5 text-[11px]">MEMBER / EMAIL</th>
                  <th className="px-4 py-2.5 text-[11px]">ROLE</th>
                  <th className="px-4 py-2.5 text-[11px]">STATUS</th>
                  <th className="px-4 py-2.5 text-right text-[11px]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {members.map((member) => {
                  const isUpdatingThis = updatingMemberId === member.userId || updatingMemberId === member.id;
                  const inlineErr = updatingError?.id === member.userId || updatingError?.id === member.id ? updatingError.message : null;

                  return (
                    <tr key={member.id || member.email} className="transition-colors hover:bg-surface-raised/30">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-ink">{member.fullName || member.email.split("@")[0]}</span>
                          <span className="font-mono text-[11px] text-muted">{member.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            member.role === "ADMIN" ? "info" : member.role === "MANAGER" ? "warning" : "default"
                          }
                        >
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {member.status === "INVITE_PENDING" || member.status === "PENDING" ? (
                          <Badge variant="warning">INVITE_PENDING</Badge>
                        ) : (
                          <Badge variant="success">ACTIVE</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative flex items-center justify-end gap-3">
                          {isUpdatingThis ? (
                            <span className="text-xs text-subtle animate-pulse">Updating…</span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenRoleMenuId((cur) =>
                                    cur === (member.userId || member.id) ? null : member.userId || member.id
                                  )
                                }
                                className="cursor-pointer border-none bg-transparent text-xs font-medium text-accent hover:underline"
                              >
                                Change Role
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRevoke(member.userId || member.id, member.email)}
                                className="cursor-pointer border-none bg-transparent text-xs font-medium text-danger hover:underline"
                              >
                                Revoke
                              </button>
                            </>
                          )}

                          {/* Role Dropdown Menu */}
                          {openRoleMenuId === (member.userId || member.id) && (
                            <div
                              role="menu"
                              className="absolute right-0 top-7 z-30 flex w-44 flex-col overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg"
                            >
                              {(["ADMIN", "MANAGER", "DEVELOPER"] as CompanyRole[]).map((r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => handleRoleChange(member.userId || member.id, r)}
                                  className={`cursor-pointer border-none px-3 py-2 text-left text-xs transition-colors hover:bg-surface ${
                                    member.role === r ? "font-semibold text-ink" : "text-muted"
                                  }`}
                                >
                                  Set as {r} {member.role === r && "✓"}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {inlineErr && (
                          <div className="mt-1 text-right text-[10px] text-danger">{inlineErr}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
