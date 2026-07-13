import { usePdpData } from "./PdpDataProvider";
import { Reveal } from "./pdp-ui";

function isOutcomeMetric(result: string) {
  return !/verified/i.test(result);
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="pdp-rv2-check-icon">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.35" />
      <path
        d="M5 8.5l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRow() {
  return (
    <div className="pdp-rv2-stars" aria-label="Rated 5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M7 1.5l1.53 3.1 3.42.5-2.47 2.4.58 3.4L7 9.1 4.94 10.9l.58-3.4-2.47-2.4 3.42-.5L7 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export function PdpReviewsSection() {
  const { reviews, reviewStats } = usePdpData();
  const featured = reviews.find((r) => r.featured) ?? reviews[0];
  const others = reviews.filter((r) => !r.featured);

  return (
    <section className="pdp-section pdp-section--reviews" id="reviews" data-pdp-header-theme="dark">
      <div className="pdp-section-shell pdp-section-shell--dark">
        <div className="pdp-section-inner">
          <Reveal>
            <span className="pdp-kicker pdp-kicker--light">Patient stories</span>
            <h2 className="pdp-section-title pdp-section-title--light">
              Real results from real patients
            </h2>
            <p className="pdp-section-lead pdp-section-lead--light">
              Discreet care that still feels human — from intake through delivery and beyond.
            </p>
          </Reveal>

          <div className="pdp-rv2-stats">
            {reviewStats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.06}>
                <div className="pdp-rv2-stat">
                  <strong className="pdp-rv2-stat-val">{stat.value}</strong>
                  <span className="pdp-rv2-stat-label">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="pdp-rv2-featured-wrap">
            <article className="pdp-rv2-featured">
              <div className="pdp-rv2-featured-media">
                <div className="pdp-rv2-profile">
                  <img
                    src={featured.portraitImage}
                    alt=""
                    className="pdp-rv2-profile-img"
                    loading="lazy"
                  />
                </div>
                <div className="pdp-rv2-featured-badge">{featured.result}</div>
              </div>
              <div className="pdp-rv2-featured-body">
                <StarRow />
                <blockquote className="pdp-rv2-featured-quote">{featured.quote}</blockquote>
                <footer className="pdp-rv2-featured-footer">
                  <div className="pdp-rv2-featured-author">
                    <strong>{featured.name}</strong>
                    <span>
                      {featured.condition} · Verified Patient
                    </span>
                  </div>
                  <div className="pdp-rv2-verified">
                    <VerifiedIcon />
                    Verified patient
                  </div>
                </footer>
              </div>
            </article>
          </Reveal>

          <div className="pdp-rv2-grid">
            {others.map((story, index) => (
              <Reveal key={story.name} delay={0.08 + index * 0.08} className="pdp-rv2-card-reveal">
                <article className="pdp-rv2-card">
                  <div className="pdp-rv2-card-top">
                    <div className="pdp-rv2-card-identity">
                      <div className="pdp-rv2-profile pdp-rv2-profile--sm">
                        <img
                          src={story.portraitImage}
                          alt=""
                          className="pdp-rv2-profile-img"
                          loading="lazy"
                        />
                      </div>
                      <StarRow />
                    </div>
                    {isOutcomeMetric(story.result) ? (
                      <span className="pdp-rv2-outcome-badge">{story.result}</span>
                    ) : (
                      <span className="pdp-rv2-cond-badge">{story.condition}</span>
                    )}
                  </div>
                  <p className="pdp-rv2-card-quote">{story.quote}</p>
                  <footer className="pdp-rv2-card-footer">
                    <div className="pdp-rv2-verified">
                      <VerifiedIcon />
                      {story.name}
                    </div>
                    <span className="pdp-rv2-card-cond">{story.condition}</span>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="pdp-reviews-disclaimer pdp-reviews-disclaimer--light">
            Individual results vary. Reviews reflect personal experience.
          </p>
        </div>
      </div>
    </section>
  );
}
