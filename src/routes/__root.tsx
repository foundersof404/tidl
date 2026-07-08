import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../providers/auth-provider";
import { QuizModalProvider } from "../providers/quiz-modal-provider";
import { AgeGate } from "../components/age-gate/AgeGate";
import { LenisScroll } from "../components/lenis/LenisScroll";
import { QuizModal } from "../components/quiz/QuizModal";
import { isAgeGateConfirmed } from "../lib/age-gate";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function WebflowCssCompat() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("w-mod-js");
    if ("ontouchstart" in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      root.classList.add("w-mod-touch");
    }

    document.querySelectorAll(".w-webflow-badge").forEach((node) => node.remove());
  }, []);

  return null;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body className="body" suppressHydrationWarning>
        {children}
        <Scripts />
        <WebflowCssCompat />
      </body>
    </html>
  );
}

function AppProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(true);

  useEffect(() => {
    setMounted(true);
    setAgeConfirmed(isAgeGateConfirmed());
  }, []);

  return (
    <AuthProvider>
      <QuizModalProvider>
        {mounted && !ageConfirmed ? (
          <AgeGate onConfirmed={() => setAgeConfirmed(true)} />
        ) : null}
        <LenisScroll />
        {children}
        <QuizModal />
      </QuizModalProvider>
    </AuthProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AppProviders>
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tidl Health" },
      { name: "description", content: "Doctor-prescribed GLP-1, TRT, and peptide treatments. Online in 5 minutes, delivered to your door." },
      { property: "og:title", content: "Tidl Health" },
      { property: "og:description", content: "Doctor-prescribed GLP-1, TRT, and peptide treatments. Online in 5 minutes, delivered to your door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tidl Health" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/css/tidl-health.webflow.shared.523f83688.min.css",
        type: "text/css",
        integrity: "sha384-Uj+DaI8Gfw33k2330SsxJqWbRLKwRa4OYL0nvA3kUo8c+wl6Pz1/b7Pd+DNLKmGV",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: "/webflow.css" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/lenis@1.1.17/dist/lenis.min.css" },
      { rel: "icon", href: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49b15533f1b764070d43db_images.png", type: "image/png" },
      { rel: "preconnect", href: "https://cdn.prod.website-files.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
