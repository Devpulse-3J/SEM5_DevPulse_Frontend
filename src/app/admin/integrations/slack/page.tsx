"use client";

import { useSearchParams } from "next/navigation";
import { SlackIntegrationCard } from "@/components/integrations/SlackIntegrationCard";

export default function SlackIntegrationPage() {
  const searchParams = useSearchParams();
  const oauthConnected =
    Boolean(searchParams?.get("code")) ||
    searchParams?.get("status") === "connected" ||
    searchParams?.get("connected") === "true";

  return <SlackIntegrationCard initialConnected={oauthConnected} />;
}
