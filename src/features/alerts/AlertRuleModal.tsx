"use client";

import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalField } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AlertRule } from "@/types/notification";

interface AlertRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRule: (rule: Omit<AlertRule, "id" | "createdAt">) => void;
}

export function AlertRuleModal({ isOpen, onClose, onSubmitRule }: AlertRuleModalProps) {
  const [name, setName] = useState("");
  const [metric, setMetric] = useState<AlertRule["metric"]>("pr_risk");
  const [threshold, setThreshold] = useState<number>(75);
  const [condition, setCondition] = useState<AlertRule["condition"]>("ABOVE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmitRule({
      name,
      metric,
      threshold,
      condition,
      channels: ["in_app", "slack"],
      enabled: true,
    });
    onClose();
    setName("");
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader title="Create New Alert Threshold Rule" onClose={onClose} />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <ModalField label="Rule Name">
            <Input
              type="text"
              placeholder="e.g. High Risk Security PR Alert"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </ModalField>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <ModalField label="Target Metric">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as AlertRule["metric"])}
                className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
              >
                <option value="pr_risk">PR Risk Score</option>
                <option value="stale_pr">Stale PR Hours</option>
                <option value="coverage_drop">Code Coverage Drop %</option>
                <option value="failed_deployments">Failed Deployments</option>
              </select>
            </ModalField>

            <ModalField label="Condition">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as AlertRule["condition"])}
                className="rounded-[7px] border border-border bg-surface px-3 py-[7px] text-xs text-ink focus:outline-none focus:border-accent"
              >
                <option value="ABOVE">Exceeds (&gt;)</option>
                <option value="BELOW">Falls Below (&lt;)</option>
                <option value="EQUALS">Equals (=)</option>
              </select>
            </ModalField>
          </div>

          <ModalField label="Threshold Value">
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              required
            />
          </ModalField>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Rule
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default AlertRuleModal;
