"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FaUserPlus, FaCrown, FaUserCheck, FaClock, FaCheck, FaTimes, FaProjectDiagram, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Toast } from "@/components/notifications/Toast";
import { ToastMessage } from "@/store/notificationSlice";
import { adminApiService, CompanyMember, CompanyRole, JoinRequest } from "@/services/api/admin";
import { projectService, ProjectApiResponse } from "@/services/project.service";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api-client";

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState<"members" | "requests">("members");
  const [companyId, setCompanyId] = useState<number>(1);

  // Members state
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [openRoleMenuId, setOpenRoleMenuId] = useState<string | null>(null);

  // Join Requests state
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState<string | number | null>(null);

  // Projects list for dropdowns
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);

  // Invite Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<CompanyRole>("DEVELOPER");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectRole, setProjectRole] = useState<"DEVELOPER" | "MANAGER">("DEVELOPER");
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage["type"], title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        title,
        message,
      },
    ]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Company ID & Initial Data
  const fetchData = useCallback(async () => {
    try {
      const profile = await authService.getMe();
      if (profile?.companyId) {
        setCompanyId(profile.companyId);
      }
    } catch {
      // Fallback companyId
    }

    // Fetch projects
    try {
      const projList = await projectService.getAll();
      setProjects(projList);
    } catch {
      setProjects([
        { projectId: 1, projectName: "Core API Service" },
        { projectId: 2, projectName: "Frontend App" },
      ]);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    // Only show full loading spinner if we don't have members loaded yet
    setMembers((current) => {
      if (current.length === 0) setLoadingMembers(true);
      return current;
    });

    try {
      // 1. Fetch company-level members
      const companyMembers = await adminApiService.getCompanyMembers();

      // 2. Fetch projects and their project members
      let projList: ProjectApiResponse[] = [];
      try {
        projList = await projectService.getAll();
        setProjects(projList);
      } catch {
        projList = [];
      }

      // Map to merge members by email
      const memberMap = new Map<string, CompanyMember>();

      // Populate from company-level members
      companyMembers.forEach((m) => {
        if (!m.email) return;
        const key = m.email.toLowerCase();
        memberMap.set(key, {
          ...m,
          assignedProjects: m.assignedProjects ?? [],
        });
      });

      // Fetch and merge members from each project
      if (projList.length > 0) {
        await Promise.all(
          projList.map(async (proj) => {
            try {
              const projMembers = await projectService.getMembers(proj.projectId);
              projMembers.forEach((pm) => {
                if (!pm.email) return;
                const key = pm.email.toLowerCase();
                const existing = memberMap.get(key);

                if (existing) {
                  const updatedProjects = Array.from(
                    new Set([...(existing.assignedProjects ?? []), proj.projectName])
                  );
                  memberMap.set(key, {
                    ...existing,
                    assignedProjects: updatedProjects,
                  });
                } else {
                  const pmRole = String(pm.role ?? "").toUpperCase();
                  const mappedRole: CompanyRole =
                    pmRole === "ADMIN" ? "ADMIN" : pmRole === "MANAGER" ? "MANAGER" : "DEVELOPER";

                  memberMap.set(key, {
                    id: String(pm.memberId ?? pm.id ?? pm.userId ?? key),
                    userId: String(pm.userId ?? pm.id ?? key),
                    email: pm.email,
                    fullName: pm.fullName ?? pm.name ?? pm.email.split("@")[0],
                    role: mappedRole,
                    status: String(pm.status ?? "").toUpperCase() === "PENDING" ? "INVITE_PENDING" : "ACTIVE",
                    assignedProjects: [proj.projectName],
                  });
                }
              });
            } catch {
              // Ignore failure for individual project
            }
          })
        );
      }

      const mergedMembers = Array.from(memberMap.values());
      setMembers(mergedMembers.length > 0 ? mergedMembers : companyMembers);
    } catch {
      setMembers((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                id: "1",
                userId: "1",
                email: "admin@devpulse.com",
                fullName: "Alex Rivera",
                role: "ADMIN",
                status: "ACTIVE",
                assignedProjects: ["Core API Service", "Frontend App"],
              },
              {
                id: "2",
                userId: "2",
                email: "dev@devpulse.com",
                fullName: "Sam Chen",
                role: "DEVELOPER",
                status: "ACTIVE",
                assignedProjects: ["Frontend App"],
              },
            ]
      );
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const fetchJoinRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const list = await adminApiService.getJoinRequests(companyId);
      setJoinRequests(list);
    } catch {
      setJoinRequests([
        {
          id: "req-101",
          requestId: "req-101",
          email: "jordan.park@example.com",
          githubUsername: "jordanpark-dev",
          targetProjectId: 1,
          targetProjectName: "Core API Service",
          message: "Requesting access to contribute to the backend team.",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: "PENDING",
        },
      ]);
    } finally {
      setLoadingRequests(false);
    }
  }, [companyId]);

  useEffect(() => {
    void fetchData();
    void fetchMembers();
    void fetchJoinRequests();
  }, [fetchData, fetchMembers, fetchJoinRequests]);

  // Handle Role Change
  const handleRoleChange = async (userId: string, newRole: CompanyRole) => {
    setUpdatingMemberId(userId);
    setOpenRoleMenuId(null);

    try {
      await adminApiService.updateMemberRole(userId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId || m.id === userId ? { ...m, role: newRole } : m))
      );
      addToast("success", "Role Updated", `Member role updated to ${newRole}.`);
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to update role.";
      addToast("error", "Update Failed", msg);
    } finally {
      setUpdatingMemberId(null);
    }
  };

  // Handle Revoke Member
  const handleRevoke = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to revoke membership for ${email}?`)) return;

    setUpdatingMemberId(userId);
    try {
      await adminApiService.revokeMember(userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId && m.id !== userId));
      addToast("success", "Member Revoked", `Revoked access for ${email}.`);
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to revoke member.";
      addToast("error", "Action Failed", msg);
    } finally {
      setUpdatingMemberId(null);
    }
  };

  // Handle Join Request Approve
  const handleApproveRequest = async (requestId: string | number, email: string) => {
    setProcessingRequestId(requestId);
    try {
      await adminApiService.approveJoinRequest(companyId, requestId);
      setJoinRequests((prev) => prev.filter((r) => r.requestId !== requestId && r.id !== requestId));
      addToast("success", "Request Approved", `Approved ${email} to join company workspace.`);
      void fetchMembers();
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to approve request.";
      addToast("error", "Approval Failed", msg);
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Handle Join Request Reject
  const handleRejectRequest = async (requestId: string | number, email: string) => {
    setProcessingRequestId(requestId);
    try {
      await adminApiService.rejectJoinRequest(companyId, requestId);
      setJoinRequests((prev) => prev.filter((r) => r.requestId !== requestId && r.id !== requestId));
      addToast("info", "Request Rejected", `Rejected join request from ${email}.`);
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to reject request.";
      addToast("error", "Action Failed", msg);
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Handle Invite Form Submission
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailsList = inviteEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailsList.length === 0) return;

    setIsSubmittingInvite(true);
    try {
      await adminApiService.inviteCompanyMembers({
        emails: emailsList,
        role: inviteRole,
        projectId: selectedProjectId || undefined,
        projectRole,
      });

      addToast("success", "Invitations Dispatched", `Sent invitations to ${emailsList.length} user(s).`);
      setInviteEmails("");
      setIsInviteModalOpen(false);
      void fetchMembers();
    } catch (err: unknown) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Failed to send invitations.";
      addToast("error", "Invitation Error", msg);
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  // Get Initials for Avatar
  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(" ");
      return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed right-6 top-20 z-50 flex w-80 flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismissToast} />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-0.5 text-xl font-bold text-ink">Company Workspace Members &amp; Approvals</h1>
          <p className="text-xs text-subtle">
            Manage company members, review pending workspace join requests, and send team invitations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FaUserPlus className="h-3.5 w-3.5" /> Invite Member
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "members"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "text-subtle hover:text-ink hover:bg-surface-raised"
          }`}
        >
          <FaUserCheck className="h-3.5 w-3.5" /> Approved Members ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer relative ${
            activeTab === "requests"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "text-subtle hover:text-ink hover:bg-surface-raised"
          }`}
        >
          <FaClock className="h-3.5 w-3.5" /> Pending Join Requests ({joinRequests.length})
          {joinRequests.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
          )}
        </button>
      </div>

      {/* TAB 1: Company Workspace Members */}
      {activeTab === "members" && (
        <section className="flex flex-col gap-3">
          {loadingMembers ? (
            <div className="flex items-center justify-center p-12 rounded-panel border border-border bg-surface">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-panel border border-dashed border-border p-8 text-center bg-surface">
              <p className="text-sm font-semibold text-ink">No members found</p>
              <p className="mt-1 text-xs text-subtle">Use the "Invite Member" button above to onboard team members.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-panel border border-border bg-surface">
              <table className="w-full border-collapse text-left text-xs text-ink">
                <thead className="border-b border-border bg-surface-raised/60 font-semibold tracking-wider text-subtle">
                  <tr>
                    <th className="px-4 py-3">MEMBER DETAILS</th>
                    <th className="px-4 py-3">SYSTEM ROLE</th>
                    <th className="px-4 py-3">ASSIGNED PROJECTS</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {members.map((member) => {
                    const isUpdating = updatingMemberId === (member.userId || member.id);
                    const initials = getInitials(member.fullName, member.email);

                    return (
                      <tr key={member.id || member.email} className="transition-colors hover:bg-surface-raised/30">
                        {/* User Details & Avatar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-xs">
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-ink">{member.fullName || member.email.split("@")[0]}</span>
                              <span className="font-mono text-[11px] text-subtle">{member.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* System Role */}
                        <td className="px-4 py-3">
                          {member.role === "ADMIN" ? (
                            <Badge variant="info" className="flex items-center gap-1 w-fit">
                              <FaCrown className="h-3 w-3 text-amber-400" /> Admin
                            </Badge>
                          ) : member.role === "MANAGER" ? (
                            <Badge variant="warning" className="flex items-center gap-1 w-fit">
                              Manager
                            </Badge>
                          ) : (
                            <Badge variant="default" className="flex items-center gap-1 w-fit">
                              Developer
                            </Badge>
                          )}
                        </td>

                        {/* Assigned Projects */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {member.assignedProjects && member.assignedProjects.length > 0 ? (
                              member.assignedProjects.map((pName) => (
                                <span
                                  key={pName}
                                  className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-surface-raised px-2 py-0.5 text-[10px] font-mono text-muted"
                                >
                                  <FaProjectDiagram className="h-2.5 w-2.5 text-accent" /> {pName}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-subtle italic">No projects assigned</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="relative flex items-center justify-end gap-3">
                            {isUpdating ? (
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

                            {/* Dropdown Menu for Role Change */}
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Pending Join Requests */}
      {activeTab === "requests" && (
        <section className="flex flex-col gap-3">
          {loadingRequests ? (
            <div className="flex items-center justify-center p-12 rounded-panel border border-border bg-surface">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : joinRequests.length === 0 ? (
            <div className="rounded-panel border border-dashed border-border p-8 text-center bg-surface">
              <p className="text-sm font-semibold text-ink">No pending join requests</p>
              <p className="mt-1 text-xs text-subtle">New workspace access requests from users will appear here for admin review.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {joinRequests.map((req) => {
                const isProcessing = processingRequestId === req.requestId || processingRequestId === req.id;

                return (
                  <div
                    key={req.requestId || req.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-panel border border-border bg-surface p-5 transition hover:border-border/80"
                  >
                    <div className="flex flex-col gap-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink text-sm">{req.email}</span>
                        {req.githubUsername && (
                          <Badge variant="default" className="flex items-center gap-1 font-mono text-[10px]">
                            <FaGithub className="h-3 w-3 text-ink" /> {req.githubUsername}
                          </Badge>
                        )}
                      </div>

                      {req.targetProjectName && (
                        <div className="text-xs text-muted flex items-center gap-1.5">
                          <span>Target Project:</span>
                          <span className="font-semibold text-accent font-mono">
                            {req.targetProjectName}
                          </span>
                        </div>
                      )}

                      {req.message && (
                        <p className="text-xs text-subtle italic bg-surface-raised/60 border border-border/40 p-2.5 rounded-lg">
                          "{req.message}"
                        </p>
                      )}

                      <span className="text-[10px] text-subtle">
                        Requested: {new Date(req.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleRejectRequest(req.requestId || req.id, req.email)}
                        className="border-danger/40 text-danger hover:bg-danger/10 flex items-center gap-1.5"
                      >
                        <FaTimes className="h-3 w-3" /> Reject
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        loading={isProcessing}
                        disabled={isProcessing}
                        onClick={() => handleApproveRequest(req.requestId || req.id, req.email)}
                        className="bg-success hover:bg-success/90 text-white flex items-center gap-1.5 border-none"
                      >
                        <FaCheck className="h-3 w-3" /> Approve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Invite Member Modal */}
      <Modal open={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
        <ModalHeader title="Invite Member to Workspace" onClose={() => setIsInviteModalOpen(false)} />
        <form onSubmit={handleSendInvite}>
          <ModalBody className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-invite-emails" className="text-xs font-medium text-muted">
                Email Address(es)
              </label>
              <textarea
                id="modal-invite-emails"
                rows={3}
                required
                placeholder="developer@company.com, engineer@company.com"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-3 text-xs text-ink placeholder:text-subtle font-mono outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-company-role" className="text-xs font-medium text-muted">
                  Company System Role
                </label>
                <select
                  id="modal-company-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as CompanyRole)}
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink outline-none focus:border-accent cursor-pointer"
                >
                  <option value="DEVELOPER">Member / Developer</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Company Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-target-project" className="text-xs font-medium text-muted">
                  Target Project (Optional)
                </label>
                <select
                  id="modal-target-project"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink outline-none focus:border-accent cursor-pointer"
                >
                  <option value="">No Project (Workspace only)</option>
                  {projects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProjectId && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-project-role" className="text-xs font-medium text-muted">
                  Project Access Role
                </label>
                <select
                  id="modal-project-role"
                  value={projectRole}
                  onChange={(e) => setProjectRole(e.target.value as "DEVELOPER" | "MANAGER")}
                  className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink outline-none focus:border-accent cursor-pointer"
                >
                  <option value="DEVELOPER">DEVELOPER - Project Contributor</option>
                  <option value="MANAGER">MANAGER - Project Admin</option>
                </select>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isSubmittingInvite}
              disabled={isSubmittingInvite}
            >
              Send Invitation
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
