# Graph Report - .  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1249 nodes · 2282 edges · 130 communities (62 shown, 68 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.59)
- Token cost: 3,918 input · 1,498 output

## Graph Freshness
- Built from commit: `d3aa88c5`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 69 edges
2. `FileRoutesByPath` - 28 edges
3. `createPrxClient()` - 24 edges
4. `jsonOk()` - 19 edges
5. `handlePrxRouteError()` - 19 edges
6. `formatCurrency()` - 18 edges
7. `ProductSlug` - 18 edges
8. `usePdpData()` - 17 edges
9. `useSiteHeaderState()` - 17 edges
10. `compilerOptions` - 17 edges

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
- **Routing Configuration** — src_routes_readme, src_routes_root, src_routes_routetree_gen [EXTRACTED 1.00]

## Communities (130 total, 68 thin omitted)

### Community 0 - "Checkout and Site Header"
Cohesion: 0.05
Nodes (47): POST /telehealth/intake/unified, TidlWordmark(), TidlWordmarkProps, CategoryPage(), CHECKOUT_STEPS, CheckoutLayout(), AskTidlSection, AskTidlSectionHandle (+39 more)

### Community 1 - "App Routing and Pages"
Cohesion: 0.04
Nodes (69): getRouter(), Route, Route, Route, Route, Route, Route, Route (+61 more)

### Community 2 - "Checkout UI Components"
Cohesion: 0.06
Nodes (50): CheckoutForm(), OrderSummary(), STATUS_ORDER, StatusTimeline(), useIsMounted(), State, usePrxEncounterStatus(), checkoutDefaultValues (+42 more)

### Community 3 - "Dynamic Quiz Logic"
Cohesion: 0.06
Nodes (64): PrxActivityCard(), answerMatches(), Answers, AnswerValue, AUTO_ADVANCE, DynamicQuiz(), FIELD_TYPE, fieldIsComplete() (+56 more)

### Community 4 - "Linting and Formatting"
Cohesion: 0.04
Nodes (46): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-prettier, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, lightningcss (+38 more)

### Community 5 - "Input and Sheet Components"
Cohesion: 0.05
Nodes (39): Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+31 more)

### Community 6 - "Scroll and Age Verification"
Cohesion: 0.09
Nodes (23): lenis, lenis, TIDL Pen Rendering with Label, AgeGate(), LenisScroll(), useLenisScroll(), confirmAgeGate(), isAgeGateConfirmed() (+15 more)

### Community 7 - "Alert and Avatar Components"
Cohesion: 0.06
Nodes (22): Alert, AlertDescription, AlertTitle, alertVariants, Avatar, AvatarFallback, AvatarImage, Checkbox (+14 more)

### Community 8 - "API Client Utilities"
Cohesion: 0.18
Nodes (15): createPrxClient(), createRoleClient(), prxClient(), prxPatient(), prxProvider(), prxSalesOrg(), PrxApiError, PrxClient (+7 more)

### Community 9 - "Dialog and Badge Components"
Cohesion: 0.11
Nodes (27): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+19 more)

### Community 10 - "TypeScript and Vite Config"
Cohesion: 0.07
Nodes (28): DOM, DOM.Iterable, ES2022, eslint.config.js, ./src/*, src/**/*.ts, src/**/*.tsx, vite/client (+20 more)

### Community 11 - "How It Works Section"
Cohesion: 0.10
Nodes (19): ContourMap(), LINES, HIW_STEPS, HiWCard, HiWStep, ImageMotion, HowItWorksSection(), punch (+11 more)

### Community 12 - "Product Detail Data Provider"
Cohesion: 0.16
Nodes (11): TimelineStep, PdpButtonProps, Reveal(), settle, PdpDataContext, PdpDataProvider(), usePdpData(), PdpIncludedSection() (+3 more)

### Community 13 - "CTA and Content Sections"
Cohesion: 0.11
Nodes (15): ContourField(), CORE_D, PARTICLES, RIDGES, CARD_ROWS, CtaSection(), PHRASES, settle (+7 more)

### Community 14 - "Product Content Constants"
Cohesion: 0.11
Nodes (18): GLP1_PDP_CONTENT, SHARED_CARE_FAQ, SHARED_DELIVERY_FAQ, SHARED_REVIEW_STATS, SHARED_SAFETY_PILLARS, SHARED_START_FAQ, HERO_IMAGES, GLP1_PEN_SHOWCASE (+10 more)

### Community 15 - "Authentication Pages"
Cohesion: 0.12
Nodes (8): AuthBrandPanel(), AuthBrandPanelProps, AuthMode, AuthPage(), AuthPageProps, useTypewriterLoop(), authSearchSchema, Route

### Community 16 - "Project Structure Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 17 - "Testimonials and Reviews"
Cohesion: 0.16
Nodes (10): buildLoopItems(), buildMarqueeRows(), MarqueeRow(), settle, StoriesSection(), STORIES_SECTION, TESTIMONIAL_NOTES, GLP1_TESTIMONIALS (+2 more)

### Community 18 - "Command and Dialog Components"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 19 - "Menubar Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 20 - "Quiz Data Constants"
Cohesion: 0.12
Nodes (16): DEFAULT_QUIZ_DATA, EATING_HABITS, EatingHabits, EXERCISE_LEVELS, ExerciseLevel, GOAL_IDS, GOAL_LABELS, HEALTH_CONDITION_IDS (+8 more)

### Community 21 - "Chart and Carousel Logic"
Cohesion: 0.12
Nodes (13): react, react, useCarousel(), ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent (+5 more)

### Community 22 - "Category Page Animations"
Cohesion: 0.20
Nodes (13): catCardHover, catReveal, catSpring, catStagger, CategoryBundleSection(), CategoryBundleSectionProps, applyRecommendationAction(), CategoryHero() (+5 more)

### Community 23 - "Environment Configuration"
Cohesion: 0.21
Nodes (15): DEFAULT_ENCOUNTER_TYPE_SLUGS, DEFAULT_PRODUCT_TYPE_SLUGS, ENCOUNTER_TYPE_ENV_KEYS, getPrxApiToken(), getPrxConfig(), getPrxEncounterTypeSlug(), getPrxProductTypeSlug(), getPrxToken() (+7 more)

### Community 24 - "UI Library Dependencies"
Cohesion: 0.13
Nodes (15): class-variance-authority, framer-motion, dependencies, class-variance-authority, framer-motion, @radix-ui/react-menubar, @radix-ui/react-tabs, @radix-ui/react-tooltip (+7 more)

### Community 25 - "Form UI Components"
Cohesion: 0.15
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 26 - "Product Catalog Content"
Cohesion: 0.22
Nodes (7): CategorySlug, CATEGORY_BUNDLES, CategoryBundle, CategoryBundleItem, CATEGORY_PATHS, ServiceCardContent, SITE_IMAGES

### Community 27 - "Product and Quiz State"
Cohesion: 0.22
Nodes (12): getCatalogPrice(), GENERIC_FALLBACK_PRODUCT, getGoalFromProduct(), getProductBySlug(), GOAL_FALLBACK, Product, PRODUCTS, QuizModalContext (+4 more)

### Community 28 - "Carousel UI Components"
Cohesion: 0.15
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 29 - "Server Error Handling"
Cohesion: 0.27
Nodes (8): consumeLastCapturedError(), renderErrorPage(), fetch(), getServerEntry(), isH3SwallowedErrorBody(), normalizeCatastrophicSsrResponse(), ServerEntry, errorMiddleware

### Community 30 - "Category Page Routing"
Cohesion: 0.23
Nodes (7): CategoryAmbient(), ORBS, CategoryPageProps, isCategorySlug(), getCategory(), CategoryRoute(), Route

### Community 31 - "Product Detail Pages"
Cohesion: 0.23
Nodes (7): PdpButton(), PdpCtaBand(), PdpCtaBandProps, PdpFaqSection(), PenShowcaseSection(), Glp1PdpPage(), ProductPdpPageProps

### Community 32 - "Category and Trust Content"
Cohesion: 0.23
Nodes (10): CATEGORIES, CATEGORY_SLUGS, CategoryDefinition, CategoryEducationBlock, CategoryFaqItem, CategoryPenSpotlight, CARE_JOURNEY_STEPS, PEN_SPOTLIGHT (+2 more)

### Community 33 - "Patient Reviews UI"
Cohesion: 0.24
Nodes (7): getInitials(), PatientAvatar(), PatientAvatarProps, TestimonialContextPhoto(), TestimonialContextPhotoProps, isOutcomeMetric(), PdpReviewsSection()

### Community 34 - "Services Section UI"
Cohesion: 0.20
Nodes (6): PHRASES, ServicesClosing(), settle, ServicesSection(), SERVICE_CARDS, SERVICES_INTRO

### Community 35 - "Product Hero Section"
Cohesion: 0.27
Nodes (7): PdpHeroSection(), PdpHeroSectionProps, PRODUCT_ORDER, productNeighbors(), splitTitle(), CATALOG_PRODUCTS, getCatalogProduct()

### Community 36 - "Intake Data Extraction"
Cohesion: 0.45
Nodes (8): DynamicIntakeBody, extractEncounterId(), extractEncounterNumber(), extractOrderId(), extractPatientChartId(), extractPatientNumber(), unwrapPrxEntity(), getIdempotencyKey()

### Community 37 - "Webhook Management"
Cohesion: 0.24
Nodes (7): NOTE: PRX will not deliver to localhost/private IPs — point the subscription, Route, getRecentWebhooks(), PrxWebhookRecord, records, recordWebhook(), verifyPrxWebhookSignature()

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
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 44 - "Navigation Menu Components"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 45 - "Select UI Components"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 46 - "Security and Webhook Signing"
Cohesion: 0.39
Nodes (6): bufferToBase64(), bufferToHex(), Route, signBody(), timingSafeEqualStrings(), verifyWebhookSignature()

### Community 47 - "SDK Integration Features"
Cohesion: 0.29
Nodes (7): PrescribeRx Embed SDK, Preselected Package, Payment, Product Types, Consents, Prefill, Skip Steps

### Community 48 - "Product Data Registry"
Cohesion: 0.38
Nodes (5): getPdpContent(), PDP_META, PDP_REGISTRY, withCatalogAssets(), Route

### Community 49 - "Card UI Components"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 50 - "Toggle UI Components"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 51 - "Category Program Timeline"
Cohesion: 0.47
Nodes (5): CategoryPenProgram(), CategoryPenProgramProps, curvedPath(), pathsEqual(), CategoryTimelineStep

### Community 52 - "Product Card Components"
Cohesion: 0.33
Nodes (3): CategoryProductCard(), CategoryProductCardProps, CatalogProduct

### Community 53 - "Category Recommendation Logic"
Cohesion: 0.47
Nodes (5): CATEGORY_GOALS, CategoryRecommendation, findAnswer(), getCategoryRecommendation(), resolveAction()

### Community 54 - "API Integration Documentation"
Cohesion: 0.67
Nodes (4): PrescribeRx API, API Token Types & Abilities — PrescribeRx, Top-5 Integration Flows — PrescribeRx API, Webhooks — PrescribeRx API

### Community 55 - "SDK Advanced Features"
Cohesion: 0.50
Nodes (4): PrescribeRx Embed SDK, Pre-attached Lab Results, External Transaction, API Playground

### Community 56 - "Accordion UI Components"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 57 - "Tabs UI Components"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

## Knowledge Gaps
- **498 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+493 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **68 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `UI Library Dependencies` to `Linting and Formatting`, `Scroll and Age Verification`, `Chart and Carousel Logic`, `Class Name Utility`, `Command Menu Library`, `Date Utility Library`, `Carousel Library`, `Animation Library`, `Form Validation Resolvers`, `OTP Input Library`, `Lottie Animation Library`, `Icon Library`, `Radix Accordion Primitive`, `Radix Alert Dialog Primitive`, `Radix Aspect Ratio Primitive`, `Radix Avatar Primitive`, `Radix Checkbox Primitive`, `Radix Collapsible Primitive`, `Radix Context Menu Primitive`, `Radix Dialog Primitive`, `Radix Dropdown Primitive`, `Radix Hover Card Primitive`, `Radix Label Primitive`, `Radix Navigation Primitive`, `Radix Popover Primitive`, `Radix Progress Primitive`, `Radix Radio Group Primitive`, `Radix Scroll Area Primitive`, `Radix Select Primitive`, `Radix Separator Primitive`, `Radix Slider Primitive`, `Radix Slot Primitive`, `Radix Switch Primitive`, `Radix Toggle Primitive`, `Radix Toggle Group Primitive`, `Date Picker Library`, `React DOM Library`, `React Form Library`, `React Spring Animations`, `Sonner Toast Library`, `Tailwind Merge Utility`, `Tailwind CSS Framework`, `Tailwind Vite Plugin`, `React Query Library`, `React Router Library`, `React Start Framework`, `TanStack Router Plugin`, `Tailwind Animation CSS`, `Vaul Drawer Component`, `Vite TSConfig Paths`, `Zod Schema Validation`?**
  _High betweenness centrality (0.469) - this node is a cross-community bridge._
- **Why does `lenis` connect `Scroll and Age Verification` to `UI Library Dependencies`?**
  _High betweenness centrality (0.397) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _498 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Checkout and Site Header` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `App Routing and Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.03776379118844872 - nodes in this community are weakly interconnected._
- **Should `Checkout UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0594679186228482 - nodes in this community are weakly interconnected._
- **Should `Dynamic Quiz Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.06398390342052314 - nodes in this community are weakly interconnected._