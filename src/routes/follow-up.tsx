import { createFileRoute } from "@tanstack/react-router";
import { FollowUpPage } from "@/components/flows/follow-up-page";

export const Route = createFileRoute("/follow-up")({
  component: FollowUpPage,
});
