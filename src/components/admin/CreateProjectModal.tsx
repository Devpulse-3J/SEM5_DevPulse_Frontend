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
import {
  normaliseGithubRepoUrl,
  validateGithubRepoUrl,
  validateProjectName,
} from "@/lib/projectValidation";
import type { CreateProjectRequest } from "@/types/adminProject";

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectRequest) => Promise<void>;
}

export function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [jiraProjectKey, setJiraProjectKey] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [nameError, setNameError] = useState<string | undefined>();
  const [urlError, setUrlError] = useState<string | undefined>();

  const reset = () => {
    setName("");
    setDescription("");
    setJiraProjectKey("");
    setGithubRepoUrl("");
    setNameError(undefined);
    setUrlError(undefined);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextNameError = validateProjectName(name);
    const nextUrlError = githubRepoUrl.trim()
      ? validateGithubRepoUrl(githubRepoUrl)
      : undefined;
    setNameError(nextNameError);
    setUrlError(nextUrlError);
    if (nextNameError || nextUrlError) return;

    setIsCreating(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        jiraProjectKey: jiraProjectKey.trim() || undefined,
        githubRepoUrl: githubRepoUrl.trim()
          ? normaliseGithubRepoUrl(githubRepoUrl)
          : undefined,
      });
      reset();
    } catch {
      // The provider displays the API error as a toast. Keep this modal open so
      // the user can correct the values and retry.
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} width={520}>
      <ModalHeader
        title="Create Project"
        description="Create a new project workspace."
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

          <div className="h-px bg-border" />

          <Input
            label="GitHub repository URL (optional)"
            type="text"
            placeholder="https://github.com/owner/repo"
            value={githubRepoUrl}
            error={urlError}
            onChange={(e) => {
              setGithubRepoUrl(e.target.value);
              if (urlError) setUrlError(undefined);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" size="md" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={isCreating}>
            Create
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
