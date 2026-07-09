import type { OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import "./checkout.css";

const STATUS_ORDER: OrderStatus[] = [
  "physician_review",
  "prescription_approved",
  "pharmacy_preparing",
  "shipped",
  "delivered",
];

export function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <ol className="checkout-next-steps">
      {STATUS_ORDER.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const stateClass = active ? "is-active" : done ? "is-done" : "is-pending";
        return (
          <li key={s} className={`checkout-next-step ${stateClass}`}>
            <span className="checkout-next-step-num">
              {done ? "✓" : i + 1}
            </span>
            <div className="checkout-next-step-copy">
              <strong>{ORDER_STATUS_LABELS[s]}</strong>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
