import { useState } from "react";
import type { CategoryDefinition } from "@/lib/categories";

type CategoryFaqSectionProps = {
  category: CategoryDefinition;
  items: readonly { id: number; q: string; a: string }[];
  onStartIntake: () => void;
};

function FaqIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CategoryFaqSection({ category, items, onStartIntake }: CategoryFaqSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="tdlfaq-sec cat-faqx" id="cat-faq" data-site-header-theme="light">
      <div className="tdlfaq-head">
        <p className="tdlfaq-kick">Before you start</p>
        <h2 className="tdlfaq-h2">Frequently asked questions</h2>
      </div>

      <div className="tdlfaq-list">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} className={`tdlfaq-item${open ? " open" : ""}`}>
              <button
                type="button"
                className={`tdlfaq-q${open ? " open" : ""}`}
                id={`cat-faq-q-${item.id}`}
                aria-expanded={open}
                aria-controls={`cat-faq-a-${item.id}`}
                onClick={() => toggle(item.id)}
              >
                <span className="tdlfaq-qt">{item.q}</span>
                <span className="tdlfaq-ic">
                  <FaqIcon />
                </span>
              </button>
              <div
                className="tdlfaq-a"
                id={`cat-faq-a-${item.id}`}
                role="region"
                aria-labelledby={`cat-faq-q-${item.id}`}
              >
                <div className="tdlfaq-aw">
                  <p className="tdlfaq-at">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="tdlfaq-foot">
        Still deciding on {category.navLabel.toLowerCase()} care?{" "}
        <button type="button" className="cat-faqx-link" onClick={onStartIntake}>
          Start the intake
        </button>
      </p>
    </section>
  );
}
