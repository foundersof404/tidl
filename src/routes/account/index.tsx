import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { StatusTimeline } from "@/components/checkout/StatusTimeline";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FUNNEL_NAV_LINKS } from "@/components/layout/site-nav";
import { useSiteHeaderState } from "@/hooks/useSiteHeaderState";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { lockPageScroll, unlockPageScroll } from "@/lib/age-gate";
import { formatCurrency } from "@/lib/pricing";
import { getRecommendedTreatment } from "@/lib/products";
import { getLatestOrderForUser } from "@/lib/order-storage";
import { useAuth } from "@/providers/auth-provider";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import "@/components/checkout/checkout.css";
import "@/components/account/account.css";

export const Route = createFileRoute("/account/")({
  component: AccountPage,
});

function AccountPageShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pinned, theme, transparent } = useSiteHeaderState({ defaultTheme: "light" });

  useEffect(() => {
    if (!menuOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [menuOpen]);

  return (
    <div className="account-page" data-site-header-theme="light">
      <SiteHeader
        navLinks={FUNNEL_NAV_LINKS}
        menuOpen={menuOpen}
        pinned={pinned}
        transparent={transparent}
        theme={theme}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      {children}
    </div>
  );
}

function AccountPage() {
  const mounted = useIsMounted();
  const { user, hydrated: authHydrated } = useAuth();
  const { openModal } = useQuizModal();

  if (!mounted || !authHydrated) {
    return (
      <AccountPageShell>
        <div className="account-shell" aria-hidden />
      </AccountPageShell>
    );
  }

  const order = user ? getLatestOrderForUser(user.id) : null;

  if (!user) {
    return (
      <AccountPageShell>
        <div className="account-empty">
          <div className="account-empty-card">
            <p className="account-kicker">Your account</p>
            <h1 className="account-empty-title">Sign in to view your care</h1>
            <p className="account-empty-copy">
              Complete the assessment to create your account and start your treatment plan.
            </p>
            <button type="button" onClick={() => openModal()} className="account-cta">
              Start assessment
            </button>
          </div>
        </div>
      </AccountPageShell>
    );
  }

  if (!order) {
    return (
      <AccountPageShell>
        <div className="account-empty">
          <div className="account-empty-card">
            <p className="account-kicker">Your care</p>
            <h1 className="account-empty-title">Welcome, {user.firstName}</h1>
            <p className="account-empty-copy">
              You haven&apos;t started a treatment plan yet. Take the five-minute assessment to get
              matched with a physician-reviewed program.
            </p>
            <button type="button" onClick={() => openModal()} className="account-cta">
              Take the assessment
            </button>
          </div>
        </div>
      </AccountPageShell>
    );
  }

  const product = getRecommendedTreatment(order.quizSnapshot.goal, order.quizSnapshot.productSlug);
  const placedOn = new Date(order.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AccountPageShell>
      <div className="account-shell">
        <div className="account-topbar">
          <div>
            <p className="account-kicker">Your care</p>
            <h1 className="account-title">Welcome back, {user.firstName}</h1>
            <p className="account-lead">
              Order <strong>{order.orderNumber}</strong> · placed {placedOn}
            </p>
          </div>
          <Link to="/" className="account-topbar-link">
            Home
          </Link>
        </div>

        <div className="account-card">
          <div className="account-product">
            <div className="account-product-visual">
              <img src={product?.image ?? ""} alt="" loading="lazy" />
            </div>
            <div>
              <h2 className="account-product-name">{order.treatmentName}</h2>
              <p className="account-product-meta">{order.treatmentDescription}</p>
              <p className="account-product-meta">{order.dosage}</p>
            </div>
          </div>
          <p className="account-product-price">
            Monthly plan: {formatCurrency(order.pricing.treatmentMonthly)}
          </p>
          {order.nextRefillDate ? (
            <div className="account-meta-row">
              <p className="account-meta-item">
                Next refill:{" "}
                <strong>{new Date(order.nextRefillDate).toLocaleDateString()}</strong>
              </p>
            </div>
          ) : null}
        </div>

        <div className="account-card">
          <h3 className="account-card-title">Care timeline</h3>
          <StatusTimeline status={order.status} />
        </div>

        <Link to="/" className="account-cta" style={{ marginTop: 24 }}>
          Back to home
        </Link>
      </div>
    </AccountPageShell>
  );
}
