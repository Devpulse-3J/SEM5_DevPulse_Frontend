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
import { validateProjectName } from "@/lib/projectValidation";
import type { Project, UpdateProjectRequest } from "@/types/adminProject";

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
        description="Local only — no update endpoint exists yet."
        onClose={onClose}
      />
      {/*
        The form seeds its fields from `project` at mount. `Modal` renders
        nothing while closed, so reopening remounts it and the fields reset —
        no effect syncing props into state. The key covers the case where a
        different project is opened without the modal closing in between.
      */}
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

        <Input
          label="Jira project key (optional)"
          type="text"
          placeholder="DEVP"
          value={jiraProjectKey}
          onChange={(e) => setJiraProjectKey(e.target.value)}
        />
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
