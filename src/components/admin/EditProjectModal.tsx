"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalField,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateProjectName } from "@/lib/projectValidation";
import type { Project, UpdateProjectRequest } from "@/types/adminProject";
import { integrationsApiService, type JiraProject } from "@/services/api/integrations";

export interface EditProjectModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (data: UpdateProjectRequest) => void;
}

/**
 * Edits the name, description and Jira key only. The GitHub link is changed
 * from its own section — it is a different resource on the backend
 * (`repos`, not `projects`) and a different endpoint.
 */
export function EditProjectModal({
  open,
  project,
  onClose,
  onSave,
}: EditProjectModalProps) {
  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose} width={520}>
      <ModalHeader
        title="Edit Project"
        description="Edit project workspace settings."
        onClose={onClose}
      />
      <EditProjectForm
        key={project.id}
        project={project}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

function EditProjectForm({
  project,
  onClose,
  onSave,
}: {
  project: Project;
  onClose: () => void;
  onSave: (data: UpdateProjectRequest) => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [jiraProjectKey, setJiraProjectKey] = useState(
    project.jiraProjectKey ?? ""
  );
  const [nameError, setNameError] = useState<string | undefined>();
  const [jiraProjects, setJiraProjects] = useState<JiraProject[]>([]);

  useEffect(() => {
    let mounted = true;
    void integrationsApiService
      .getJiraAvailableProjects()
      .then((res) => {
        if (mounted && res?.projects) {
          setJiraProjects(res.projects);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextNameError = validateProjectName(name);
    setNameError(nextNameError);
    if (nextNameError) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      jiraProjectKey: jiraProjectKey.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <Input
          label="Project name"
          type="text"
          value={name}
          error={nameError}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(undefined);
          }}
        />

        <ModalField label="Description (optional)">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this project covers"
            className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-accent focus:ring-1 focus:ring-accent/40"
          />
        </ModalField>

        <ModalField label="Jira Project Key (optional)">
          {jiraProjects.length > 0 ? (
            <div className="flex flex-col gap-2">
              <select
                value={jiraProjectKey}
                onChange={(e) => setJiraProjectKey(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink outline-none transition focus:border-accent cursor-pointer"
              >
                <option value="">-- Select a Jira Project --</option>
                {jiraProjects.map((jp) => (
                  <option key={jp.id || jp.key} value={jp.key}>
                    {jp.name} ({jp.key})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or type key manually (e.g. DEVP)"
                value={jiraProjectKey}
                onChange={(e) => setJiraProjectKey(e.target.value)}
                className="h-8 w-full rounded-lg border border-border bg-surface-raised px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="DEVP"
              value={jiraProjectKey}
              onChange={(e) => setJiraProjectKey(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs text-ink placeholder:text-subtle outline-none transition focus:border-accent"
            />
          )}
        </ModalField>
      </ModalBody>

      <ModalFooter>
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md">
          Save changes
        </Button>
      </ModalFooter>
    </form>
  );
}

export default EditProjectModal;
