"use client";

import React, { useState, useEffect } from "react";
import { FaBuilding, FaShieldAlt, FaTrash, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Toast } from "@/components/notifications/Toast";
import { ToastMessage } from "@/store/notificationSlice";
import { authService } from "@/services/auth.service";
import { getStoredUser } from "@/lib/auth";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Security Toggles state
  const [securityPolicies, setSecurityPolicies] = useState({
    enforce2FA: true,
    allowGithubOAuth: true,
    restrictEmailDomain: false,
  });

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    async function loadData() {
      try {
        const user = await authService.getMe();
        if (user) {
          setOrgName(user.companyName || "My Organisation");
          setOrgSlug(user.companyName ? user.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "myorg");
          setAdminEmail(user.email || "");
        }
      } catch {
        // Fallback to local stored user
        const stored = getStoredUser();
        if (stored) {
          setOrgName("companyName" in stored ? stored.companyName || "My Organisation" : "My Organisation");
          setOrgSlug("companyName" in stored && stored.companyName ? stored.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "myorg");
          setAdminEmail(stored.email || "");
        } else {
          setOrgName("DevPulse Workspace");
          setOrgSlug("devpulse");
          setAdminEmail("admin@devpulse.com");
        }
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  const handleSaveOrgDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const derivedSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "");
      setOrgSlug(derivedSlug);
      addToast("success", "Settings Saved", "Organisation details updated successfully.");
    }, 600);
  };

  const togglePolicy = (key: keyof typeof securityPolicies) => {
    setSecurityPolicies((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      addToast(
        "info",
        "Policy Updated",
        `${key.replace(/([A-Z])/g, " $1")} is now ${updated[key] ? "enabled" : "disabled"}.`
      );
      return updated;
    });
  };

  const handleDeleteOrganisation = () => {
    if (confirmName.trim().toLowerCase() !== orgName.trim().toLowerCase()) return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      addToast("error", "Action Request Submitted", "Organisation deletion initiated.");
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex max-w-2xl flex-col gap-6 animate-pulse">
        <div className="h-6 w-48 rounded bg-surface-raised" />
        <div className="h-48 rounded-card bg-surface border border-border" />
        <div className="h-40 rounded-card bg-surface border border-border" />
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="fixed right-6 top-20 z-50 flex w-80 flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismissToast} />
          ))}
        </div>
      )}

      <div>
        <h1 className="mb-0.5 text-xl font-bold text-ink flex items-center gap-2">
          <FaBuilding className="h-5 w-5 text-accent" /> Organisation Settings
        </h1>
        <p className="text-xs text-subtle">
          Configure your organisation preferences, security policies, and administrative details.
        </p>
      </div>

      {/* Organisation Details */}
      <form
        onSubmit={handleSaveOrgDetails}
        className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6"
      >
        <h2 className="border-b border-border-subtle pb-3 text-[13px] font-semibold text-ink">
          Organisation Details
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-name-input" className="text-xs font-medium text-muted">
              Organisation Name
            </label>
            <input
              id="org-name-input"
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="h-9 rounded-lg border border-border bg-app px-3 text-xs text-ink transition-colors focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-slug-display" className="text-xs font-medium text-muted">
              Organisation Slug
            </label>
            <div
              id="org-slug-display"
              className="flex h-9 items-center rounded-lg border border-border bg-app px-3 font-mono text-xs text-subtle"
            >
              {orgSlug || "myorg"}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email-input" className="text-xs font-medium text-muted">
              Admin Contact Email
            </label>
            <input
              id="admin-email-input"
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="h-9 rounded-lg border border-border bg-app px-3 text-xs text-ink transition-colors focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" loading={isSaving} disabled={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Security Policies */}
      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
        <h2 className="border-b border-border-subtle pb-3 text-[13px] font-semibold text-ink flex items-center gap-2">
          <FaShieldAlt className="h-4 w-4 text-emerald-400" /> Security &amp; Authentication Policies
        </h2>

        <div className="flex flex-col gap-4">
          {[
            {
              key: "enforce2FA" as const,
              label: "Enforce 2FA for all organisation members",
              description: "Requires two-factor authentication for all account sign-ins.",
            },
            {
              key: "allowGithubOAuth" as const,
              label: "Allow GitHub OAuth login",
              description: "Permits team members to sign in using GitHub credentials.",
            },
            {
              key: "restrictEmailDomain" as const,
              label: "Restrict access by organisation email domain",
              description: "Only emails matching your company domain can accept invites.",
            },
          ].map(({ key, label, description }) => {
            const checked = securityPolicies[key];
            return (
              <div
                key={key}
                onClick={() => togglePolicy(key)}
                className="flex items-center justify-between cursor-pointer rounded-lg border border-border/60 bg-surface-raised p-3.5 transition hover:border-border"
              >
                <div>
                  <div className="text-xs font-medium text-ink">{label}</div>
                  <div className="mt-0.5 text-[11px] text-subtle">{description}</div>
                </div>

                <div
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    checked ? "bg-accent" : "bg-border-subtle"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-sm flex items-center justify-center ${
                      checked ? "left-[18px]" : "left-0.5"
                    }`}
                  >
                    {checked && <FaCheck className="h-2.5 w-2.5 text-accent" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="flex flex-col gap-4 rounded-card border border-danger/30 bg-surface p-6">
        <h2 className="border-b border-danger/20 pb-3 text-[13px] font-semibold text-danger flex items-center gap-2">
          <FaExclamationTriangle className="h-4 w-4" /> Danger Zone
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-ink">Delete Organisation</div>
            <div className="mt-0.5 text-[11px] text-subtle">
              Permanently remove this organisation, projects, and all associated workspace data.
            </div>
          </div>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={() => {
              setConfirmName("");
              setIsDeleteModalOpen(true);
            }}
          >
            Delete Organisation
          </Button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalHeader title="Confirm Organisation Deletion" onClose={() => setIsDeleteModalOpen(false)} />
        <ModalBody>
          <div className="flex flex-col gap-3 text-xs text-subtle">
            <p className="text-danger font-semibold">
              Warning: This action cannot be undone. All workspace metrics, projects, and member access will be permanently destroyed.
            </p>
            <p>
              Please type <strong className="text-ink">{orgName}</strong> below to confirm.
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={orgName}
              className="h-9 rounded-lg border border-border bg-app px-3 text-xs text-ink outline-none focus:border-danger"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={confirmName.trim().toLowerCase() !== orgName.trim().toLowerCase() || isDeleting}
            loading={isDeleting}
            onClick={handleDeleteOrganisation}
          >
            Delete Permanently
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
