import { createFileRoute } from "@tanstack/react-router";
import { BookAppointmentPage } from "@/components/flows/book-appointment-page";

export const Route = createFileRoute("/book-appointment")({
  component: BookAppointmentPage,
});
