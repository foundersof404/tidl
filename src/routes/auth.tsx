import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthPage } from "@/components/auth/AuthPage";

const authSearchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: "Membership | TIDL" },
      {
        name: "description",
        content: "Sign in to your TIDL performance membership.",
      },
    ],
  }),
  component: AuthRoute,
});

function AuthRoute() {
  const { mode } = Route.useSearch();
  return <AuthPage initialMode={mode === "signup" ? "signup" : "signin"} />;
}
