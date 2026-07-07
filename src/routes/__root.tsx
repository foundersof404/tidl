import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

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
      { rel: "stylesheet", href: appCss },
      { 
        rel: "stylesheet", 
        href: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/css/tidl-health.webflow.shared.523f83688.min.css",
        type: "text/css",
        integrity: "sha384-Uj+DaI8Gfw33k2330SsxJqWbRLKwRa4OYL0nvA3kUo8c+wl6Pz1/b7Pd+DNLKmGV",
        crossOrigin: "anonymous"
      },
      { rel: "stylesheet", href: "/webflow.css" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/lenis@1.1.17/dist/lenis.min.css" },
      { rel: "icon", href: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49b15533f1b764070d43db_images.png", type: "image/png" },
      { rel: "preconnect", href: "https://cdn.prod.website-files.com" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const WEBFLOW_SCRIPTS = [
  {
    id: "wf-jquery",
    src: "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6a484773bf274d9b9ec3f5b9",
    integrity: "sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=",
  },
  {
    id: "wf-schunk-1",
    src: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/js/webflow.schunk.36b8fb49256177c8.js",
    integrity: "sha384-4abIlA5/v7XaW1HMXKBgnUuhnjBYJ/Z9C1OSg4OhmVw9O3QeHJ/qJqFBERCDPv7G",
  },
  {
    id: "wf-schunk-2",
    src: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/js/webflow.schunk.c42549641b7d4501.js",
    integrity: "sha384-EeGd0MuCSKO1a60JtC5HSnHq/C4KrtHuH4qImMGUQIlIox5ZJ0y/b+zo9WWvnaty",
  },
  {
    id: "wf-schunk-3",
    src: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/js/webflow.schunk.71e4342cb7d6dbdb.js",
    integrity: "sha384-wnP4etk4qtIqUy2H9Ei4modxaOgss5AVw1yKa7FNnkHlhLeadIB6z6hrVk+R6M4o",
  },
  {
    id: "wf-main",
    src: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/js/webflow.f02f4840.13501a53cca1cc5a.js",
    integrity: "sha384-BDNyq5sWX49uGVxsO0r5EQAJnSspbK2j63JluC4U5covUaUKVp99Bfzx6vapqNZJ",
  },
] as const;

function WebflowClientScripts() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("w-mod-js");
    if ("ontouchstart" in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      root.classList.add("w-mod-touch");
    }

    for (const scriptInfo of WEBFLOW_SCRIPTS) {
      if (document.getElementById(scriptInfo.id)) continue;
      const script = document.createElement("script");
      script.id = scriptInfo.id;
      script.src = scriptInfo.src;
      script.type = "text/javascript";
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.integrity = scriptInfo.integrity;
      document.body.appendChild(script);
    }
  }, []);

  return null;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-wf-domain="tidl-health.webflow.io"
      data-wf-page="6a484775bf274d9b9ec3f5ff"
      data-wf-site="6a484773bf274d9b9ec3f5b9"
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body className="body" suppressHydrationWarning>
        {children}
        <Scripts />
        <WebflowClientScripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
