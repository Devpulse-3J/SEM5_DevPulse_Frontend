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
import type { CreateProjectRequest } from "@/types/adminProject";

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectRequest) => void;
}

export function CreateProjectModal({ open, onClose, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [jiraProjectKey, setJiraProjectKey] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();

  const reset = () => {
    setName("");
    setDescription("");
    setJiraProjectKey("");
    setNameError(undefined);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }

    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      jiraProjectKey: jiraProjectKey.trim() || undefined,
    });

    reset();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader
        title="Create Project"
        description="Not saved to the backend — there is no project endpoint yet."
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Input
            label="Project name"
            type="text"
            placeholder="Backend API"
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
          <Button type="button" variant="secondary" size="md" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Create
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
