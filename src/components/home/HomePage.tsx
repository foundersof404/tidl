import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuizModal } from '@/providers/quiz-modal-provider';
import { lockPageScroll, unlockPageScroll } from '@/lib/age-gate';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useSiteHeaderState } from '@/hooks/useSiteHeaderState';
import './home.css';
import { CtaSection } from './cta/CtaSection';
import { ServicesSection } from './ServicesSection';
import { BrowseDirectorySection } from './BrowseDirectorySection';
import { StoriesSection } from './StoriesSection';
import { JourneySection } from './JourneySection';
import { AskTidlSection, type AskTidlSectionHandle } from './AskTidlSection';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE_IMAGES } from '@/lib/site-assets';
import { GLP1_PEN_SHOWCASE } from '@/components/pdp/data/pen-showcase-content';
import { HERO_COPY } from '@/lib/homepage-content';
import { useHomeSandbox } from '@/lib/prescribe-rx/use-home-sandbox';
import { isSandboxPlaceholderPrice } from '@/lib/prescribe-rx/use-live-catalog';
import { formatCurrency } from '@/lib/pricing';

interface FaqItem {
  id: number;
  cat: string;
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 2,
    cat: 'start',
    q: 'Do I need a prescription?',
    a: "Yes, and that's the point. Every TIDL treatment is prescription-only. You don't need to bring one, though. The quiz doubles as your medical intake, and if a licensed provider decides treatment is right for you, they write the prescription themselves.",
  },
  {
    id: 3,
    cat: 'start',
    q: 'Who reviews and prescribes my treatment?',
    a: "A licensed medical provider in your state reads your full intake before anything is prescribed. No algorithms making medical decisions, no rubber stamps. If a provider has questions, they'll reach out before moving forward.",
  },
  {
    id: 4,
    cat: 'start',
    q: "What if a treatment isn't right for me?",
    a: "Then it won't be prescribed. Providers only approve treatment when it's medically appropriate for you, and they'll tell you why if it isn't. Your health comes before a sale, every time.",
  },
  {
    id: 5,
    cat: 'treat',
    q: 'How does the TIDL Pen work?',
    a: "Your dose is set to your prescription, with a clear graduated scale so there's never any guesswork. No vials, no syringes, nothing to mix or assemble. Click, done, back to your day.",
  },
  {
    id: 6,
    cat: 'treat',
    q: 'Is shipping discreet?',
    a: "Completely. Your treatment arrives in plain, unbranded outer packaging with nothing on the box that says what's inside. What's between you and your doctor stays that way.",
  },
  {
    id: 7,
    cat: 'treat',
    q: 'How is my medication kept safe in transit?',
    a: "Temperature-sensitive treatments ship in insulated, cold-chain packaging designed to keep them within a safe range door to door. If anything ever arrives compromised, your care team makes it right.",
  },
  {
    id: 8,
    cat: 'care',
    q: 'Can I talk to my care team after I start?',
    a: "Anytime. Message your care team with questions about your treatment, side effects, or progress, and a real person answers. Ongoing care is part of the plan, not an upsell.",
  },
  {
    id: 9,
    cat: 'care',
    q: 'What happens when I need a refill?',
    a: "Refills are a tap, not a project. Your provider keeps your prescription current based on how your treatment is going, and your pharmacy ships the next round the same way as the first.",
  },
  {
    id: 10,
    cat: 'care',
    q: 'Can I pause or cancel?',
    a: "Yes. You're in control of your plan, and pausing or cancelling doesn't require a phone call or a negotiation. Talk to your provider first if you're mid-treatment, since some medications shouldn't stop abruptly.",
  },
];

function FaqIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export default function HomePage() {
  const { openModal } = useQuizModal();
  const openQuiz = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      openModal();
    },
    [openModal],
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pinned: headerPinned, theme: headerTheme, transparent: headerTransparent } =
    useSiteHeaderState({ defaultTheme: 'dark' });

  const homeNavLinks = [
    { href: '#services', label: 'Treatments' },
    { href: '#tdlp5', label: 'The Pen' },
    { href: '#browse', label: 'Categories' },
    { href: '#journey', label: 'About' },
    { href: '#stories', label: 'Reviews' },
    { href: '#askTidl', label: 'Ask TIDL' },
    { href: '#faq', label: 'FAQ' },
    { to: '/products/glp-1-weight-loss', label: 'GLP-1 Program' },
  ];

  const { featured: homeFeatured } = useHomeSandbox();
  const liveGlpPrice = homeFeatured.find((p) => p.slug === 'glp-1-weight-loss')?.live.price;
  const heroSubhead =
    liveGlpPrice != null && !isSandboxPlaceholderPrice(liveGlpPrice)
      ? HERO_COPY.subhead.replace(
          /Plans start at [^.]+\./,
          `Plans start at ${formatCurrency(liveGlpPrice)}/mo (sandbox catalog).`,
        )
      : HERO_COPY.subhead;

  useEffect(() => {
    if (!mobileNavOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [mobileNavOpen]);

  const [penVisible, setPenVisible] = useState(false);
  const [isPenVideoOpen, setIsPenVideoOpen] = useState(false);

  // Initialize Webflow animations
  useEffect(() => {
    // Declare Webflow type
    interface WebflowWindow extends Window {
      Webflow?: {
        destroy: () => void;
        ready: () => void;
        require: (module: string) => any;
      };
    }

    const win = window as WebflowWindow;
    let initialized = false;
    
    // Reinitialize Webflow after hydration has fully settled.
    const initWebflow = () => {
      if (win.Webflow && !initialized) {
        try {
          win.Webflow.destroy();
          win.Webflow.ready();
          win.Webflow.require('ix2').init();
          console.log('Webflow reinitialized successfully');
          initialized = true;
        } catch (error) {
          console.error('Webflow initialization error:', error);
        }
      } else if (!win.Webflow) {
        console.warn('Webflow not loaded yet...');
      }
    };

    // Delay init to avoid mutating DOM during React hydration.
    const scheduleInit = () => setTimeout(initWebflow, 1200);
    const fallbackTimer = setTimeout(initWebflow, 3000);
    if (document.readyState === 'complete') scheduleInit();
    else window.addEventListener('load', scheduleInit, { once: true });

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', scheduleInit);
    };
  }, []);

  const [faqTab, setFaqTab] = useState('all');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const penGridRef = useRef<HTMLDivElement>(null);
  const penStageRef = useRef<HTMLDivElement>(null);
  const penFloatRef = useRef<HTMLDivElement>(null);
  const askTidlRef = useRef<AskTidlSectionHandle>(null);

  // TIDL Pen IntersectionObserver
  useEffect(() => {
    const gridEl = penGridRef.current;
    if (!gridEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setPenVisible(true);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    io.observe(gridEl);
    return () => io.disconnect();
  }, []);

  // Parallax scroll for pen float
  useEffect(() => {
    const float = penFloatRef.current;
    const stage = penStageRef.current;
    if (!float || !stage) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
        float.style.transform = `translateY(${p * -18}px)`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isPenVideoOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPenVideoOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPenVideoOpen]);

  const openAskTidl = useCallback(() => {
    setMobileNavOpen(false);
    const target = document.getElementById('askTidl');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => askTidlRef.current?.focusInput(), 420);
  }, []);

  const handleFaqToggle = (id: number) => {
    setFaqOpen((prev) => (prev === id ? null : id));
  };

  const handleFaqTab = (cat: string) => {
    setFaqTab(cat);
    setFaqOpen(null);
  };

  const visibleFaq = faqTab === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.cat === faqTab);

  return (
    <div className="body">
      <div className="site-chrome-stage">
      <div className="tdl-bar" id="tdlBar" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
        <div className="tdl-bar-inner">
          <span className="tdl-msg">TIDL is now a telehealth platform. Care that delivers results.</span>
          <a className="tdl-link" href="#journey">
            Learn more
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="main-wrapper">
            <div className="hero-wrapper-01" data-site-header-theme="dark">
              <SiteHeader
                navLinks={homeNavLinks}
                menuOpen={mobileNavOpen}
                pinned={headerPinned}
                transparent={headerTransparent}
                theme={headerTheme}
                onToggleMenu={() => setMobileNavOpen((open) => !open)}
                onCloseMenu={() => setMobileNavOpen(false)}
                onSearchClick={openAskTidl}
              />

          {/* ===== Hero Section ===== */}
          <section className="hero-01 container-full">
            <div className="container-fluid for-hero01">
              <div className="hero-content-01">
                <div className="hero-content-inside-01">
                  <h1 
                    data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f21140"
                    className="hero-title-01 display"
                    style={{ 
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      position: 'relative',
                      zIndex: 10
                    }}
                    suppressHydrationWarning
                  >
                    {HERO_COPY.headline}
                  </h1>
                  <div className="hero-inside-textsinside">
                    <div 
                      data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f21143"
                      className="service-hero-body-text p2-regular"
                      style={{ 
                        display: 'block',
                        visibility: 'visible',
                        opacity: 1,
                        position: 'relative',
                        zIndex: 10
                      }}
                      suppressHydrationWarning
                    >
                      {heroSubhead}
                    </div>
                    <div 
                      data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f21145"
                      className="service-hero-btns-01"
                      style={{ 
                        display: 'block',
                        visibility: 'visible',
                        opacity: 1,
                        position: 'relative',
                        zIndex: 10
                      }}
                      suppressHydrationWarning
                    >
                      <a href="#" onClick={openQuiz} className="button-01 button-03 w-inline-block">
                        <div className="button-outside-01">
                          <div className="button-inside">
                            <div className="button-text-01">{HERO_COPY.cta}</div>
                            <div className="button-text-01">{HERO_COPY.cta}</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <img
            className="service-v1-bg"
            data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f21148"
            src={SITE_IMAGES.hero.main}
            alt="service bg"
            sizes="(max-width: 3024px) 100vw, 3024px"
            loading="lazy"
            srcSet={SITE_IMAGES.hero.srcSet}
          />
          <img
            src={SITE_IMAGES.hero.overlay}
            loading="lazy"
            sizes="(max-width: 1439px) 100vw, 1440px"
            srcSet={SITE_IMAGES.hero.overlaySrcSet}
            alt=""
            className="service-v1-overlay"
          />
        </div>
                    </div>
                  </div>
                </div>

      <div className="page-wrapper">
        <div className="main-wrapper">

        <ServicesSection />

        {/* Pen hero — Overview: pen is the differentiator, right after goal selection */}
        {/* ===== TIDL Pen Section ===== */}
        <section className="tdlp5-sec" id="tdlp5" data-site-header-theme="dark">
          <div className="tdlp5-head">
            <div className="tdlp5-kick">The TIDL Pen</div>
            <h2 className="tdlp5-h2">GLP-1, pre-dosed.<br /><em>Just click.</em></h2>
          </div>

          <div className={`tdlp5-grid${penVisible ? ' tdlp5-on' : ''}`} id="tdlp5Grid" ref={penGridRef}>
            <div className="tdlp5-col left">
              <div className="tdlp5-feat">
                <div className="tdlp5-fnum">01</div>
                <div className="tdlp5-flab">Precision dose slider</div>
                <div className="tdlp5-fsub">Your dose, set to your prescription. Nothing to calculate.</div>
              </div>
              <div className="tdlp5-feat">
                <div className="tdlp5-fnum">02</div>
                <div className="tdlp5-flab">Graduated dose scale</div>
                <div className="tdlp5-fsub">Clear markings from 0.1 to 1.0{'\u2006'}ml. Zero guesswork.</div>
              </div>
            </div>

            <div className="tdlp5-center" id="tdlp5Stage" ref={penStageRef}>
              <div className="tdlp5-more tdlp5-more--stage">
                <Link to="/products/glp-1-weight-loss" className="tdlp5-more-wrap tdlp5-more-wrap--btn">
                  <span className="tdlp5-more-link">More info</span>
                  <span className="tdlp5-more-line" aria-hidden="true" />
                </Link>
              </div>
              <div className="tdlp5-blade"></div>
              <div className="tdlp5-blade core"></div>
              <div className="tdlp5-aura"></div>
              <div className="tdlp5-shadow"></div>
              <div className="tdlp5-imgwrap" id="tdlp5Float" ref={penFloatRef}>
                <div className="tdlp5-levit">
                  <img
                    className="tdlp5-img"
                    src={SITE_IMAGES.pen}
                    alt="The TIDL Pen"
                  />
                  {GLP1_PEN_SHOWCASE.videoEmbedUrl ? (
                  <button
                    type="button"
                    className="tdlp5-play"
                    aria-label="Play how to use the pen video"
                    onClick={() => setIsPenVideoOpen(true)}
                  >
                    <span className="tdlp5-play-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.5 6.8a1 1 0 0 1 1.5-.86l8.2 5.2a1 1 0 0 1 0 1.72l-8.2 5.2A1 1 0 0 1 8.5 17.2V6.8Z" />
                      </svg>
                    </span>
                    <span className="tdlp5-play-label">See how to use the pen</span>
                  </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="tdlp5-col right">
              <div className="tdlp5-feat">
                <div className="tdlp5-fnum">03</div>
                <div className="tdlp5-flab">Sealed and dispensed to you</div>
                <div className="tdlp5-fsub">Labeled with your name at the pharmacy.</div>
              </div>
              <div className="tdlp5-feat">
                <div className="tdlp5-fnum">04</div>
                <div className="tdlp5-flab">Cold-chain shipped</div>
                <div className="tdlp5-fsub">Temperature-safe packaging to your door.</div>
              </div>
            </div>
          </div>

          <div className="tdlp5-cta">
            <a href="#" onClick={openQuiz} className="button-01 button-03 w-inline-block">
              <div className="button-outside-01">
                <div className="button-inside">
                  <div className="button-text-01">See If You Qualify</div>
                  <div className="button-text-01">See If You Qualify</div>
            </div>
            </div>
            </a>
          </div>

          <div className="tdlp5-grain"></div>
        </section>

        {isPenVideoOpen && GLP1_PEN_SHOWCASE.videoEmbedUrl ? (
          <div
            className="tdlp5-video-modal"
            role="dialog"
            aria-modal="true"
            aria-label={GLP1_PEN_SHOWCASE.videoTitle ?? 'How to use the TIDL Pen video'}
            onClick={() => setIsPenVideoOpen(false)}
          >
            <div className="tdlp5-video-dialog" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="tdlp5-video-close"
                aria-label="Close video"
                onClick={() => setIsPenVideoOpen(false)}
              >
                ×
              </button>
              <iframe
                src={GLP1_PEN_SHOWCASE.videoEmbedUrl}
                title={GLP1_PEN_SHOWCASE.videoTitle ?? 'How to use the TIDL Pen'}
                        loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                      />
                        </div>
                      </div>
        ) : null}

        <BrowseDirectorySection />

        <JourneySection onGetStarted={openQuiz} />

        <StoriesSection />

        <AskTidlSection ref={askTidlRef} />

        {/* ===== Families Section ===== */}
        <section className="families container-full" id="families" data-site-header-theme="dark">
          <div className="container-fluid">
            <div className="families-content">
              <div className="families-head">
                <h2 className="families-title heading-01">The strongest version of you is a quiz away.</h2>
                <p className="paragraph-2">Doctor-prescribed GLP-1, TRT, and peptide care. One five-minute quiz — no waiting rooms, no guesswork.</p>
                <div className="families-btns">
                  <a href="#" onClick={openQuiz} className="button-01 button-03 w-inline-block">
                    <div className="button-outside-01">
                      <div className="button-inside">
                        <div className="button-text-01">Start My Quiz</div>
                        <div className="button-text-01">Start My Quiz</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="families-cards">
                <div className="families-card">
                  <div className="families-card-head">
                    <div className="families-card-title heading-02 _01">The pen that changed the game</div>
                    <div className="families-card-text p1-regular _01">Pre-dosed and ready to use. No mixing, no measuring, no guesswork. Just click and go.</div>
                  </div>
                  <div className="families-card-btns">
                    <a href="#" onClick={openQuiz} className="button-01 button-03 w-inline-block">
                      <div className="button-outside-01">
                        <div className="button-inside">
                          <div className="button-text-01">Start My Quiz</div>
                          <div className="button-text-01">Start My Quiz</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <img
                    src={SITE_IMAGES.families.cardShadow}
                    loading="lazy"
                    sizes="(max-width: 522px) 100vw, 522px"
                    alt=""
                    className="families-card-img"
                  />
                </div>
                <div className="families-card-another">
                  <div className="families-card _02">
                    <div className="families-card-text-02 heading-03">Shipped from a US pharmacy. Plain packaging.</div>
                  </div>
                  <div className="families-card _03">
                    <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f6e0_barchirt.svg" loading="lazy" alt="" className="families-card-bar-03"/>
                    <div className="families-card-text-03 heading-05">Progress you can measure, week after week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="families-bg"
            src={SITE_IMAGES.families.bg}
            alt="families bg"
            sizes="(max-width: 1728px) 100vw, 1728px"
            loading="lazy"
          />
        </section>

        {/* ===== FAQ Section ===== */}
        <section className="tdlfaq-sec" id="faq" data-site-header-theme="light">
          <div className="tdlfaq-head">
            <h2 className="tdlfaq-h2">Frequently asked questions</h2>
          </div>

          <div className="tdlfaq-tabs" id="tdlfaqTabs">
            {[
              { cat: 'all', label: 'All' },
              { cat: 'start', label: 'Getting started' },
              { cat: 'treat', label: 'Treatment & delivery' },
              { cat: 'care', label: 'Ongoing care' },
            ].map(({ cat, label }) => (
              <button
                key={cat}
                className={`tdlfaq-tab${faqTab === cat ? ' on' : ''}`}
                onClick={() => handleFaqTab(cat)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="tdlfaq-list" id="tdlfaqList">
            {visibleFaq.map((item) => (
              <div
                key={item.id}
                className={`tdlfaq-item${faqOpen === item.id ? ' open' : ''}`}
              >
                <button
                  type="button"
                  className={`tdlfaq-q${faqOpen === item.id ? ' open' : ''}`}
                  id={`tdlfaq-q-${item.id}`}
                  aria-expanded={faqOpen === item.id}
                  aria-controls={`tdlfaq-a-${item.id}`}
                  onClick={() => handleFaqToggle(item.id)}
                >
                  <span className="tdlfaq-qt">{item.q}</span>
                  <span className="tdlfaq-ic"><FaqIcon /></span>
                </button>
                <div
                  className="tdlfaq-a"
                  id={`tdlfaq-a-${item.id}`}
                  role="region"
                  aria-labelledby={`tdlfaq-q-${item.id}`}
                >
                  <div className="tdlfaq-aw">
                    <p className="tdlfaq-at">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="tdlfaq-foot">
            Still have a question? <a href="#askTidl">Ask TIDL</a> or message our team.
          </p>
        </section>

        {/* ===== CTA Section ===== */}
        <div id="cta">
          <CtaSection onGetStarted={() => openQuiz()} />
        </div>

        </div>
      </div>

      <SiteFooter onGetStarted={openQuiz} />
    </div>
  );
}
