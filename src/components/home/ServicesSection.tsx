import { Link } from "@tanstack/react-router";
import { ServicesClosing } from "./ServicesClosing";
import { SERVICES_INTRO } from "@/lib/services-content";
import { CATEGORIES, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";

function ArrowRight() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type GoalCard = {
  categorySlug: CategorySlug;
  label: string;
  image: string;
  summary: string;
  badge?: string;
  featured?: boolean;
};

function buildGoalCards(): GoalCard[] {
  return CATEGORY_SLUGS.map((slug) => {
    const category = CATEGORIES[slug];

    return {
      categorySlug: slug,
      label: category.navLabel,
      image: category.heroImage,
      summary: category.lead,
      featured: slug === "weight-loss",
      badge: slug === "weight-loss" ? "Most popular" : category.kicker,
    };
  });
}

export function ServicesSection() {
  const cards = buildGoalCards();
  const total = cards.length;

  return (
    <section className="services container-full" id="services" data-site-header-theme="dark">
      <div className="container-fluid">
        <div className="services-content">
          <header className="services-head">
            <p className="services-intro-kicker">{SERVICES_INTRO.kicker}</p>
            <h2 className="services-title-02 heading-01">Pick your goal.</h2>
            <p className="services-intro-lead">
              Six care pathways. Choose a category to explore treatments and start your assessment.
            </p>
          </header>

          <div
            className="service-list"
            style={{ ["--svc-total" as string]: String(total).padStart(2, "0") }}
          >
            {cards.map((card, index) => (
              <article
                key={card.categorySlug}
                className={`service-item${card.featured ? " is-featured" : ""}`}
                style={{ ["--svc-index" as string]: String(index + 1).padStart(2, "0") }}
              >
                <div className="services-item-thumb _02">
                  <img
                    src={card.image}
                    loading="lazy"
                    sizes="(max-width: 1728px) 100vw, 1728px"
                    alt=""
                    className="service-thumb-img"
                  />
                  <div className="service-item-thumb-text">{card.label}</div>
                </div>

                <div className="service-item-body">
                  {card.badge ? <span className="service-item-badge">{card.badge}</span> : null}
                  <p className="service-item-text p2-regular">{card.summary}</p>

                  <div className="service-item-btns">
                    <Link
                      to="/category/$slug"
                      params={{ slug: card.categorySlug }}
                      className="button-03 w-inline-block"
                    >
                      <div className="button-outside-wrap">
                        <div className="btn-text-outside-03">
                          <div className="btn-text-inside-03">
                            <div className="button-text-03">Explore {card.label}</div>
                            <div className="button-text-03">Explore {card.label}</div>
                          </div>
                        </div>
                        <div className="btn-icon-outside-03">
                          <div className="btn-icon-inside-03">
                            <div className="btn-icon-03 w-embed">
                              <ArrowRight />
                            </div>
                            <div className="btn-icon-03 w-embed">
                              <ArrowRight />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="button-line-02"></div>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ServicesClosing />
        </div>
      </div>
    </section>
  );
}
