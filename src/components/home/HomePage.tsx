import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './home.css';

const ANSWERS: Record<string, string> = {
  "What is the TIDL Pen?":
    "The TIDL Pen is our pre-dosed GLP-1 treatment. The dose is already measured, so there's no mixing and no guesswork. Just click and go. It's prescribed by a licensed provider and shipped from a licensed US pharmacy.",
  "Am I a fit for GLP-1?":
    "That's exactly what the quiz is for. It takes about five minutes and doubles as your medical intake. A licensed provider reviews your answers and prescribes only if it's right for you.",
  "How does TRT work?":
    "TRT restores testosterone to a healthy range under a doctor's care, which can support energy, strength, drive, and focus. Your provider personalizes the dose and monitors your progress.",
  "What are peptides?":
    "Peptides are short chains of amino acids your body already uses as signals. Peptide therapy uses specific ones, prescribed by a provider, to support goals like recovery, longevity, and metabolic health.",
};

const ASK_FALLBACK =
  "In the full experience, TIDL AI answers from our clinical knowledge base, and anything medical goes to your licensed provider. Take the quiz to get started.";

const PLACEHOLDER_QS = [
  "What is the TIDL Pen?",
  "Am I a fit for GLP-1?",
  "How fast is delivery?",
  "What are peptides?",
  "Can I use HSA or FSA?",
];

interface FaqItem {
  id: number;
  cat: string;
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    cat: 'start',
    q: 'Is TIDL legitimate and safe?',
    a: "Yes. TIDL is a telehealth platform that connects you with licensed medical providers. Every treatment is prescribed by a doctor licensed in your state and filled by a licensed US pharmacy. You're never buying medication off a shelf. You're getting care built around your health.",
  },
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

const TICKER_ITEMS = [
  { t: "Weight loss" },
  { t: "Testosterone" },
  { t: "Longevity" },
  { t: "Peptide therapy" },
  { t: "NAD+ therapy" },
  { t: "Recovery" },
];

const STORIES = [
  {
    img: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49bb8eb221c183c37eeabe_ChatGPT%20Image%20Jul%205%2C%202026%2C%2005_02_33%20AM.png",
    imgClass: "stories-item-thumb-img",
    quote: "I'd been putting this off for years because I thought it would be complicated. It wasn't. The quiz took five minutes, a doctor reviewed everything, and my treatment showed up a few days later. Down 18 pounds and finally feeling like myself again.",
    name: "Sarah M.",
    role: "Verified Patient",
  },
  {
    img: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49bb8eb673463b10a94dc9_ChatGPT%20Image%20Jul%205%2C%202026%2C%2005_02_37%20AM.png",
    imgClass: "stories-item-thumb-img _02",
    quote: "What sold me was how discreet and simple it was. No waiting rooms, no awkward conversations. The care team actually answers when I message them, and reordering takes one tap. Genuinely the easiest health decision I've made.",
    name: "James R.",
    role: "Verified Patient",
  },
  {
    img: "https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49bb883052977cb14adc96_ChatGPT%20Image%20Jul%205%2C%202026%2C%2005_03_39%20AM.png",
    imgClass: "stories-item-thumb-img",
    quote: "I was skeptical about doing this online, but everything felt legitimate from the start. Real doctors, a real pharmacy, clear instructions with the pen. Three months in and the results speak for themselves.",
    name: "Daniel K.",
    role: "Verified Patient",
  },
];

function ArrowRight() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [penVisible, setPenVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ c0: 0, c1: 0, c2: 0, c3: 0 });

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

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const [askInput, setAskInput] = useState('');
  const [askFocused, setAskFocused] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [askTyping, setAskTyping] = useState(false);
  const [askDisplayed, setAskDisplayed] = useState('');
  const [askPlaceholder, setAskPlaceholder] = useState('');

  const [faqTab, setFaqTab] = useState('all');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const penGridRef = useRef<HTMLDivElement>(null);
  const penStatsRef = useRef<HTMLDivElement>(null);
  const penStageRef = useRef<HTMLDivElement>(null);
  const penFloatRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const tickerTrackRef = useRef<HTMLDivElement>(null);
  const ansTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ansTyperRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Placeholder typewriter for Ask TIDL
  useEffect(() => {
    let qi = 0, ci = 0, del = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function type() {
      const q = PLACEHOLDER_QS[qi];
      setAskPlaceholder(q.slice(0, ci));
      if (!del) {
        ci++;
        if (ci > q.length) {
          del = true;
          timeoutId = setTimeout(type, 1700);
          return;
        }
      } else {
        ci--;
        if (ci === 0) {
          del = false;
          qi = (qi + 1) % PLACEHOLDER_QS.length;
        }
      }
      timeoutId = setTimeout(type, del ? 24 : 44);
    }

    timeoutId = setTimeout(type, 44);
    return () => clearTimeout(timeoutId);
  }, []);

  // TIDL Pen IntersectionObserver
  useEffect(() => {
    const gridEl = penGridRef.current;
    const statsEl = penStatsRef.current;
    if (!gridEl || !statsEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === gridEl) setPenVisible(true);
          if (entry.target === statsEl) setStatsVisible(true);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    io.observe(gridEl);
    io.observe(statsEl);
    return () => io.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (!statsVisible) return;
    const targets = [100, 0, 5, 1];
    const dur = 1100;
    const t0 = performance.now();
    let rafId: number;

    function step(now: number) {
      const k = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - k, 3);
      setCounters({
        c0: Math.round(targets[0] * ease),
        c1: 0,
        c2: Math.round(targets[2] * ease),
        c3: Math.round(targets[3] * ease),
      });
      if (k < 1) rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [statsVisible]);

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

  // Ticker animation
  useEffect(() => {
    const el = tickerRef.current;
    const track = tickerTrackRef.current;
    if (!el || !track) return;

    const cardH = 64 + 14;
    const unit = TICKER_ITEMS.length * cardH;
    let y = -unit;
    const speed = 0.35;
    let center: HTMLElement | null = null;
    let rafId: number;

    function frame() {
      y -= speed;
      if (y <= -unit * 2) y += unit;
      track.style.transform = `translateY(${y}px)`;

      const mid = el.clientHeight / 2;
      let best = Infinity;
      let bi: HTMLElement | null = null;

      const items = Array.from(track.children) as HTMLElement[];
      for (const item of items) {
        const r = item.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        const c = r.top - er.top + r.height / 2;
        const dist = Math.abs(c - mid);
        if (dist < best) { best = dist; bi = item; }
      }

      if (bi !== center) {
        if (center) center.classList.remove('active');
        center = bi;
        if (center) center.classList.add('active');
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Cleanup ask timers on unmount
  useEffect(() => {
    return () => {
      if (ansTimerRef.current) clearTimeout(ansTimerRef.current);
      if (ansTyperRef.current) clearInterval(ansTyperRef.current);
    };
  }, []);

  const handleAsk = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setAskOpen(true);
    setAskTyping(true);
    setAskDisplayed('');

    if (ansTimerRef.current) clearTimeout(ansTimerRef.current);
    if (ansTyperRef.current) clearInterval(ansTyperRef.current);

    ansTimerRef.current = setTimeout(() => {
      setAskTyping(false);
      const full = ANSWERS[trimmed] || ASK_FALLBACK;
      let i = 0;
      ansTyperRef.current = setInterval(() => {
        i++;
        setAskDisplayed(full.slice(0, i));
        if (i >= full.length && ansTyperRef.current) clearInterval(ansTyperRef.current);
      }, 12);
    }, 900);
  }, []);

  const handleFaqToggle = (id: number) => {
    setFaqOpen((prev) => (prev === id ? null : id));
  };

  const handleFaqTab = (cat: string) => {
    setFaqTab(cat);
    setFaqOpen(null);
  };

  const prevSlide = () => setCurrentSlide((s) => (s - 1 + STORIES.length) % STORIES.length);
  const nextSlide = () => setCurrentSlide((s) => (s + 1) % STORIES.length);

  const visibleFaq = faqTab === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.cat === faqTab);

  // Tripled ticker items for seamless loop
  const tickerLoop = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  const tickerIcons: Record<string, React.ReactNode> = {
    "Weight loss": (
      <svg viewBox="0 0 24 24">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>
      </svg>
    ),
    "Testosterone": (
      <svg viewBox="0 0 24 24">
        <path d="M13 3l-6 8h5l-2 10 8-11h-5l2-7z"/>
      </svg>
    ),
    "Longevity": (
      <svg viewBox="0 0 24 24">
        <path d="M12 21c5-3 8-7 8-11a4 4 0 0 0-8-1 4 4 0 0 0-8 1c0 4 3 8 8 11z"/>
      </svg>
    ),
    "Peptide therapy": (
      <svg viewBox="0 0 24 24">
        <circle cx="7" cy="8" r="2.5"/>
        <circle cx="17" cy="8" r="2.5"/>
        <circle cx="12" cy="16" r="2.5"/>
        <path d="M9 9l2 5M15 9l-2 5"/>
      </svg>
    ),
    "NAD+ therapy": (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    ),
    "Recovery": (
      <svg viewBox="0 0 24 24">
        <path d="M4 12a8 8 0 1 1 8 8"/>
        <path d="M12 8v4l3 2"/>
      </svg>
    ),
  };

  return (
    <div className="body">
      {/* ===== Announcement Bar ===== */}
      <div className="tdl-bar" id="tdlBar" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
        <div className="tdl-bar-inner">
          <span className="tdl-msg">TIDL is now a telehealth platform. Care that delivers results.</span>
          <a className="tdl-link" href="#">
            Learn more
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="hero-wrapper-01">
            {/* ===== Navbar ===== */}
            <div id="navbar" className="navbar-wrap">
              <div className="navbar">
                <div className="nabvar-info">
                  <a href="/" className="nav-logo _02 w-inline-block">
                    <img
                      sizes="(max-width: 512px) 100vw, 512px"
                      srcSet="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM-p-500.png 500w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM.png 512w"
                      alt="website logo"
                      src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM.png"
                      loading="lazy"
                      className="nav-logo-img"
                    />
                  </a>
                  <div className="navbar-info-left">
                    <div className="nav-dropdown _01 w-dropdown">
                      <div className="navitem-toggle w-dropdown-toggle">
                        <a href="#" className="nav-items-wrap light w-inline-block">
                          <div className="nav-item">Treatments</div>
                        </a>
                      </div>
                    </div>
                    <div className="nav-dropdown _02 w-dropdown">
                      <div className="navitem-toggle w-dropdown-toggle">
                        <a href="#" className="nav-items-wrap light w-inline-block">
                          <div className="nav-item">How it works</div>
                        </a>
                      </div>
                    </div>
                    <div className="nav-dropdown _03 w-dropdown">
                      <div className="navitem-toggle w-dropdown-toggle">
                        <a href="#" className="nav-items-wrap light w-inline-block">
                          <div className="nav-item">About</div>
                        </a>
                      </div>
                    </div>
                    <div className="nav-dropdown w-dropdown">
                      <div className="navitem-toggle w-dropdown-toggle">
                        <a href="#" className="nav-items-wrap light w-inline-block">
                          <div className="nav-item">Learn</div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="navbar-middle">
                  <a href="/" className="nav-logo w-inline-block">
                    <img
                      sizes="(max-width: 512px) 100vw, 512px"
                      srcSet="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM-p-500.png 500w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM.png 512w"
                      alt="website logo"
                      src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM.png"
                      loading="lazy"
                      className="nav-logo-img dark"
                    />
                  </a>
                </div>

                <div className="navbar-right">
                  <div className="navbar-right-btns">
                    <a href="#" className="button-03 light w-inline-block">
                      <div className="button-outside-wrap">
                        <div className="btn-text-outside-03">
                          <div className="btn-text-inside-03">
                            <div className="button-text-03">Get started</div>
                            <div className="button-text-03">Get started</div>
                          </div>
                        </div>
                        <div className="btn-icon-outside-03">
                          <div className="btn-icon-inside-03">
                            <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                            <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                          </div>
                        </div>
                      </div>
                      <div className="button-line-02 light"></div>
                    </a>
                  </div>
                  <div className="search-icon-wrap light">
                    <div className="search-ico w-embed">
                      <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.7469 15.7469L12.4844 12.4844" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  className="nav-toggle-btn-wrap"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Open menu"
                >
                  <div className="nav-toogle-btn menu light w-embed">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.5791 15.289C19.1022 15.2891 19.5263 15.6924 19.5264 16.1894C19.5264 16.6865 19.1022 17.0897 18.5791 17.0898H5.94727C5.4241 17.0898 5 16.6865 5 16.1894C5.00004 15.6924 5.42412 15.2891 5.94727 15.289H18.5791ZM18.5791 10.4892C19.1021 10.4893 19.5261 10.8918 19.5264 11.3886C19.5264 11.8857 19.1022 12.2889 18.5791 12.289H5.94727C5.4241 12.289 5 11.8857 5 11.3886C5.00027 10.8918 5.42426 10.4893 5.94727 10.4892H18.5791ZM18.5791 5.68844C19.1022 5.68852 19.5264 6.09178 19.5264 6.58883C19.5263 7.08583 19.1022 7.48914 18.5791 7.48922H5.94727C5.42412 7.48917 5.00005 7.08585 5 6.58883C5 6.09177 5.4241 5.68849 5.94727 5.68844H18.5791Z" fill="currentColor"/>
                    </svg>
                  </div>
                </button>

                {/* Mobile menu */}
                <div className={`menu-wrap _02${mobileNavOpen ? ' open' : ''}`}>
                  <div className="menu-inside-info">
                    <a href="#" className="nav-logo _03 w-inline-block">
                      <img loading="lazy" src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49b15533f1b764070d43f4_images.png" alt="website logo" className="nav-logo-img"/>
                    </a>
                    <button className="nav-toggle-btn-wrap" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                      <div className="nav-toogle-btn close w-embed">
                        <svg width="100%" height="100%" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.219 6.51595C16.589 6.14639 17.1741 6.13164 17.5256 6.48275C17.8771 6.83382 17.8623 7.41787 17.4924 7.78743L13.6624 11.6126L17.4924 15.4378C17.8624 15.8073 17.877 16.3914 17.5256 16.7425C17.1741 17.0936 16.589 17.0789 16.219 16.7093L12.3899 12.8841L8.56079 16.7093C8.19082 17.0789 7.60565 17.0936 7.25415 16.7425C6.90281 16.3914 6.91744 15.8073 7.28735 15.4378L11.1165 11.6126L7.28735 7.78743C6.91756 7.41788 6.90275 6.83381 7.25415 6.48275C7.60565 6.13164 8.19082 6.14639 8.56079 6.51595L12.3899 10.3402L16.219 6.51595Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="menu-title-wrap">
                    <div className="menu-title">Pages</div>
                  </div>
                  <div className="menu-top">
                    <div className="menu-body _01">
                      <div className="menu-body-item">
                        {[
                          { href: '/', label: 'Home v1' },
                          { href: '/home-02', label: 'Home v2' },
                          { href: '/home-03', label: 'Home v3' },
                          { href: '/about-01', label: 'About v1' },
                          { href: '/about-02', label: 'About v2' },
                          { href: '/about-03', label: 'About v3' },
                          { href: '/appointment', label: 'Appointment' },
                          { href: '/blogs', label: 'Blogs' },
                        ].map(({ href, label }) => (
                          <a key={label} href={href} className="dropdown-text-outside w-inline-block">
                            <div className="dropdown-inside-texts">
                              <div className="dropdown-inside-text">{label}</div>
                              <div className="dropdown-inside-text">{label}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="menu-body-item">
                        {[
                          { href: '/service-01', label: 'Service v1' },
                          { href: '/service-02', label: 'Service v2' },
                          { href: '/service-03', label: 'Service v3' },
                          { href: '/doctors', label: 'Doctors' },
                          { href: '/terms', label: 'Terms' },
                          { href: '/privacy', label: 'Privacy' },
                        ].map(({ href, label }) => (
                          <a key={label} href={href} className="dropdown-text-outside w-inline-block">
                            <div className="dropdown-inside-texts">
                              <div className="dropdown-inside-text">{label}</div>
                              <div className="dropdown-inside-text">{label}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="menu-body-item">
                        {[
                          { href: '/service-single', label: 'Service Details' },
                          { href: '/references/style-guide', label: 'Style Guide' },
                          { href: '/references/license', label: 'License' },
                          { href: '/references/changelog', label: 'Changelog' },
                        ].map(({ href, label }) => (
                          <a key={label} href={href} className="dropdown-text-outside w-inline-block">
                            <div className="dropdown-inside-texts">
                              <div className="dropdown-inside-text">{label}</div>
                              <div className="dropdown-inside-text">{label}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    Lose the weight. Keep it off. Feel like you again.
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
                      Doctor-prescribed GLP-1, TRT, and peptide treatments. Online in 5 minutes, delivered to your door.
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
                      <a href="#" className="button-01 button-03 w-inline-block">
                        <div className="button-outside-01">
                          <div className="button-inside">
                            <div className="button-text-01">Get started</div>
                            <div className="button-text-01">Take Quiz</div>
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
            src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a.png"
            alt="service bg"
            sizes="(max-width: 3024px) 100vw, 3024px"
            loading="lazy"
            srcSet="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-500.png 500w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-800.png 800w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-1080.png 1080w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a-p-1600.png 1600w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a44f83052977cb1646003_hf_20260705_114532_eed1607f-baf0-4f2d-9b83-39b75e08344a.png 3024w"
          />
          <img
            src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7ba_overlay%20(2).png"
            loading="lazy"
            sizes="(max-width: 1439px) 100vw, 1440px"
            srcSet="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7ba_overlay%2520(2)-p-500.png 500w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7ba_overlay%2520(2)-p-1080.png 1080w, https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7ba_overlay%20(2).png 1440w"
            alt=""
            className="service-v1-overlay"
          />
        </div>

        {/* ===== Services Section ===== */}
        <section className="services container-full">
          <div className="container-fluid">
            <div className="services-content">
              <h2 
                data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f2114c"
                className="services-title-02 heading-01"
              >
                Pick your goal.
              </h2>
              <div className="service-list">
                {/* Weight Loss */}
                <div 
                  data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f2114f"
                  className="service-item"
                >
                  <div className="services-item-thumb _02">
                    <img
                      src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a948975e49a6ca9c6b6e5_hf_20260705_172618_ea8e3be2-4637-4096-83cc-5ec995f07e09.png"
                      loading="lazy"
                      sizes="(max-width: 1728px) 100vw, 1728px"
                      alt="service ico"
                      className="service-thumb-img"
                    />
                    <div className="service-item-thumb-text">Weight loss</div>
                  </div>
                  <div className="service-item-body">
                    <div className="service-item-text p2-regular">GLP-1 treatment dosed for you by a doctor. No mixing, no guesswork, no yo-yo.</div>
                    <div className="service-item-btns">
                      <a href="#" className="button-03 w-inline-block">
                        <div className="button-outside-wrap">
                          <div className="btn-text-outside-03">
                            <div className="btn-text-inside-03">
                              <div className="button-text-03">Explore</div>
                              <div className="button-text-03">Explore</div>
                            </div>
                          </div>
                          <div className="btn-icon-outside-03">
                            <div className="btn-icon-inside-03">
                              <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                              <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                            </div>
                          </div>
                        </div>
                        <div className="button-line-02"></div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Testosterone */}
                <div 
                  data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f21164"
                  className="service-item"
                >
                  <div className="services-item-thumb _02">
                    <img
                      src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4a95a92a6dee9e17ed919e_hf_20260705_173015_06ec6b8c-b985-4bab-80b1-41afe144db92.png"
                      loading="lazy"
                      sizes="(max-width: 1728px) 100vw, 1728px"
                      alt="service img"
                      className="service-thumb-img"
                    />
                    <div className="service-item-thumb-text">Testosterone</div>
                  </div>
                  <div className="service-item-body">
                    <div className="service-item-text p2-regular">Energy, strength, drive, focus. TRT built around your labs and your life.</div>
                    <div className="service-item-btns">
                      <a href="#" className="button-03 w-inline-block">
                        <div className="button-outside-wrap">
                          <div className="btn-text-outside-03">
                            <div className="btn-text-inside-03">
                              <div className="button-text-03">Coming Soon</div>
                              <div className="button-text-03">Explore</div>
                            </div>
                          </div>
                          <div className="btn-icon-outside-03">
                            <div className="btn-icon-inside-03">
                              <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                              <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                            </div>
                          </div>
                        </div>
                        <div className="button-line-02"></div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Longevity */}
                <div 
                  id="w-node-_3072fecc-9b21-d07c-8a0f-122ed0f21179-9ec3f5ff"
                  data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f21179"
                  className="service-item"
                >
                  <div className="services-item-thumb _02">
                    <img
                      src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4bd7ba829cdf371074ee74_hf_20260706_160923_8f107d2e-39e5-41c3-8290-18fd580d714a.png"
                      loading="lazy"
                      sizes="(max-width: 1728px) 100vw, 1728px"
                      alt="service img"
                      className="service-thumb-img"
                    />
                    <div className="service-item-thumb-text">Longevity</div>
                  </div>
                  <div className="service-item-body">
                    <div className="service-item-text p2-regular">Peptide protocols to recover faster, sleep deeper, and stay sharp</div>
                    <div className="service-item-btns">
                      <a href="#" className="button-03 w-inline-block">
                        <div className="button-outside-wrap">
                          <div className="btn-text-outside-03">
                            <div className="btn-text-inside-03">
                              <div className="button-text-03">Coming Soon</div>
                              <div className="button-text-03">Explore</div>
                            </div>
                          </div>
                          <div className="btn-icon-outside-03">
                            <div className="btn-icon-inside-03">
                              <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                              <div className="btn-icon-03 w-embed"><ArrowRight /></div>
                            </div>
                          </div>
                        </div>
                        <div className="button-line-02"></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TIDL Pen Section ===== */}
        <section className="tdlp5-sec">
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
              <div className="tdlp5-blade"></div>
              <div className="tdlp5-blade core"></div>
              <div className="tdlp5-aura"></div>
              <div className="tdlp5-shadow"></div>
              <div className="tdlp5-imgwrap" id="tdlp5Float" ref={penFloatRef}>
                <div className="tdlp5-levit">
                  <img
                    className="tdlp5-img"
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4ae82cb673463b10de0cad_hf_20260705_223658_ef5718c4-2d19-4e28-9a03-7f8e1555a580%20(1).png"
                    alt="The TIDL Pen"
                  />
                </div>
              </div>
            </div>

            <div className="tdlp5-col right">
              <div className="tdlp5-feat">
                <div className="tdlp5-fnum">03</div>
                <div className="tdlp5-flab">Sealed and dispensed to you</div>
                <div className="tdlp5-fsub">Labeled with your name by a licensed US pharmacy.</div>
              </div>
              <div className="tdlp5-feat">
                <div className="tdlp5-fnum">04</div>
                <div className="tdlp5-flab">Cold-chain shipped</div>
                <div className="tdlp5-fsub">Temperature-safe, discreet packaging to your door.</div>
              </div>
            </div>
          </div>

          <div className={`tdlp5-stats${statsVisible ? ' tdlp5-on' : ''}`} id="tdlp5Stats" ref={penStatsRef}>
            <div className="tdlp5-stat">
              <div className="tdlp5-snum"><span>{counters.c0}</span><em>%</em></div>
              <div className="tdlp5-stag">Doctor reviewed</div>
              <div className="tdlp5-ssub">Every intake read and prescribed by a licensed provider.</div>
            </div>
            <div className="tdlp5-stat">
              <div className="tdlp5-snum"><span>{counters.c1}</span></div>
              <div className="tdlp5-stag">Vials or syringes</div>
              <div className="tdlp5-ssub">The pen replaces the kit. No mixing, nothing to assemble.</div>
            </div>
            <div className="tdlp5-stat">
              <div className="tdlp5-snum"><span>{counters.c2}</span><em>min</em></div>
              <div className="tdlp5-stag">Quiz to intake</div>
              <div className="tdlp5-ssub">One short quiz doubles as your full medical intake.</div>
            </div>
            <div className="tdlp5-stat">
              <div className="tdlp5-snum"><span>{counters.c3}</span><em>click</em></div>
              <div className="tdlp5-stag">That's the routine</div>
              <div className="tdlp5-ssub">Pre-dosed and ready. Click, done, back to your day.</div>
            </div>
          </div>

          <div className="tdlp5-grain"></div>
        </section>

        {/* ===== Journey Section ===== */}
        <section className="journey container-full">
          <div className="container-fluid">
            <div className="journey-content-fixed">
              <div className="journey-content">
                <div className="circle-img-outer">
                  <div className="circle-img-wrap">
                    <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f79b_Circle.svg" loading="lazy" alt="Circle" className="circle-img"/>
                  </div>
                </div>
                <div className="circle-info-outer">
                  <div className="circle-info-img-wrap">
                    <img
                      src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f79d_shaped.png"
                      loading="lazy"
                      sizes="(max-width: 3840px) 100vw, 3840px"
                      alt=""
                      className="circle-info-img"
                    />
                  </div>
                </div>
                <div className="journey-content-inside">
                  <h2 className="journey-title heading-01">The best care<br/>by the best in medicine</h2>
                  <div className="journey-text p2-regular">
                    Meet the team of leading specialists with decades of combined experience across key specialties.
                  </div>
                  <div className="journey-bnts">
                    <a href="#" className="button-01 button-03 w-inline-block">
                      <div className="button-outside-01">
                        <div className="button-inside">
                          <div className="button-text-01">Take the quiz.</div>
                          <div className="button-text-01">Take Quiz</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="journey-info-wrap">
                  {/* Treatments Ticker */}
                  <div className="tidl-ticker" id="tidlTicker" ref={tickerRef}>
                    <div className="track" ref={tickerTrackRef}>
                      {tickerLoop.map((item, idx) => (
                        <div className="item" key={idx}>
                          <span className="ico">
                            {tickerIcons[item.t]}
                          </span>
                          <span className="label">{item.t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="journey-infos hide">
                    <div className="journey-info-item _01">
                      <div className="journey-info-item-shadow"></div>
                      <div className="journey-info-text">Fertility</div>
                    </div>
                    <div className="journey-info-item _02">
                      <div className="journey-info-item-shadow"></div>
                      <div className="journey-info-text">Gynecology</div>
                    </div>
                    <div className="journey-info-item _03">
                      <div className="journey-info-item-shadow"></div>
                      <div className="journey-info-text">Gynecology</div>
                    </div>
                    <div className="journey-info-item _04">
                      <div className="journey-info-item-shadow"></div>
                      <div className="journey-info-text">Gynecology</div>
                    </div>
                    <div className="journey-info-item _05">
                      <div className="journey-info-item-shadow"></div>
                      <div className="journey-info-text">Gynecology</div>
                    </div>
                    <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7a0_Frame%201707480203.png" loading="lazy" alt="" className="journey-overlay"/>
                  </div>

                  {/* Decorative circle replaces Lottie */}
                  <div className="lottie-animation-2">
                    <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,154,46,0.3)" strokeWidth="1.5"/>
                      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,154,46,0.15)" strokeWidth="1"/>
                    </svg>
                  </div>

                  <div className="center-pointers">
                    <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7b9_Polygon%201.svg" loading="lazy" alt="" className="center-point"/>
                    <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7b8_Polygon%203.svg" loading="lazy" alt="" className="center-point"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Families Section ===== */}
        <section className="families container-full">
          <div className="container-fluid">
            <div className="families-content">
              <div className="families-head">
                <h2 className="families-title heading-01">The strongest version of you is a quiz away.</h2>
                <p className="paragraph-2">Doctor-prescribed GLP-1, TRT, and peptide care, delivered to your door. One five-minute quiz, reviewed by a licensed provider. No waiting rooms, no guesswork.</p>
                <div className="families-btns">
                  <a href="#" className="button-01 button-03 w-inline-block">
                    <div className="button-outside-01">
                      <div className="button-inside">
                        <div className="button-text-01">Get Started</div>
                        <div className="button-text-01">Take Quiz</div>
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
                    <a href="#" className="button-01 button-03 w-inline-block">
                      <div className="button-outside-01">
                        <div className="button-inside">
                          <div className="button-text-01">Learn about the Pen</div>
                          <div className="button-text-01">Take Quiz</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7bb_shadow%20(17).png"
                    loading="lazy"
                    sizes="(max-width: 522px) 100vw, 522px"
                    alt=""
                    className="families-card-img"
                  />
                </div>
                <div className="families-card-another">
                  <div className="families-card _02">
                    <div className="families-card-text-02 heading-03">From licensed pharmacies to your door</div>
                  </div>
                  <div className="families-card _03">
                    <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f6e0_barchirt.svg" loading="lazy" alt="" className="families-card-bar-03"/>
                    <div className="families-card-text-03 heading-05">Real change, tracked over time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="families-bg"
            src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4bdcc786041c1c67e4f84a_hf_20260706_164258_2d8f8b0b-75a0-491a-bc5b-ce98730f9f41.png"
            alt="families bg"
            sizes="(max-width: 1728px) 100vw, 1728px"
            loading="lazy"
          />
        </section>

        {/* ===== How TIDL Works Section ===== */}
        <section className="works container-full _02">
          <div className="container-fluid">
            <div className="works-content _02">
              <h2 className="works-title heading-01 _02">HOW TIDL WORKS</h2>
            </div>
            <div className="works-list">

              {/* Step 1 */}
              <div className="works-item _03-first">
                <div className="works-item-thumb-wrap">
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aa74cb673463b10d3ae0a_hf_20260705_182659_b144a633-d893-4de0-b45e-39e6df164b2f.png"
                    loading="lazy"
                    sizes="(max-width: 1728px) 100vw, 1728px"
                    alt="thumb"
                    className="works-thumb-img"
                  />
                  <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7bc_shadow%20(18).png" loading="lazy" alt="" className="work-thumb-shadow"/>
                  <div className="works-thumb-cards">
                    <div className="works-thubm-text">Choose your goal</div>
                    <div className="works-thumb-inside-wrap">
                      <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a48bfe570325ae14a877401_overlay_01a_weight_loss.png" loading="lazy" sizes="(max-width: 960px) 100vw, 960px" alt="" className="works-thumb-inside-img"/>
                      <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a48bfe570325ae14a8773fe_overlay_01c_longevity.png" loading="lazy" sizes="(max-width: 960px) 100vw, 960px" alt="" className="works-thumb-inside-img"/>
                      <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a48bfe4215abbb8f210f509_overlay_01b_testosterone.png" loading="lazy" sizes="(max-width: 960px) 100vw, 960px" alt="" className="works-thumb-inside-img"/>
                    </div>
                  </div>
                </div>
                <div className="works-item-info _02">
                  <div className="works-item-info-head">
                    <h3 className="works-item-info-title heading-03">01 | Take the quiz</h3>
                    <div className="works-itm-info-text-02 p2-regular">
                      Answer a few questions about your health and goals. It takes about five minutes, and it doubles as your medical intake, so there's nothing to fill out twice.
                    </div>
                  </div>
                  <div className="works-item-info-bottom">
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Your goals</div>
                      <div className="works-item-info-text c1-text">What you want to improve</div>
                    </div>
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Health history</div>
                      <div className="works-item-info-text c1-text">A few quick medical questions</div>
                    </div>
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Takes 5 minutes</div>
                      <div className="works-item-info-text c1-text">Done on your phone, anytime</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="works-item _03-first">
                <div className="works-item-thumb-wrap">
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aa74d68be0cc0c1e6ff78_hf_20260705_183156_8357ac89-69ac-4055-a74d-07ea368560c8.png"
                    loading="lazy"
                    sizes="(max-width: 1728px) 100vw, 1728px"
                    alt="thumb"
                    className="works-thumb-img"
                  />
                  <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7bc_shadow%20(18).png" loading="lazy" alt="" className="work-thumb-shadow"/>
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a48bfe5a3e4540bf4bee825_overlay_02_care_plan.png"
                    loading="lazy"
                    sizes="(max-width: 3312px) 100vw, 3312px"
                    alt=""
                    className="work-additional-img"
                  />
                </div>
                <div className="works-item-info _02">
                  <div className="works-item-info-head">
                    <h3 className="works-item-info-title heading-03">02 | From licensed pharmacies to your door</h3>
                    <div className="works-itm-info-text-02 p2-regular">
                      Prescribed by licensed providers, filled by US pharmacies, and shipped in discreet, temperature-safe packaging.
                    </div>
                  </div>
                  <div className="works-item-info-bottom">
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Licensed provider</div>
                      <div className="works-item-info-text c1-text">Reviewed by a doctor in your state</div>
                    </div>
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Personalized plan</div>
                      <div className="works-item-info-text c1-text">Treatment matched to you</div>
                    </div>
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">No appointments</div>
                      <div className="works-item-info-text c1-text">All online, no waiting rooms</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="works-item _03-first">
                <div className="works-item-thumb-wrap">
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aa92efc42f4d1ca52f73b_hf_20260705_185141_41c69960-1413-4b75-8318-f0800323717b.png"
                    loading="lazy"
                    sizes="(max-width: 1728px) 100vw, 1728px"
                    alt="thumb"
                    className="works-thumb-img"
                  />
                  <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f7bc_shadow%20(18).png" loading="lazy" alt="" className="work-thumb-shadow"/>
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a48bfe5843bc2ec3c3806fa_overlay_03_order.png"
                    loading="lazy"
                    sizes="(max-width: 3312px) 100vw, 3312px"
                    alt=""
                    className="work-additional-img"
                  />
                </div>
                <div className="works-item-info _02">
                  <div className="works-item-info-head">
                    <h3 className="works-item-info-title heading-03">03 | Real change, tracked over time</h3>
                    <div className="works-itm-info-text-02 p2-regular">
                      Consistent, doctor-guided treatment that supports steady, lasting results.
                    </div>
                  </div>
                  <div className="works-item-info-bottom">
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Discreet delivery</div>
                      <div className="works-item-info-text c1-text">Shipped from a licensed pharmacy</div>
                    </div>
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Ongoing support</div>
                      <div className="works-item-info-text c1-text">Message your care team anytime</div>
                    </div>
                    <div className="works-item-info-card _02">
                      <div className="works-item-info-num _02">Easy reorders</div>
                      <div className="works-item-info-text c1-text">Refills in a tap</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== Ask TIDL Section ===== */}
        <div className="ask-tidl" id="askTidl">
          <h2 className="ask-h">Ask TIDL anything</h2>
          <p className="ask-sub">
            Instant answers about treatments, from our clinical knowledge base.<br/>
            A licensed doctor handles anything medical.
          </p>

          <div className={`ask-field${askFocused ? ' focus' : ''}`} id="askBar">
            <input
              className="ask-in"
              id="askIn"
              type="text"
              aria-label="Ask TIDL anything"
              placeholder={askPlaceholder}
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onFocus={() => setAskFocused(true)}
              onBlur={() => setAskFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(askInput); }}
            />
            <button
              className="ask-go"
              id="askGo"
              aria-label="Ask"
              onClick={() => handleAsk(askInput)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
            <span className="ask-line"></span>
          </div>

          <div className="ask-chips" id="askChips">
            {[
              "What is the TIDL Pen?",
              "Am I a fit for GLP-1?",
              "How does TRT work?",
              "What are peptides?",
            ].map((q, i) => (
              <span key={q} style={{ display: 'contents' }}>
                {i > 0 && <span className="ask-dot">·</span>}
                <button
                  className="ask-chip"
                  onClick={() => { setAskInput(q); handleAsk(q); }}
                >
                  {q}
                </button>
              </span>
            ))}
          </div>

          <div className={`ask-ans${askOpen ? ' open' : ''}`} id="askAns" aria-live="polite">
            <div className="ask-quote">
              <div className={`ask-dots${askTyping ? ' on' : ''}`} id="askDots">
                <span></span><span></span><span></span>
              </div>
              <p className={`ask-text${!askTyping && askDisplayed ? ' on' : ''}`} id="askText">
                {askDisplayed}
              </p>
            </div>
          </div>

          <p className="ask-note">TIDL AI shares general information. Your doctor makes every medical decision.</p>
        </div>

        {/* ===== Blog Section ===== */}
        <section className="feature-blog-02 container-full">
          <div 
            data-w-id="3072fecc-9b21-d07c-8a0f-122ed0f211ae"
            className="feature-blog-content-02"
          >
            <h2 className="feature-blog-title-02 heading-01">The Tidl Journal</h2>
            <div 
              data-w-id="732914ee-333f-b961-45d6-fc996df4a5d9"
              className="feature-blog-list-wrap-02"
            >
              <div 
                data-w-id="35af91e4-9c61-6ba2-1c96-b79c2f600fea"
                className="feature-blog-list-02"
              >
                {[
                  {
                    href: '#',
                    img: 'https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aec42b6e5359eece02ec0_hf_20260705_222419_e9eea2f4-16e9-4829-bc36-184ebd9190fc%20(1).png',
                    title: 'What is a GLP-1 pen?',
                    text: "How the pre-dosed pen works, and why it's simpler than anything before it.",
                  },
                  {
                    href: '#',
                    img: 'https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aeb7bee8a179649d1bc35_hf_20260705_233029_46be476f-68f2-49e7-881f-b334ef1c6bbf.png',
                    title: 'Peptides, explained simply',
                    text: "What peptide therapy is, what it does, and who it's actually for",
                  },
                  {
                    href: '#',
                    img: 'https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aeb7bf3a19844a4ae631c_hf_20260705_233049_38c7a73e-b44d-4975-8d17-9919f2b2a881.png',
                    title: 'What to expect in month one',
                    text: 'A week-by-week look at your first month of treatment.',
                  },
                  {
                    href: '#',
                    img: 'https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4aec07cea6f47c26ee14cf_hf_20260705_233058_7f599980-dfef-43f9-85d2-4073ff9f21c2.png',
                    title: 'Signs your testosterone may be low',
                    text: 'Common symptoms, and how a simple assessment can help.',
                  },
                ].map(({ href, img, title, text }) => (
                  <div className="feasture-blog-collection w-dyn-list" key={title}>
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="w-dyn-item">
                        <a href={href} className="collection-link w-inline-block">
                          <div className="feature-blog-item-02">
                            <div className="feature-blog-thumb-02">
                              <img src={img} loading="lazy" alt="feature blog img" className="feature-blog-thumb-img-02"/>
                            </div>
                            <div className="feature-blog-body-02">
                              <div className="feature-blog-name-02 heading-05">{title}</div>
                              <div className="feature-blog-text-02 p1-regular">{text}</div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== How to Use the Pen — Video Section ===== */}
        <section className="section">
          <div className="section-padding">
            <div className="page-padding">
              <div className="container-medium">
                <div className="section_header">
                  <h2 className="section_header-title">HOW TO USE THE PEN</h2>
                </div>
                <div className="video_component">
                  <div className="video_placeholder-01">
                    <div className="layer">
                      <img
                        src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a4bbd9950fd69347716fcab_hf_20260706_142630_ecfd4adf-10ef-4ea0-804d-21e9849d1aa8.png"
                        loading="lazy"
                        sizes="(max-width: 2560px) 100vw, 2560px"
                        alt=""
                        className="cover"
                      />
                    </div>
                    <div className="video_placeholder-col-01 is-play-wrap">
                      <div className="video_play-button-wrap">
                        <a
                          href="https://www.youtube.com/watch?v=q-ktd4nEi3w"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video_play-button"
                          role="button"
                          aria-label="Play Video"
                        >
                          <div className="video_play-button-icon w-embed">
                            <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.8937 10.064L3.39375 0.309337C2.05313 -0.48285 0 0.2859 0 2.24527V21.75C0 23.5078 1.90781 24.5672 3.39375 23.6859L19.8937 13.9359C21.3656 13.0687 21.3703 10.9312 19.8937 10.064Z" fill="currentColor"/>
                            </svg>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stories / Testimonials Section ===== */}
        <section className="stories-03 container-full">
          <div className="container-fluid for-works">
            <div className="stories-content-03">
              <h2 
                data-w-id="f251300e-1d20-13ab-99a7-486265690269"
                className="stories-title-03 heading-01"
              >
                Stories from our patients
              </h2>
              <div className="stories-slider-react">
                <div
                  className="stories-slides-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {STORIES.map((story, i) => (
                    <div className="stories-slide-react" key={i}>
                      <div className="stories-item-03">
                        <div className="stories-item-thumb-03">
                          <img
                            src={story.img}
                            loading="lazy"
                            sizes="(max-width: 1086px) 100vw, 1086px"
                            alt="slider bg"
                            className={story.imgClass}
                          />
                        </div>
                        <div className="stories-info-03">
                          <div className="stories-item-head-03">
                            <div className="stories-item-text-03 heading-03">{story.quote}</div>
                          </div>
                          <div className="stories-item-info-02">
                            <div className="stories-item-info-title-02 heading-05">{story.name}</div>
                            <div className="stories-item-info-text-02 p2-regular">{story.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="stories-arrow left" onClick={prevSlide} aria-label="Previous">
                  <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f694_arrow-right%20(1).svg" loading="lazy" alt="arrow" className="works-arrow-ico"/>
                </button>
                <button className="stories-arrow right" onClick={nextSlide} aria-label="Next">
                  <img src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a484775bf274d9b9ec3f693_arrow-right%20(2).svg" loading="lazy" alt="arrow" className="works-arrow-ico"/>
                </button>
                <div className="stories-dots" aria-hidden="true">
                  {STORIES.map((_, i) => (
                    <button
                      key={i}
                      className={`stories-dot${currentSlide === i ? ' active' : ''}`}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ Section ===== */}
        <section className="tdlfaq-sec">
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
                <button className="tdlfaq-q" onClick={() => handleFaqToggle(item.id)}>
                  <span className="tdlfaq-qt">{item.q}</span>
                  <span className="tdlfaq-ic"><FaqIcon /></span>
                </button>
                <div className="tdlfaq-a">
                  <div className="tdlfaq-aw">
                    <p className="tdlfaq-at">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="tdlfaq-foot">
            Still have a question? <a href="#">Ask TIDL</a> or message our team.
          </p>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="cta container-full">
          <div className="container-fluid">
            <div className="cta-content">
              <h2 
                data-w-id="d64b06d4-2215-b165-06a4-ce64c10d68ed"
                className="cta-title heading-01"
              >
                Ready to feel like yourself again?
              </h2>
              <p className="cta-text p2-regular">Take the five-minute quiz. A licensed provider reviews everything. Your treatment ships to your door.</p>
              <a 
                data-w-id="d64b06d4-2215-b165-06a4-ce64c10d68ef"
                href="#" 
                className="button-01 button-03 w-inline-block"
              >
                <div className="button-outside-01">
                  <div className="button-inside">
                    <div className="button-text-01">Get started</div>
                    <div className="button-text-01">Take Quiz</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="footer">
          <div className="container-fluid">
            <div className="footer-content">
              <div className="footer-brand">
                <a href="/" className="footer-logo w-inline-block">
                  <img
                    src="https://cdn.prod.website-files.com/6a484773bf274d9b9ec3f5b9/6a49afeae23ed952c91c2170_ChatGPTImageJul4202603_07_16AM.png"
                    alt="TIDL Health"
                    className="footer-logo-img"
                    loading="lazy"
                  />
                </a>
                <p className="footer-tagline p2-regular">Doctor-prescribed telehealth. Real results, delivered to your door.</p>
              </div>
              <div className="footer-links">
                <div className="footer-col">
                  <div className="footer-col-title">Treatments</div>
                  {[
                    { href: '#', label: 'Weight Loss' },
                    { href: '#', label: 'Testosterone' },
                    { href: '#', label: 'Longevity' },
                    { href: '#', label: 'Peptide Therapy' },
                  ].map(({ href, label }) => (
                    <div key={label} className="footer-link-wrap">
                      <a href={href} className="footer-link">{label}</a>
                      <div className="footer-link-line"></div>
                    </div>
                  ))}
                </div>
                <div className="footer-col">
                  <div className="footer-col-title">Company</div>
                  {[
                    { href: '/about-01', label: 'About' },
                    { href: '/blogs', label: 'Journal' },
                    { href: '/doctors', label: 'Doctors' },
                  ].map(({ href, label }) => (
                    <div key={label} className="footer-link-wrap">
                      <a href={href} className="footer-link">{label}</a>
                      <div className="footer-link-line"></div>
                    </div>
                  ))}
                </div>
                <div className="footer-col">
                  <div className="footer-col-title">Legal</div>
                  {[
                    { href: '/terms', label: 'Terms' },
                    { href: '/privacy', label: 'Privacy' },
                  ].map(({ href, label }) => (
                    <div key={label} className="footer-link-wrap">
                      <a href={href} className="footer-link">{label}</a>
                      <div className="footer-link-line"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-copy p2-regular">&copy; {new Date().getFullYear()} TIDL Health. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </div>
  );
}
