import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  checkoutDefaultValues,
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/lib/checkout-schema";
import { registerFromQuiz } from "@/lib/auth-storage";
import { createOrder } from "@/lib/order-storage";
import { clearQuizState, readQuizState } from "@/lib/quiz-storage";
import { calculateOrderPricing } from "@/lib/pricing";
import { getRecommendedTreatment } from "@/lib/products";
import { submitPrxCheckout } from "@/lib/prescribe-rx/browse-api";
import { useAuth } from "@/providers/auth-provider";
import "./checkout.css";

function LocationIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 17s5-4.2 5-8.4a5 5 0 1 0-10 0C5 12.8 10 17 10 17Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="10" cy="8.6" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="15" height="10" rx="1.8" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="5.5" y="4.5" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.5V3.8a2 2 0 0 1 4 0v.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function LockSmallIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="5" y="9" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 9V6.8a3 3 0 1 1 6 0V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CheckoutForm() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const stored = readQuizState();
  const quizData = stored?.data;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      ...checkoutDefaultValues,
      phone: quizData?.phone ?? "",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = handleSubmit(async (values) => {
    if (!quizData) return;
    setSubmitError(null);

    const product = getRecommendedTreatment(quizData.goal, quizData.productSlug);
    const pricing = calculateOrderPricing(product);

    let userId = user?.id;
    if (!userId) {
      const registered = registerFromQuiz({
        email: quizData.email,
        phone: values.phone,
        password: quizData.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      setUser(registered);
      userId = registered.id;
    }

    try {
      await submitPrxCheckout(
        {
          quiz: quizData,
          checkout: values,
          product: {
            slug: product.slug,
            name: product.name,
            monthlyPrice: product.monthlyPrice,
            dosage: product.dosage,
            goal: product.goal,
          },
        },
        crypto.randomUUID(),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not submit your order to PrescribeRx. Please try again.";
      setSubmitError(message);
      return;
    }

    const order = createOrder({
      userId,
      quiz: quizData,
      checkout: values,
      product,
      pricing,
    });

    clearQuizState();
    navigate({
      to: "/confirmation",
      search: { orderId: order.id },
    });
  });

  return (
    <form onSubmit={onSubmit} className="checkout-form">
      <section className="checkout-card">
        <div className="checkout-card-head">
          <div className="checkout-card-title-wrap">
            <span className="checkout-card-icon">
              <LocationIcon />
            </span>
            <div>
              <h2 className="checkout-card-title">Shipping address</h2>
              <p className="checkout-card-sub">Where your treatment will be delivered</p>
            </div>
          </div>
          <span className="checkout-card-badge">Discreet packaging</span>
        </div>

        <div className="checkout-field-grid checkout-field-grid--2">
          <Field label="First name" error={errors.firstName?.message}>
            <input className="checkout-input" autoComplete="given-name" {...register("firstName")} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input className="checkout-input" autoComplete="family-name" {...register("lastName")} />
          </Field>
        </div>

        <Field label="Street address" error={errors.addressLine1?.message}>
          <input className="checkout-input" autoComplete="address-line1" {...register("addressLine1")} />
        </Field>

        <Field label="Apt / Suite (optional)">
          <input className="checkout-input" autoComplete="address-line2" {...register("addressLine2")} />
        </Field>

        <div className="checkout-field-grid checkout-field-grid--3">
          <Field label="City" error={errors.city?.message}>
            <input className="checkout-input" autoComplete="address-level2" {...register("city")} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <input
              className="checkout-input"
              autoComplete="address-level1"
              maxLength={2}
              placeholder="CA"
              {...register("state")}
            />
          </Field>
          <Field label="ZIP" error={errors.zip?.message}>
            <input className="checkout-input" autoComplete="postal-code" {...register("zip")} />
          </Field>
        </div>

        <Field label="Phone" error={errors.phone?.message}>
          <input className="checkout-input" autoComplete="tel" type="tel" {...register("phone")} />
        </Field>
      </section>

      <section className="checkout-card">
        <div className="checkout-card-head">
          <div className="checkout-card-title-wrap">
            <span className="checkout-card-icon">
              <CardIcon />
            </span>
            <div>
              <h2 className="checkout-card-title">Payment</h2>
              <p className="checkout-card-sub">All transactions are securely encrypted</p>
            </div>
          </div>
        </div>

        <div className="checkout-pay-options">
          <label className="checkout-pay-option">
            <input type="radio" value="card" {...register("paymentMethod")} />
            <div>
              <span className="checkout-pay-option-label">Credit or debit card</span>
              <span className="checkout-pay-option-hint">Visa, Mastercard, Amex</span>
            </div>
          </label>
          <label className="checkout-pay-option">
            <input type="radio" value="hsa_fsa" {...register("paymentMethod")} />
            <div>
              <span className="checkout-pay-option-label">HSA / FSA</span>
              <span className="checkout-pay-option-hint">Eligible health savings</span>
            </div>
          </label>
        </div>

        {paymentMethod === "card" ? (
          <>
            <Field label="Card number" error={errors.cardNumber?.message}>
              <div className="checkout-input-wrap">
                <input
                  className="checkout-input"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  {...register("cardNumber")}
                />
                <span className="checkout-card-brands" aria-hidden="true">
                  <span className="checkout-card-brand checkout-card-brand--visa">VISA</span>
                  <span className="checkout-card-brand checkout-card-brand--mc">MC</span>
                  <span className="checkout-card-brand">AMEX</span>
                </span>
              </div>
            </Field>

            <div className="checkout-field-grid checkout-field-grid--2">
              <Field label="Expiry (MM/YY)" error={errors.cardExpiry?.message}>
                <input
                  className="checkout-input"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  {...register("cardExpiry")}
                />
              </Field>
              <Field label="CVC" error={errors.cardCvc?.message}>
                <input
                  className="checkout-input"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  placeholder="123"
                  {...register("cardCvc")}
                />
              </Field>
            </div>
          </>
        ) : (
          <p className="checkout-card-sub" style={{ margin: 0 }}>
            Use your HSA or FSA card details at checkout. Eligibility may vary by plan administrator.
          </p>
        )}
      </section>

      <section className="checkout-card">
        <div className="checkout-card-head">
          <div className="checkout-card-title-wrap">
            <span className="checkout-card-icon">
              <ClipboardIcon />
            </span>
            <div>
              <h2 className="checkout-card-title">What happens next</h2>
              <p className="checkout-card-sub">Your care timeline after checkout</p>
            </div>
          </div>
        </div>

        <div className="checkout-next-steps">
          <div className="checkout-next-step">
            <span className="checkout-next-step-num">1</span>
            <div className="checkout-next-step-copy">
              <strong>Physician review</strong>
              <span>A licensed provider reviews your assessment within 24–48 hours.</span>
            </div>
          </div>
          <div className="checkout-next-step">
            <span className="checkout-next-step-num">2</span>
            <div className="checkout-next-step-copy">
              <strong>Prescription approved</strong>
              <span>If clinically appropriate, your prescription is written and sent to pharmacy.</span>
            </div>
          </div>
          <div className="checkout-next-step">
            <span className="checkout-next-step-num">3</span>
            <div className="checkout-next-step-copy">
              <strong>Discreet delivery</strong>
              <span>Your treatment ships in plain packaging — typically within 2–5 business days.</span>
            </div>
          </div>
        </div>
      </section>

      <label className="checkout-terms">
        <input type="checkbox" {...register("termsAccepted")} />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>
      {errors.termsAccepted ? (
        <p className="checkout-error">{errors.termsAccepted.message}</p>
      ) : null}
      {submitError ? <p className="checkout-error">{submitError}</p> : null}

      <button type="submit" disabled={isSubmitting} className="checkout-submit">
        {isSubmitting ? "Processing..." : "Complete order"}
      </button>

      <p className="checkout-secure">
        <LockSmallIcon />
        Your information is securely encrypted
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="checkout-field">
      <span className="checkout-label">{label}</span>
      {children}
      {error ? <span className="checkout-error">{error}</span> : null}
    </label>
  );
}
