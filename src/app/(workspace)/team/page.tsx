"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaSlack } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { projectService, type ProjectMemberApiResponse } from "@/services/project.service";
import { integrationsApiService, type SlackChannel } from "@/services/api/integrations";
import { notificationService } from "@/services/notification.service";

type MessageChannel = "EMAIL" | "SLACK";

function memberId(member: ProjectMemberApiResponse, index: number): string {
  return String(member.userId ?? member.memberId ?? member.id ?? `member-${index}`);
}

export default function TeamPage() {
  const activeProject = useSelector((state: RootState) => state.dashboard.activeProject);
  const [members, setMembers] = useState<ProjectMemberApiResponse[]>([]);
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<MessageChannel>("EMAIL");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!activeProject || activeProject.role !== "MANAGER") {
      return;
    }

    let cancelled = false;
    Promise.all([
      projectService.getMembers(activeProject.id),
      integrationsApiService.getSlackChannels(),
    ])
      .then(([team, channels]) => {
        if (cancelled) return;
        setMembers(team);
        setSlackChannels(channels);
        setSlackChannel(channels[0]?.id ?? channels[0]?.name ?? "");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setNotice({ type: "error", text: error instanceof Error ? error.message : "Could not load the team." });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeProject]);

  const selectableMembers = useMemo(() => members.filter((member) => Boolean(member.email)), [members]);
  const allSelected = selectableMembers.length > 0 && selected.size === selectableMembers.length;

  const toggleMember = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(selectableMembers.map(memberId)));
  };

  const sendMessage = async () => {
    if (!activeProject || selected.size === 0 || !message.trim()) return;
    setSending(true);
    setNotice(null);
    try {
      const recipients = selectableMembers.flatMap((member, index) => {
        const id = memberId(member, index);
        if (!selected.has(id) || !member.email) return [];
        return [{ userId: id, email: member.email, name: member.fullName ?? member.name ?? member.email }];
      });
      const result = await notificationService.sendTeamMessage({
        projectId: activeProject.id,
        channel,
        recipients,
        subject: channel === "EMAIL" ? subject.trim() : undefined,
        message: message.trim(),
        slackChannel: channel === "SLACK" ? slackChannel : undefined,
      });
      if (result.failed) {
        setNotice({ type: "error", text: `${result.delivered} delivered; ${result.failed} failed.` });
      } else {
        setNotice({ type: "success", text: `Message sent to ${result.delivered} teammate${result.delivered === 1 ? "" : "s"}.` });
        setMessage("");
        setSubject("");
      }
    } catch (error: unknown) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "The message could not be sent." });
    } finally {
      setSending(false);
    }
  };

  if (!activeProject || activeProject.role !== "MANAGER") {
    return <div className="p-6 md:p-7"><Card><CardTitle>Manager access required</CardTitle><p className="mt-2 text-xs text-muted">Only project managers can message team members.</p></Card></div>;
  }
  if (loading) return <div className="flex min-h-[320px] items-center justify-center"><Spinner /></div>;

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">Team communication</h1>
        <p className="mt-1 font-mono text-xs text-subtle">Select members of {activeProject.name} and contact them by email or Slack</p>
      </div>

      {notice && <div className={`rounded-lg border px-4 py-3 text-xs ${notice.type === "success" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>{notice.text}</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <Card padding={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div><CardTitle>Project members</CardTitle><p className="mt-1 text-[11px] text-subtle">{selected.size} of {selectableMembers.length} selected</p></div>
            <Button variant="ghost" size="sm" onClick={toggleAll} disabled={!selectableMembers.length}>{allSelected ? "Clear all" : "Select all"}</Button>
          </div>
          <div className="divide-y divide-border-subtle">
            {selectableMembers.length ? selectableMembers.map((member, index) => {
              const id = memberId(member, index);
              const name = member.fullName ?? member.name ?? member.email ?? "Unknown member";
              return (
                <label key={id} className="flex cursor-pointer items-center gap-3 px-5 py-3.5 hover:bg-surface-raised/50">
                  <input type="checkbox" checked={selected.has(id)} onChange={() => toggleMember(id)} className="h-4 w-4 accent-accent" />
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">{name.slice(0, 1).toUpperCase()}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-ink">{name}</span><span className="block truncate text-[11px] text-subtle">{member.email}</span></span>
                  <span className="rounded-md border border-border px-2 py-1 text-[10px] uppercase text-muted">{member.role ?? "MEMBER"}</span>
                </label>
              );
            }) : <p className="p-6 text-center text-xs text-muted">No members with email addresses were found.</p>}
          </div>
        </Card>

        <Card className="h-fit">
          <CardTitle>Compose message</CardTitle>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setChannel("EMAIL")} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium ${channel === "EMAIL" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"}`}><FaEnvelope /> Email</button>
            <button type="button" onClick={() => setChannel("SLACK")} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium ${channel === "SLACK" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"}`}><FaSlack /> Slack</button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {channel === "EMAIL" ? (
              <label className="text-xs font-medium text-muted">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={160} placeholder="Message subject" className="mt-1.5 w-full rounded-lg border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none focus:border-accent" /></label>
            ) : (
              <label className="text-xs font-medium text-muted">Slack channel<select value={slackChannel} onChange={(event) => setSlackChannel(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none focus:border-accent">{slackChannels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            )}
            <label className="text-xs font-medium text-muted">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={4000} rows={7} placeholder="Write a message to your team…" className="mt-1.5 w-full resize-y rounded-lg border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none focus:border-accent" /></label>
            <Button onClick={() => void sendMessage()} loading={sending} disabled={selected.size === 0 || !message.trim() || (channel === "EMAIL" && !subject.trim()) || (channel === "SLACK" && !slackChannel)} className="w-full">Send to {selected.size} selected</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
