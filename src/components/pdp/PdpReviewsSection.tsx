import { REVIEWS, REVIEW_STATS } from "./data/glp1-pdp-data";
import { PatientAvatar, TestimonialContextPhoto } from "@/components/brand/PatientAvatar";
import { Reveal } from "./pdp-ui";

export function PdpReviewsSection() {
  const featured = REVIEWS.find((r) => r.featured) ?? REVIEWS[0];
  const others = REVIEWS.filter((r) => !r.featured);

  return (
    <section className="pdp-section pdp-section--reviews" id="reviews">
      <div className="pdp-section-shell pdp-section-shell--dark">
        <div className="pdp-section-inner">
          <Reveal>
            <span className="pdp-kicker pdp-kicker--light">Patient stories</span>
            <h2 className="pdp-section-title pdp-section-title--light">Real results from real patients</h2>
            <p className="pdp-section-lead pdp-section-lead--light">
              Discreet care that still feels human — from intake through delivery and beyond.
            </p>
          </Reveal>

          <div className="pdp-review-stats">
            {REVIEW_STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.06}>
                <div className="pdp-review-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="pdp-reviews-layout">
            <Reveal className="pdp-review-featured-wrap">
              <article className="pdp-review-featured">
                <div className="pdp-review-featured-photo">
                  <TestimonialContextPhoto
                    src={featured.contextImage}
                    alt={`${featured.condition} care context`}
                  />
                  <div className="pdp-review-featured-badge">{featured.result}</div>
                </div>
                <div className="pdp-review-featured-body">
                  <div className="pdp-review-stars" aria-label="Rated 5 out of 5">
                    ★★★★★
                  </div>
                  <blockquote>{featured.quote}</blockquote>
                  <footer>
                    <strong>{featured.name}</strong>
                    <span>{featured.condition} · Verified Patient</span>
                  </footer>
                </div>
              </article>
            </Reveal>

            <div className="pdp-reviews-stack">
              {others.map((story, index) => (
                <Reveal key={story.name} delay={0.08 + index * 0.08}>
                  <article className="pdp-review-card">
                    <div className="pdp-review-card-photo">
                      <PatientAvatar name={story.name} size="card" />
                    </div>
                    <div className="pdp-review-card-body">
                      <div className="pdp-review-stars" aria-label="Rated 5 out of 5">
                        ★★★★★
                      </div>
                      <p>{story.quote}</p>
                      <footer>
                        <strong>{story.name}</strong>
                        <span>
                          {story.condition} · {story.result}
                        </span>
                      </footer>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <p className="pdp-reviews-disclaimer pdp-reviews-disclaimer--light">
            Individual results vary. Reviews reflect personal experience.
          </p>
        </div>
      </div>
    </section>
  );
}
