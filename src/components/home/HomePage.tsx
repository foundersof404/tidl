import { useState, useEffect, useRef, useCallback, type MouseEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuizModal } from '@/providers/quiz-modal-provider';
import { lockPageScroll, unlockPageScroll } from '@/lib/age-gate';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useSiteHeaderState } from '@/hooks/useSiteHeaderState';
import './home.css';
import { ServicesSection } from './ServicesSection';
import { StoriesSection } from './StoriesSection';
import { JourneySection } from './JourneySection';
import { AskTidlSection, type AskTidlSectionHandle } from './AskTidlSection';
import { CareMosaicSection } from './CareMosaicSection';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE_IMAGES } from '@/lib/site-assets';
import { HERO_COPY } from '@/lib/homepage-content';
import { useHomeSandbox } from '@/lib/prescribe-rx/use-home-sandbox';
import { formatCurrency } from '@/lib/pricing';
import './home-pulse.css';

const HOME_PULSE = [
  { src: "/feel/mornings.png" },
  { src: "/feel/confidence.png" },
  { src: "/feel/soft-landings.png" },
] as const;

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
    { href: '#feel', label: 'Feel' },
    { href: '#journey', label: 'About' },
    { href: '#stories', label: 'Reviews' },
    { href: '#askTidl', label: 'Ask TIDL' },
    { href: '#faq', label: 'FAQ' },
    { to: '/products/glp-1-weight-loss', label: 'GLP-1 Program' },
  ];


  const { featured: homeFeatured } = useHomeSandbox();
  const liveGlp = homeFeatured.find((p) => p.slug === 'glp-1-weight-loss');
  const heroSubhead =
    liveGlp?.live.fromSandbox && liveGlp.displayPrice > 0
      ? HERO_COPY.subhead.replace(
          /Plans start at [^.]+\./,
          `Plans start at ${formatCurrency(liveGlp.displayPrice)} (sandbox catalog).`,
        )
      : HERO_COPY.subhead;

  useEffect(() => {
    if (!mobileNavOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [mobileNavOpen]);

  const [pulseVisible, setPulseVisible] = useState(false);

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

  const pulseStageRef = useRef<HTMLDivElement>(null);
  const askTidlRef = useRef<AskTidlSectionHandle>(null);

  useEffect(() => {
    const stage = pulseStageRef.current;
    if (!stage) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setPulseVisible(true);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "40px 0px -5% 0px" },
    );

    io.observe(stage);

    const rect = stage.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 64) {
      reveal();
    }

    const fallback = window.setTimeout(reveal, 1800);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

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
        <div className="main-wrapper home-hero-stage">
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
            src="/hero_main%20section_landing.webp"
            alt="TIDL personalized health and wellness"
            loading="eager"
            fetchPriority="high"
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

        {/* Feel — testosterone-style tall pills, fully curvy section */}
        <section
          className={`home-pulse${pulseVisible ? " home-pulse--on" : ""}`}
          id="feel"
          data-site-header-theme="dark"
          aria-label="How care is supposed to feel"
        >
          <div className="home-pulse__copy">
            <p>This part is yours</p>
            <h2>
              You already know
              <br />
              what you want
              <br />
              back.
            </h2>
            <span>
              Not a new identity. The quieter version of you that shows up when the noise drops —
              and stays.
            </span>
          </div>

          <div className="home-pulse__stack" ref={pulseStageRef}>
            {HOME_PULSE.map((shot, index) => (
              <figure
                key={shot.src}
                className="home-pulse__picture"
                style={{ transitionDelay: pulseVisible ? `${0.06 + index * 0.1}s` : undefined }}
              >
                <img src={shot.src} alt="" loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </section>

        <JourneySection onGetStarted={openQuiz} />

        <StoriesSection />

        <AskTidlSection ref={askTidlRef} />

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

        <CareMosaicSection onStartAssessment={openQuiz} />

        </div>
      </div>

      <SiteFooter onGetStarted={openQuiz} />
    </div>
  );
}
