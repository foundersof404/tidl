# Graph Report - tidl_webiste  (2026-07-14)

## Corpus Check
- 216 files · ~1,148,126 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1546 nodes · 2762 edges · 162 communities (86 shown, 76 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38207a2d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Checkout and Site Header
- App Routing and Pages
- Checkout UI Components
- Dynamic Quiz Logic
- Linting and Formatting
- Input and Sheet Components
- Scroll and Age Verification
- Alert and Avatar Components
- API Client Utilities
- Dialog and Badge Components
- TypeScript and Vite Config
- How It Works Section
- Product Detail Data Provider
- CTA and Content Sections
- Product Content Constants
- Authentication Pages
- Project Structure Config
- Testimonials and Reviews
- Command and Dialog Components
- Menubar Components
- Quiz Data Constants
- Chart and Carousel Logic
- Category Page Animations
- Environment Configuration
- UI Library Dependencies
- Form UI Components
- Product Catalog Content
- Product and Quiz State
- Carousel UI Components
- Server Error Handling
- Category Page Routing
- Product Detail Pages
- Category and Trust Content
- Patient Reviews UI
- Services Section UI
- Product Hero Section
- Intake Data Extraction
- Webhook Management
- Context Menu Components
- Dropdown Menu Components
- System Architecture Documentation
- Table UI Components
- Breadcrumb UI Components
- Drawer UI Components
- Navigation Menu Components
- Select UI Components
- Security and Webhook Signing
- SDK Integration Features
- Product Data Registry
- Card UI Components
- Toggle UI Components
- Category Program Timeline
- Product Card Components
- Category Recommendation Logic
- API Integration Documentation
- SDK Advanced Features
- Accordion UI Components
- Tabs UI Components
- Toast Notification Components
- Vite Environment Types
- Class Name Utility
- Brand Identity Assets
- Command Menu Library
- Date Utility Library
- Carousel Library
- Animation Library
- Form Validation Resolvers
- OTP Input Library
- Lottie Animation Library
- Icon Library
- Radix Accordion Primitive
- Radix Alert Dialog Primitive
- Radix Aspect Ratio Primitive
- Radix Avatar Primitive
- Radix Checkbox Primitive
- Radix Collapsible Primitive
- Radix Context Menu Primitive
- Radix Dialog Primitive
- Radix Dropdown Primitive
- Radix Hover Card Primitive
- Radix Label Primitive
- Radix Navigation Primitive
- Radix Popover Primitive
- Radix Progress Primitive
- Radix Radio Group Primitive
- Radix Scroll Area Primitive
- Radix Select Primitive
- Radix Separator Primitive
- Radix Slider Primitive
- Radix Slot Primitive
- Radix Switch Primitive
- Radix Toggle Primitive
- Radix Toggle Group Primitive
- Date Picker Library
- React DOM Library
- React Form Library
- React Spring Animations
- Sonner Toast Library
- Tailwind Merge Utility
- Tailwind CSS Framework
- Tailwind Vite Plugin
- React Query Library
- React Router Library
- React Start Framework
- TanStack Router Plugin
- Tailwind Animation CSS
- Vaul Drawer Component
- Vite TSConfig Paths
- Zod Schema Validation
- TIDL Flow Rendering
- Webhook API Endpoints
- Medical Injector Assets
- Pink Pill Assets
- Yellow Logo Assets
- White Pill Assets
- Brand Runner Imagery
- Sunset Runner Imagery
- Male Portrait Photography
- Female Portrait Photography
- Testimonial Portrait Photography
- Hero Section Imagery
- Clinic Onboarding Diagram
- Purchase Journey Diagram
- Renewal Flow Diagram
- Quiz Recovery Diagram
- Medical Resolution Diagram
- index.tsx
- Last Edit — Sandbox Integration
- AskTidlSection.tsx
- clsx
- ASK_TIDL_HANDOFF.md
- Sandbox Meeting — What I'll Say (my script)
- input-otp.tsx
- HOW TIDL WORKS — Code + CSS
- Routes
- TIDL Pen Rendering with Label
- POST /telehealth/intake/unified
- PrescribeRx Client
- verifyWebhook
- HOME_FEATURED_SLUGS
- pdp-data-registry.ts
- AskTidlSection.tsx
- peptide-images.ts
- drawer.tsx
- CategoryPenProgram.tsx
- input-otp.tsx
- accordion.tsx
- badge.tsx
- FileRoutesByPath
- DynamicQuiz.tsx
- data.ts
- categories.ts
- schema-intake.ts
- router.tsx
- auth.tsx
- quiz-sandbox.tsx
- @radix-ui/react-collapsible

## God Nodes (most connected - your core abstractions)
1. `cn()` - 69 edges
2. `formatCurrency()` - 30 edges
3. `FileRoutesByPath` - 30 edges
4. `createPrxClient()` - 24 edges
5. `The Last Sandbox Details` - 22 edges
6. `usePdpData()` - 21 edges
7. `useSiteHeaderState()` - 21 edges
8. `ProductSlug` - 21 edges
9. `jsonOk()` - 18 edges
10. `handlePrxRouteError()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Webhooks Guide` --conceptually_related_to--> `PrescribeRx Platform`  [INFERRED]
  .pdf-extract/Webhooks_—_PrescribeRx_API.pdf.txt → .tmp-docx/word/media/image6.png
- `Tidl Health Home` --references--> `TIDL Icon Logo`  [EXTRACTED]
  clone/index.html → public/tidl_logo.png
- `CalendarDayButton()` --references--> `react`  [EXTRACTED]
  src/components/ui/calendar.tsx → package.json
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useChart()` --references--> `react`  [EXTRACTED]
  src/components/ui/chart.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **TIDL to PrescribeRx Integration Flow** — src_routes_api_prx_webhooks_post_webhooks, src_lib_prescribe_rx_client_prx_client, prescriberx_api_unified_intake [EXTRACTED 1.00]
- **Ask TIDL AI Section** — src_components_home_asktidlsection_asktidlsection, src_lib_ask_tidl_content_ask_tidl_section [EXTRACTED 1.00]
- **Category and Product Catalog System** — src_components_category_categorypage_categorypage, src_lib_categories_categories, src_lib_product_catalog_catalog_products [EXTRACTED 1.00]
- **TIDL System Architecture** — tmp_docx_word_media_image6, tmp_docx_word_media_image7, tmp_docx_word_media_image8 [EXTRACTED 1.00]
- **PrescribeRx Integration Flow** — webhooks_prescriberx_api_webhooks_guide, webhooks_prescriberx_api_api_v1_webhooks, prescriberx_platform [INFERRED 0.85]
- **PrescribeRx SDK Integration Features** — src_apis_aproach_02_preselected_package_prescriberx_embed_sdk_preselected_package, src_apis_aproach_03_product_types_payment_prescriberx_embed_sdk_product_types, src_apis_aproach_03_product_types_payment_prescriberx_embed_sdk_payment, src_apis_aproach_04_prefill_skip_steps_consents_prescriberx_embed_sdk_prefill, src_apis_aproach_04_prefill_skip_steps_consents_prescriberx_embed_sdk_skip_steps, src_apis_aproach_04_prefill_skip_steps_consents_prescriberx_embed_sdk_consents [INFERRED 0.90]
- **PrescribeRx API Integration Flow** — src_apis_aproach_05_pre_attached_lab_results_prescriberx_embed_sdk_pre_attached_lab_results, src_apis_aproach_06_external_transaction_prescriberx_embed_sdk_external_transaction, src_apis_aproach_api_playground_prescriberx_api_playground [INFERRED 0.90]
- **PrescribeRx API Documentation** — src_apis_aproach_api_token_types_abilities_prescriberx, src_apis_aproach_top_5_integration_flows_prescriberx_api, src_apis_aproach_webhooks_prescriberx_api [EXTRACTED 1.00]

## Communities (162 total, 76 thin omitted)

### Community 0 - "Checkout and Site Header"
Cohesion: 0.18
Nodes (7): FUNNEL_NAV_LINKS, SiteFooter(), SiteHeader(), SiteHeaderProps, SiteNavLink, PrivacyPage(), TermsPage()

### Community 1 - "App Routing and Pages"
Cohesion: 0.04
Nodes (45): Route, Route, AccountIndexRoute, ApiPrxAuthMeRoute, ApiPrxCatalogRoute, ApiPrxCheckoutRoute, ApiPrxEncountersEncounterIdRoute, ApiPrxEncountersRoute (+37 more)

### Community 2 - "Checkout UI Components"
Cohesion: 0.10
Nodes (30): STATUS_ORDER, StatusTimeline(), addDays(), createOrder(), generateOrderNumber(), getLatestOrderForUser(), getOrderById(), getOrdersForUser() (+22 more)

### Community 3 - "Dynamic Quiz Logic"
Cohesion: 0.12
Nodes (33): State, ApiFailure, ApiSuccess, fetchPrxAuthMe(), fetchPrxCatalog(), fetchPrxCatalogProducts(), fetchPrxCatalogSnapshot(), fetchPrxEncounter() (+25 more)

### Community 4 - "Linting and Formatting"
Cohesion: 0.04
Nodes (46): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, lightningcss (+38 more)

### Community 5 - "Input and Sheet Components"
Cohesion: 0.05
Nodes (39): Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+31 more)

### Community 6 - "Scroll and Age Verification"
Cohesion: 0.11
Nodes (16): CheckoutForm(), OrderSummary(), checkoutDefaultValues, checkoutFormSchema, CheckoutFormValues, PEPTIDE_PRX_SLUGS, calculateOrderPricing(), getCatalogListPrice() (+8 more)

### Community 7 - "Alert and Avatar Components"
Cohesion: 0.06
Nodes (23): Alert, AlertDescription, AlertTitle, alertVariants, Avatar, AvatarFallback, AvatarImage, Checkbox (+15 more)

### Community 8 - "API Client Utilities"
Cohesion: 0.23
Nodes (11): createPrxClient(), createRoleClient(), prxClient(), prxPatient(), prxProvider(), prxSalesOrg(), IntakeBody, handlePrxRouteError() (+3 more)

### Community 9 - "Dialog and Badge Components"
Cohesion: 0.12
Nodes (24): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+16 more)

### Community 10 - "TypeScript and Vite Config"
Cohesion: 0.07
Nodes (29): DOM, DOM.Iterable, ES2022, eslint.config.js, ./src/*, src/**/*.ts, src/**/*.tsx, vite/client (+21 more)

### Community 11 - "How It Works Section"
Cohesion: 0.10
Nodes (19): ContourMap(), LINES, HIW_STEPS, HiWCard, HiWStep, ImageMotion, HowItWorksSection(), punch (+11 more)

### Community 12 - "Product Detail Data Provider"
Cohesion: 0.09
Nodes (24): IncludedItem, TimelineStep, PdpButton(), PdpButtonProps, Reveal(), settle, PdpCtaBand(), PdpCtaBandProps (+16 more)

### Community 13 - "CTA and Content Sections"
Cohesion: 0.11
Nodes (15): ContourField(), CORE_D, PARTICLES, RIDGES, CARD_ROWS, CtaSection(), PHRASES, settle (+7 more)

### Community 14 - "Product Content Constants"
Cohesion: 0.07
Nodes (28): 10. Components to reuse from codebase, 11. Copy guidelines, 12. SEO and metadata (proposed), 13. Implementation checklist, 14. Out of scope for PDP v1, 15. References, 1. Page purpose, 2. Product data (current codebase) (+20 more)

### Community 15 - "Authentication Pages"
Cohesion: 0.15
Nodes (6): AuthBrandPanel(), AuthBrandPanelProps, AuthMode, AuthPage(), AuthPageProps, useTypewriterLoop()

### Community 16 - "Project Structure Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 17 - "Testimonials and Reviews"
Cohesion: 0.14
Nodes (12): buildLoopItems(), buildMarqueeRows(), MarqueeRow(), settle, StoriesSection(), STORIES_SECTION, TESTIMONIAL_NOTES, GLP1_TESTIMONIALS (+4 more)

### Community 18 - "Command and Dialog Components"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 19 - "Menubar Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 20 - "Quiz Data Constants"
Cohesion: 0.10
Nodes (23): peptideToProduct(), GENERIC_FALLBACK_PRODUCT, GLP1_PRODUCT, GOAL_FALLBACK, Product, QuizModalContext, QuizModalContextValue, QuizModalOptions (+15 more)

### Community 21 - "Chart and Carousel Logic"
Cohesion: 0.12
Nodes (13): react, react, useCarousel(), ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent (+5 more)

### Community 22 - "Category Page Animations"
Cohesion: 0.21
Nodes (13): applyRecommendationAction(), CategoryHero(), CategoryHeroProps, scrollToTarget(), SearchSuggestion, SUGGESTIONS, CATEGORIES, CategoryDefinition (+5 more)

### Community 23 - "Environment Configuration"
Cohesion: 0.17
Nodes (17): DEFAULT_ENCOUNTER_TYPE_SLUGS, DEFAULT_PRODUCT_TYPE_SLUGS, ENCOUNTER_TYPE_ENV_KEYS, getPrxApiToken(), getPrxConfig(), getPrxEncounterTypeSlug(), getPrxProductTypeSlug(), getPrxToken() (+9 more)

### Community 24 - "UI Library Dependencies"
Cohesion: 0.13
Nodes (15): clsx, framer-motion, dependencies, clsx, framer-motion, @radix-ui/react-menubar, @radix-ui/react-tabs, @radix-ui/react-tooltip (+7 more)

### Community 25 - "Form UI Components"
Cohesion: 0.15
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 26 - "Product Catalog Content"
Cohesion: 0.29
Nodes (12): PrxActivityCard(), DynamicQuizModal(), useIsMounted(), usePrxEncounterStatus(), fetchPrxEncounters(), prxStatusLabel(), prxStatusToOrderStatus(), getRecommendedTreatment() (+4 more)

### Community 27 - "Product and Quiz State"
Cohesion: 0.14
Nodes (21): GLP1_PDP_CONTENT, SHARED_CARE_FAQ, SHARED_DELIVERY_FAQ, SHARED_REVIEW_STATS, SHARED_SAFETY_PILLARS, SHARED_START_FAQ, HERO_IMAGES, PDP_META (+13 more)

### Community 28 - "Carousel UI Components"
Cohesion: 0.15
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 29 - "Server Error Handling"
Cohesion: 0.27
Nodes (8): consumeLastCapturedError(), renderErrorPage(), fetch(), getServerEntry(), isH3SwallowedErrorBody(), normalizeCatastrophicSsrResponse(), ServerEntry, errorMiddleware

### Community 30 - "Category Page Routing"
Cohesion: 0.22
Nodes (10): CategoryAmbient(), ORBS, CategoryPage(), CategoryPageProps, isCategorySlug(), getCategory(), useLiveCatalog(), getCatalogPrice() (+2 more)

### Community 31 - "Product Detail Pages"
Cohesion: 0.08
Nodes (23): 10. What we need next, 11. Login / Signup — do they use the API?, 12.1 Where the provider works (no TIDL page needed), 12.2 What the provider sees and does, 12.3 How the provider gets identified / verified, 12.4 The state-license rule (important), 12.5 What happens after they prescribe (back to TIDL), 12.6 Summary of the provider question (+15 more)

### Community 32 - "Category and Trust Content"
Cohesion: 0.10
Nodes (20): 1. Environment & secrets, 1. Start dev server, 2. Quick browser checks, 2. Server-side PRX client, 3. API routes built (TanStack Start server routes), 3. Full flow test, 4. Token expired?, 4. Wired into the app (+12 more)

### Community 33 - "Patient Reviews UI"
Cohesion: 0.11
Nodes (18): 10. FAQ — "handle the last objections", 11. Footer + sticky CTA, 1. Hero — "the confident first impression", 2. Who this is for — "self-qualification", 3. Your care path — "how it works, made simple", 4. The Pen — "the hero device moment", 5. What's included — "the full care package", 6. Pricing — "the clear ask" (+10 more)

### Community 34 - "Services Section UI"
Cohesion: 0.16
Nodes (9): PHRASES, ServicesClosing(), settle, ServicesSection(), CategorySlug, CATEGORY_PATHS, SERVICE_CARDS, ServiceCardContent (+1 more)

### Community 35 - "Product Hero Section"
Cohesion: 0.15
Nodes (14): BrowseDirectorySection(), withCatalogAssets(), PdpHeroSection(), PdpHeroSectionProps, PRODUCT_ORDER, productNeighbors(), splitTitle(), CATEGORY_SLUGS (+6 more)

### Community 36 - "Intake Data Extraction"
Cohesion: 0.33
Nodes (10): isPrxSandbox(), PrxApiError, DynamicIntakeBody, extractEncounterId(), extractEncounterNumber(), extractOrderId(), extractPatientChartId(), extractPatientNumber() (+2 more)

### Community 37 - "Webhook Management"
Cohesion: 0.20
Nodes (10): NOTE: PRX will not deliver to localhost/private IPs — point the subscription, Route, getRecentWebhooks(), PrxWebhookRecord, records, recordWebhook(), PRX_SIGNATURE_HEADERS, readPrxSignatureHeader() (+2 more)

### Community 38 - "Context Menu Components"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 39 - "Dropdown Menu Components"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 40 - "System Architecture Documentation"
Cohesion: 0.22
Nodes (9): LocumTele Doctor Network, PrescribeRx Platform, TIDL Data Layer, TIDL Site Architecture and Partner Ecosystem, TIDL Data Layer and AI Stack Architecture, TIDL Website Full System and Data Flow, /api/v1/webhooks, Signature Verification (+1 more)

### Community 41 - "Table UI Components"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 42 - "Breadcrumb UI Components"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 43 - "Drawer UI Components"
Cohesion: 0.10
Nodes (20): lenis, lenis, AgeGate(), LenisScroll(), useLenisScroll(), confirmAgeGate(), isAgeGateConfirmed(), clearSession() (+12 more)

### Community 44 - "Navigation Menu Components"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 45 - "Select UI Components"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 46 - "Security and Webhook Signing"
Cohesion: 0.13
Nodes (14): 10. What needs to be built, 11. Current state (for honesty), 12. Decisions needed before building, 13. One-line summary, 1. The idea in one line, 2. The pages involved, 3. Who owns what, 4. Signup logic (create account) (+6 more)

### Community 47 - "SDK Integration Features"
Cohesion: 0.29
Nodes (7): PrescribeRx Embed SDK, Preselected Package, Payment, Product Types, Consents, Prefill, Skip Steps

### Community 48 - "Product Data Registry"
Cohesion: 0.14
Nodes (13): 10. One line, 1. What Thomas actually said (the big picture), 2. The peptides (corrected product idea — important), 3. The quiz questions come from the sandbox (new, important), 4. What we already have today, 5.1 Website-facing, 5.2 Behind the site, 5. The full sandbox scope (what "whole site connected" can include) (+5 more)

### Community 49 - "Card UI Components"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 50 - "Toggle UI Components"
Cohesion: 0.20
Nodes (9): GLP1_PEN_SHOWCASE, FaqItem, HeroProduct, PdpBeforeAfter, PenShowcaseContent, PenShowcaseFeature, PenShowcaseStat, ReviewStat (+1 more)

### Community 51 - "Category Program Timeline"
Cohesion: 0.15
Nodes (12): Architecture map, FILE 1 — Route `src/routes/category/$slug.tsx`, FILE 2 — Page `src/components/category/CategoryPage.tsx`, FILE 3 — Styles `src/components/category/category.css`, FILE 4 — Category copy/data `src/lib/categories.ts`, FILE 5 — Catalog products `src/lib/product-catalog.ts`, FILE 6 — Trust signals `src/lib/trust-content.ts`, Page sections (DOM order) (+4 more)

### Community 52 - "Product Card Components"
Cohesion: 0.25
Nodes (9): getPeptideHandBox(), MAP, parseConcentration(), parseForm(), parseStrength(), parseVolume(), PeptideHandBox, PeptideImageEntry (+1 more)

### Community 53 - "Category Recommendation Logic"
Cohesion: 0.09
Nodes (16): TidlWordmark(), TidlWordmarkProps, JOURNEY_TICKER_ICONS, JOURNEY_TICKER_ITEMS, JourneySection(), JourneySectionProps, CAREER_LINKS, COMPANY_LINKS (+8 more)

### Community 54 - "API Integration Documentation"
Cohesion: 0.67
Nodes (4): PrescribeRx API, API Token Types & Abilities — PrescribeRx, Top-5 Integration Flows — PrescribeRx API, Webhooks — PrescribeRx API

### Community 55 - "SDK Advanced Features"
Cohesion: 0.50
Nodes (4): PrescribeRx Embed SDK, Pre-attached Lab Results, External Transaction, API Playground

### Community 56 - "Accordion UI Components"
Cohesion: 0.30
Nodes (10): Path, any_peptide_image(), download(), find_match(), has_image(), load_catalog(), main(), Convert near-white / corner-matched studio background to transparency.     Uses (+2 more)

### Community 57 - "Tabs UI Components"
Cohesion: 0.23
Nodes (12): CHECKOUT_STEPS, CheckoutLayout(), FunnelPageShell(), FunnelPageShellProps, readSectionTheme(), SiteHeaderTheme, useSiteHeaderState(), UseSiteHeaderStateOptions (+4 more)

### Community 60 - "Class Name Utility"
Cohesion: 0.60
Nodes (4): Image, load_font(), main(), make_card()

### Community 63 - "Date Utility Library"
Cohesion: 0.08
Nodes (23): 10. Homepage sandbox surfaces, 11. PDP / marketing, 12. Quiz, 13. Confirmation & account, 14. Webhooks & live status, 15. Proven sandbox data (examples), 16. Blocker: Orders empty, 17. Open items / caveats (+15 more)

### Community 75 - "Radix Collapsible Primitive"
Cohesion: 0.27
Nodes (9): getPdpContent(), Glp1PdpPage(), ProductPdpPageInner(), ProductPdpPageProps, mergeSandboxIntoPdp(), money(), LiveProduct, resolveDisplayMonthlyPrice() (+1 more)

### Community 131 - "Last Edit — Sandbox Integration"
Cohesion: 0.18
Nodes (10): Client fetchers & exports, Environment, Last Edit — Sandbox Integration, New API endpoints (summary), P1 — Webhooks, P2 — Live encounter status (highest testable value), P3 — Account + real PrescribeRx data, P4 — Structured consents (+2 more)

### Community 132 - "AskTidlSection.tsx"
Cohesion: 0.23
Nodes (11): FAQ_DATA, FaqItem, HomePage(), money(), SandboxPeptidesSection(), HERO_COPY, HOMEPAGE_STARTING_PRICE_LABEL, useHomeSandbox() (+3 more)

### Community 133 - "clsx"
Cohesion: 0.40
Nodes (4): getInitials(), PatientAvatar(), PatientAvatarProps, TestimonialContextPhotoProps

### Community 134 - "ASK_TIDL_HANDOFF.md"
Cohesion: 0.22
Nodes (8): Design notes (current state), FILE 1 — `src/lib/ask-tidl-content.ts`, FILE 2 — `src/components/home/AskTidlSection.tsx`, FILE 3 — Ask TIDL CSS (from `home.css`), Files, Integration (HomePage), Stack / dependencies, Typography snippet (from typography.css)

### Community 135 - "Sandbox Meeting — What I'll Say (my script)"
Cohesion: 0.25
Nodes (7): 1. How I open, 2. Showing the flow (while I share my screen), 3. What I want from you (say this clearly), 4. The launch plan (tell him our understanding), 5. The problem (say it, then show it), 6. How I close, Sandbox Meeting — What I'll Say (my script)

### Community 136 - "input-otp.tsx"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 137 - "HOW TIDL WORKS — Code + CSS"
Cohesion: 0.50
Nodes (3): HOW TIDL WORKS — Code + CSS, `src/components/home/how-it-works/how-it-works.css`, `src/components/home/how-it-works/HowItWorksSection.tsx`

### Community 145 - "pdp-data-registry.ts"
Cohesion: 0.50
Nodes (4): isProductSlug(), ProductRoute(), Route, PRODUCT_SLUGS

### Community 146 - "AskTidlSection.tsx"
Cohesion: 0.25
Nodes (8): AskTidlSection, AskTidlSectionHandle, NODES, ORBS, ASK_TIDL_ANSWERS, ASK_TIDL_PLACEHOLDER_QS, ASK_TIDL_PROMPTS, ASK_TIDL_SECTION

### Community 147 - "peptide-images.ts"
Cohesion: 0.23
Nodes (13): getPeptideImageMap(), resolvePeptideOnlyImage(), CATALOG_KEYWORDS, PrxCatalogPackage, PrxCatalogProduct, buildState(), LiveCatalogMap, LiveCatalogState (+5 more)

### Community 148 - "drawer.tsx"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 149 - "CategoryPenProgram.tsx"
Cohesion: 0.14
Nodes (15): catCardHover, catReveal, catSpring, catStagger, CategoryBundleSection(), CategoryBundleSectionProps, CategoryPenProgram(), CategoryPenProgramProps (+7 more)

### Community 150 - "input-otp.tsx"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 151 - "accordion.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 152 - "badge.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 153 - "FileRoutesByPath"
Cohesion: 0.09
Nodes (22): Route, Route, Route, Route, Route, Route, Route, Route (+14 more)

### Community 154 - "DynamicQuiz.tsx"
Cohesion: 0.21
Nodes (15): answerMatches(), Answers, AnswerValue, AUTO_ADVANCE, DynamicQuiz(), FIELD_TYPE, fieldIsComplete(), FieldRenderer() (+7 more)

### Community 156 - "categories.ts"
Cohesion: 0.28
Nodes (7): CategoryEducationBlock, CategoryFaqItem, CategoryPenSpotlight, CARE_JOURNEY_STEPS, PEN_SPOTLIGHT, TRUST_PILLARS, TRUST_STATS

### Community 157 - "schema-intake.ts"
Cohesion: 0.12
Nodes (19): PrxEncounterTypeSchema, PrxEncounterTypeSchemaResponse, PrxEncounterTypesResponse, PrxEncounterTypeSummary, PrxFieldCondition, PrxFieldOption, PrxSchemaField, PrxSchemaStep (+11 more)

### Community 158 - "router.tsx"
Cohesion: 0.40
Nodes (4): getRouter(), Register, routeTree, startInstance

## Knowledge Gaps
- **672 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+667 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **76 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `UI Library Dependencies` to `index.tsx`, `Linting and Formatting`, `Chart and Carousel Logic`, `data.ts`, `@radix-ui/react-collapsible`, `Drawer UI Components`, `Command Menu Library`, `Carousel Library`, `Animation Library`, `Form Validation Resolvers`, `OTP Input Library`, `Lottie Animation Library`, `Icon Library`, `Radix Accordion Primitive`, `Radix Alert Dialog Primitive`, `Radix Aspect Ratio Primitive`, `Radix Avatar Primitive`, `Radix Checkbox Primitive`, `Radix Context Menu Primitive`, `Radix Dialog Primitive`, `Radix Dropdown Primitive`, `Radix Hover Card Primitive`, `Radix Label Primitive`, `Radix Navigation Primitive`, `Radix Popover Primitive`, `Radix Progress Primitive`, `Radix Radio Group Primitive`, `Radix Scroll Area Primitive`, `Radix Select Primitive`, `Radix Separator Primitive`, `Radix Slider Primitive`, `Radix Slot Primitive`, `Radix Switch Primitive`, `Radix Toggle Primitive`, `Radix Toggle Group Primitive`, `Date Picker Library`, `React DOM Library`, `React Form Library`, `React Spring Animations`, `Sonner Toast Library`, `Tailwind Merge Utility`, `Tailwind CSS Framework`, `Tailwind Vite Plugin`, `React Query Library`, `React Router Library`, `React Start Framework`, `TanStack Router Plugin`, `Tailwind Animation CSS`, `Vaul Drawer Component`, `Vite TSConfig Paths`, `Zod Schema Validation`?**
  _High betweenness centrality (0.327) - this node is a cross-community bridge._
- **Why does `lenis` connect `Drawer UI Components` to `UI Library Dependencies`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _672 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Routing and Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.04440333024976873 - nodes in this community are weakly interconnected._
- **Should `Checkout UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.10338680926916222 - nodes in this community are weakly interconnected._
- **Should `Dynamic Quiz Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.11711711711711711 - nodes in this community are weakly interconnected._
- **Should `Linting and Formatting` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._