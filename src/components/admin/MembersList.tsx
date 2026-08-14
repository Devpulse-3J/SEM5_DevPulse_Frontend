"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ProjectMember, ProjectRoleLabel } from "@/types/adminProject";

export interface MembersListProps {
  members: ProjectMember[];
  onInviteClick: () => void;
  onChangeRole: (memberId: string, role: ProjectRoleLabel) => void;
  onRemoveClick: (member: ProjectMember) => void;
}

export function MembersList({
  members,
  onInviteClick,
  onChangeRole,
  onRemoveClick,
}: MembersListProps) {
  /** Which row's role menu is open, if any. */
  const [openRoleMenuId, setOpenRoleMenuId] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">
            Members {members.length > 0 && `(${members.length})`}
          </h2>
          <p className="mt-0.5 text-[11px] text-subtle">
            Roles apply to this project only
          </p>
        </div>
        <Button variant="primary" size="md" onClick={onInviteClick}>
          + Invite Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="rounded-panel border border-dashed border-border p-8 text-center">
          <p className="text-sm text-ink">No members yet</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs text-muted">
            Invite someone to add them to this project.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-panel border border-border bg-surface">
          <table className="w-full border-collapse text-left text-xs text-ink">
            <thead className="border-b border-border bg-surface-raised/60 font-semibold tracking-widest text-subtle">
              <tr>
                <th className="px-4 py-2.5 text-[11px]">MEMBER</th>
                <th className="px-4 py-2.5 text-[11px]">EMAIL</th>
                <th className="px-4 py-2.5 text-[11px]">ROLE</th>
                <th className="px-4 py-2.5 text-right text-[11px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {members.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-surface-raised/30">
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{member.fullName}</span>
                    {member.pending && (
                      <Badge variant="warning" className="ml-2">
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted">
                    {member.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={member.role === "MANAGER" ? "info" : "default"}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenRoleMenuId((current) =>
                            current === member.id ? null : member.id
                          )
                        }
                        className="cursor-pointer border-none bg-transparent text-xs font-medium text-accent hover:underline"
                      >
                        Change Role
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveClick(member)}
                        className="cursor-pointer border-none bg-transparent text-xs font-medium text-danger hover:underline"
                      >
                        Remove from Project
                      </button>

                      {openRoleMenuId === member.id && (
                        <div className="absolute right-0 top-6 z-20 flex w-40 flex-col overflow-hidden rounded-lg border border-border bg-surface-raised shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]">
                          {(["MANAGER", "DEVELOPER"] as ProjectRoleLabel[]).map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                onChangeRole(member.id, role);
                                setOpenRoleMenuId(null);
                              }}
                              className={`cursor-pointer border-none px-3 py-2 text-left text-xs transition-colors hover:bg-surface ${
                                member.role === role
                                  ? "font-semibold text-ink"
                                  : "text-muted"
                              }`}
                            >
                              {role}
                              {member.role === role && " ✓"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default MembersList;
