"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalField,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ALERT_RULE_TYPES, type CreateAlertRuleRequest } from "@/types/notification";

interface AlertRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRule: (rule: CreateAlertRuleRequest) => void;
  /** From GET /api/auth/me — never hardcoded. */
  companyId: number;
  /** The signed-in user, recorded as the rule's author. */
  createdByUserId: number | null;
  /** Optional project scope; null means the rule applies company-wide. */
  projectId?: number | null;
  isSubmitting?: boolean;
}

/**
 * Create an alert rule.
 *
 * Fields map 1:1 to the notification-service entity. We deliberately do NOT
 * send ruleId or createdAt — the endpoint accepts the raw entity and would take
 * them, but identity and timestamps belong to the server.
 */
export function AlertRuleModal({
  isOpen,
  onClose,
  onSubmitRule,
  companyId,
  createdByUserId,
  projectId = null,
  isSubmitting = false,
}: AlertRuleModalProps) {
  const [ruleType, setRuleType] = useState<string>(ALERT_RULE_TYPES[0]);
  const [thresholdHours, setThresholdHours] = useState<string>("24");
  const [slackChannel, setSlackChannel] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedHours = thresholdHours.trim();
    const parsedHours = trimmedHours === "" ? null : Number(trimmedHours);

    onSubmitRule({
      companyId,
      projectId,
      ruleType,
      thresholdHours:
        parsedHours !== null && Number.isFinite(parsedHours) ? parsedHours : null,
      slackChannel: slackChannel.trim() === "" ? null : slackChannel.trim(),
      createdByUserId,
    });

    onClose();
    setSlackChannel("");
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader title="Create alert rule" onClose={onClose} />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <ModalField label="Rule type">
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:border-accent focus:outline-none"
            >
              {ALERT_RULE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </ModalField>

          <ModalField label="Threshold (hours)">
            <Input
              type="number"
              min={0}
              value={thresholdHours}
              onChange={(e) => setThresholdHours(e.target.value)}
              placeholder="Leave blank for no threshold"
            />
          </ModalField>

          <ModalField label="Slack channel">
            <Input
              type="text"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              placeholder="#eng-alerts"
            />
          </ModalField>

          <p className="text-[11px] text-subtle">
            Rules are stored and evaluated by notification-service. Use “Trigger
            demo alert” on the integrations page to exercise the delivery
            pipeline end to end.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save rule"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default AlertRuleModal;
