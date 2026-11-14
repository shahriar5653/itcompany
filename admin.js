/**
 * RSTechwerk Control Engine - Admin Panel JavaScript
 * Domain: rstechwerk.com
 * Content Management System & Inbound Leads CRM
 */

// Storage keys
const STORAGE_KEY_ADMIN = 'tecklumo_admin_state_v1';
const STORAGE_KEY_PUBLISHED = 'tecklumo_published_content';

// Default Seed Data
const DEFAULT_ADMIN_DATA = {
  hero: {
    pill: 'Europe & DACH',
    subtext: 'Senior Product Engineering',
    headlinePrefix: 'Build digital products',
    headlineGradient: 'that move your business forward.',
    subhead: 'From first idea to production-ready software, we help ambitious businesses launch faster with reliable design, development, and ongoing support.',
    primaryCtaText: 'Start Your Project',
    secondaryCtaText: 'Explore Our Work',
    maintenanceCtaText: 'Maintain Your Project',
    capabilities: [
      'Web Platforms',
      'Mobile Apps',
      'SaaS Systems',
      'AI Solutions',
      'ERP & Business Systems',
      'APIs & Integrations',
      'Cloud & DevOps',
      'Maintenance & Retainers'
    ]
  },
  inquiries: [
    {
      id: 'LEAD-8041',
      date: '2026-11-09',
      name: 'Johannes Weber',
      company: 'Logix GmbH (Hamburg, Germany)',
      email: 'johannes@logixgmbh.de',
      service: 'custom-software',
      serviceName: 'Custom Software & Enterprise ERP',
      budget: 'EUR €25,000 – 50,000',
      status: 'new',
      description: 'Looking to replace our legacy warehouse freight dispatch software with a modern PostgreSQL & Node.js cloud platform. We need e-CMR document generation and German GoBD audit log compliance.',
      internalNotes: 'Qualified high-priority lead. Team has 40 dispatchers. Requesting preliminary technical blueprint.'
    },
    {
      id: 'LEAD-8038',
      date: '2026-11-08',
      name: 'Dr. Elena Becker',
      company: 'PraxisFlow Digital (Munich, Germany)',
      email: 'elena.becker@praxisflow.de',
      service: 'web-saas',
      serviceName: 'Web & SaaS Platforms',
      budget: 'EUR €10,000 – 25,000',
      status: 'discovery',
      description: 'We need an accessible patient intake and appointment triage portal that integrates with our practice management software. Responsive on mobile and tablet.',
      internalNotes: 'Discovery call held on Nov 8. Shared scope document. Awaiting feedback on sprint 1 deliverables.'
    },
    {
      id: 'LEAD-8029',
      date: '2026-11-06',
      name: 'Mathias Lindner',
      company: 'SolarGrid AG (Zurich, Switzerland)',
      email: 'm.lindner@solargrid.ch',
      service: 'maintenance-monthly-growth',
      serviceName: 'Maintenance: Growth & Scale Pod (40h/mo)',
      budget: 'EUR €2,500 – 5,000 / mo',
      status: 'proposal',
      description: 'We require a dedicated senior team pod to maintain our solar battery telemetry API. Sentry alerting, weekly security updates, and direct Slack channel.',
      internalNotes: 'Sent 40h/mo Growth Retainer agreement with 4h critical SLA. European timezone overlap confirmed.'
    },
    {
      id: 'LEAD-8014',
      date: '2026-11-02',
      name: 'Sophie Laurent',
      company: 'Atelier Homeware (Paris / Brussels)',
      email: 'sophie@atelierhomeware.com',
      service: 'web-saas',
      serviceName: 'Web Platforms & E-Commerce',
      budget: 'EUR €10,000 – 25,000',
      status: 'won',
      description: 'Curated wholesale B2B marketplace for independent boutique retailers with tiered volume pricing and Stripe invoice payments.',
      internalNotes: 'Contract signed. Sprint 1 started on Next.js 15 & PostgreSQL HA architecture.'
    }
  ],
  services: [
    {
      id: 'srv-1',
      number: '01. Enterprise Core',
      title: 'Custom Software Development',
      desc: 'When off-the-shelf software falls short of your operational requirements, we engineer bespoke digital platforms from the ground up with reliable domain logic and high performance.',
      tech: 'TypeScript, Node.js, Go, PostgreSQL, Docker, Microservices',
      deliverables: [
        'System architecture blueprints & domain modeling',
        'Bespoke business logic & internal administrative tools',
        'Role-based access control (RBAC) & audit logging',
        'Full source code ownership with modular structure'
      ]
    },
    {
      id: 'srv-2',
      number: '02. Web Applications',
      title: 'Web & SaaS Platforms',
      desc: 'High-converting, responsive web platforms and multi-tenant SaaS products designed for rapid onboarding, low latency, and intuitive customer self-service.',
      tech: 'React, Next.js, Tailwind, Stripe',
      deliverables: [
        'Interactive customer-facing portals',
        'Subscription billing & customer self-service',
        'Responsive UI tested down to 360px'
      ]
    },
    {
      id: 'srv-3',
      number: '03. Native & Cross-Platform',
      title: 'Mobile App Development',
      desc: 'Smooth, offline-capable iOS and Android applications built with Flutter or React Native. Designed to deliver native-grade gestures and background synchronization.',
      tech: 'Flutter, React Native, SQLite, REST',
      deliverables: [
        'Unified codebase for iOS and Android',
        'Offline data caching & background sync',
        'App Store & Google Play submission prep'
      ]
    },
    {
      id: 'srv-4',
      number: '04. Intelligent Workflows',
      title: 'AI & Automation',
      desc: 'Practical, production-grade AI integrations that eliminate repetitive human overhead: automated document parsing, internal knowledge search, and task workflow automation.',
      tech: 'Python, LangChain, Node.js, OCR, Vector Search',
      deliverables: [
        'Custom LLM pipelines & function-calling agents',
        'Automated invoice & PDF document extraction',
        'Structured JSON output validation'
      ]
    },
    {
      id: 'srv-5',
      number: '05. Cloud Infrastructure',
      title: 'Backend & API Engineering',
      desc: 'Resilient backends, RESTful and GraphQL APIs, relational database tuning, and message queue architectures built to sustain heavy traffic spikes securely.',
      tech: 'Node.js, Express, Laravel, PostgreSQL, Redis',
      deliverables: [
        'Documented REST & GraphQL API endpoints',
        'Normalized PostgreSQL & MySQL schema design',
        'OAuth2, JWT authentication & session security'
      ]
    },
    {
      id: 'srv-6',
      number: '06. Long-Term Reliability',
      title: 'Support & Product Improvement',
      desc: 'Software longevity requires vigilant care. We take over existing codebases, refactor accumulated technical debt, upgrade dependencies, and provide proactive ongoing support agreements.',
      tech: 'Sentry, Datadog, Prometheus, Dockerized staging',
      deliverables: [
        'Comprehensive code audit & security assessment',
        'Performance tuning (database indexes, query caching)',
        'Regular dependency patches & zero-downtime updates',
        'Dedicated maintenance SLAs & rapid response times'
      ]
    }
  ],
  portfolio: [
    {
      key: 'nordiclogix',
      image: '/assets/portfolio/nordiclogix-v2.png',
      title: 'NordicLogix',
      badge: 'Concept Project · SaaS / Web',
      industry: 'Freight & Logistics Orchestration',
      categories: 'saas web erp cloud',
      summary: 'Multi-tenant logistics management orchestrator for European cross-border freight forwarders with automated e-CMR documents and GPS route optimization.',
      problem: 'European freight forwarders grapple with fragmented telematics systems, manual paper-based customs consignment notes, and unpredictable border delays that complicate ETA forecasting.',
      solution: 'We architected a unified logistics dashboard that ingests real-time GPS telemetry, automates digital consignment note generation, and recalculates optimal route deviations dynamically.',
      tech: 'TypeScript, React, Node.js, PostgreSQL, Docker, Redis, Leaflet',
      features: [
        'Real-time GPS vehicle tracking with automatic geofence alerts',
        'Digital e-CMR document generation compliant with cross-border protocols',
        'Dynamic multi-stop route optimization and toll cost estimation',
        'Sub-contractor carrier portal with instant proof-of-delivery uploads'
      ]
    },
    {
      key: 'klinikflow',
      image: '/assets/portfolio/klinikflow-v2.png',
      title: 'KlinikFlow',
      badge: 'Concept Project · Web / SaaS',
      industry: 'Outpatient Healthcare Workflow',
      categories: 'saas web erp integration',
      summary: 'Streamlined patient intake and clinical workflow portal engineered for medical practices and outpatient clinics in Germany and the EU.',
      problem: 'Administrative staff and practitioners spend up to 30% of their working hours manually transcribing paper intake forms and managing appointment reschedules.',
      solution: 'Designed an accessible web application allowing patients to securely complete triage questionnaires from home, view estimated wait times, and exchange encrypted records.',
      tech: 'Next.js, TypeScript, Tailwind CSS, PostgreSQL, REST APIs',
      features: [
        'Zero-installation mobile-friendly patient check-in questionnaire',
        'Automated appointment reminder sequences via SMS and email',
        'Role-based clinical dashboard with practitioner handoff notes',
        'Structured export compatible with healthcare record standards'
      ]
    },
    {
      key: 'voltgrid',
      image: '/assets/portfolio/voltgrid-iq-v2.png',
      title: 'VoltGrid IQ',
      badge: 'Concept Project · AI / Web',
      industry: 'Renewable Energy & Battery Telemetry',
      categories: 'ai web cloud',
      summary: 'An intelligent energy telemetry dashboard enabling commercial micro-grid operators to forecast electricity prices and optimize battery dispatch schedules.',
      problem: 'Commercial solar and energy storage systems frequently miss optimal revenue windows because manual dispatch strategies cannot keep pace with hourly fluctuations.',
      solution: 'Built an automated dispatch modeling platform that combines weather forecasts with time-series machine learning models to recommend automated battery cycles.',
      tech: 'Python, Node.js, React, Chart engine, Docker, MQTT',
      features: [
        '24-hour day-ahead European electricity tariff ingestion',
        'Automated peak-shaving recommendations to minimize grid demand surcharges',
        'Real-time inverter telemetry tracking with sub-second alert thresholds'
      ]
    },
    {
      key: 'aurapay',
      image: '/assets/portfolio/aurapay-v2.png',
      title: 'AuraPay',
      badge: 'Concept Project · Mobile / Web',
      industry: 'Cross-Border Fintech & SME Billing',
      categories: 'mobile web integration',
      summary: 'Mobile-first business wallet and reconciliation engine built for digital European SMBs handling multi-currency invoices and instant SEPA transfers.',
      problem: 'Online businesses selling across borders struggle to manually match incoming bank transfers against outstanding VAT invoices, creating tedious accounting backlogs.',
      solution: 'Developed a cross-platform mobile wallet that notifies business owners of incoming SEPA payments in real time and automatically reconciles payments against pending digital invoices.',
      tech: 'React Native, TypeScript, Node.js, MySQL, REST APIs',
      features: [
        'Instant SEPA push notifications with automated customer matching',
        'Multi-currency balance overview with live ECB exchange rates',
        'Integrated PDF invoice creator with dynamic EPC-QR codes'
      ]
    },
    {
      key: 'craftbourse',
      image: '/assets/portfolio/craftbourse-v2.png',
      title: 'CraftBourse',
      badge: 'Concept Project · Web / E-Commerce',
      industry: 'B2B Wholesale Marketplace',
      categories: 'web saas erp',
      summary: 'Curated wholesale marketplace connecting independent European boutique retailers with verified artisanal lifestyle and homeware producers.',
      problem: 'Small-batch manufacturers face high customer acquisition barriers, while retailers struggle to discover vetted regional makers.',
      solution: 'Created a responsive B2B platform with tiered wholesale catalog pricing, sample evaluation workflows, minimum order quantity rules, and automated purchase orders.',
      tech: 'Next.js, TypeScript, Node.js, PostgreSQL, Stripe Payments',
      features: [
        'Verified maker directories with artisan product portfolios',
        'Tiered wholesale pricing engines with dynamic volume discounts',
        'Automated PDF purchase order generation and packing slips'
      ]
    },
    {
      key: 'sensora',
      image: '/assets/portfolio/sensora-field-v2.png',
      title: 'Sensora Field',
      badge: 'Concept Project · Mobile / AI',
      industry: 'Precision Agronomy & Soil Telemetry',
      categories: 'mobile ai cloud',
      summary: 'Offline-first mobile companion app providing agronomists and crop managers with offline soil moisture telemetry and on-device crop health diagnostics.',
      problem: 'Agricultural field workers operating in remote acreage often encounter zero network connectivity, making cloud-only crop inspection tools ineffective.',
      solution: 'Engineered a resilient mobile app that caches local sensor readings locally in SQLite, runs lightweight visual diagnosis on-device, and syncs when reception returns.',
      tech: 'Flutter, SQLite, Dart, On-Device Vision models, REST',
      features: [
        'Offline-first sensor data capture with robust background sync queue',
        'On-device image analysis for crop foliage distress indicators',
        'Localized soil moisture mapping and irrigation timing suggestions'
      ]
    }
  ],
  maintenance: {
    monthly: [
      {
        id: 'tier-m1',
        title: 'Essential Care',
        hours: '20 Hours',
        period: 'per month dedicated',
        pill: 'Uptime & Health',
        sla: '< 8h SLA',
        desc: 'Continuous monitoring, security patches, and emergency triage for live platforms and stable SaaS.',
        featured: false
      },
      {
        id: 'tier-m2',
        title: 'Growth & Scale Pod',
        hours: '40 Hours',
        period: 'per month dedicated',
        pill: 'Most Popular · High Impact',
        sla: '< 4h Critical SLA',
        desc: 'Active sprint velocity, new feature releases, and rapid turnaround for scaling SaaS and web products.',
        featured: true
      },
      {
        id: 'tier-m3',
        title: 'Dedicated Team Pod',
        hours: '160 Hours',
        period: 'full-time team pod',
        pill: 'Dedicated Team',
        sla: '< 1h Emergency SLA',
        desc: 'An entire senior engineering squad integrated directly into your workflow for complex ERP or SaaS.',
        featured: false
      }
    ],
    hourly: [
      {
        id: 'tier-h1',
        title: 'Quick-Fix Sprint',
        hours: '10 Hours',
        period: 'valid for 60 calendar days',
        pill: 'Rapid Hotfix',
        sla: '< 24h Onboarding',
        desc: 'Targeted emergency triage for critical bugs, broken checkouts, API failures, or server issues.',
        featured: false
      },
      {
        id: 'tier-h2',
        title: 'Modernization Pack',
        hours: '25 Hours',
        period: 'valid for 90 calendar days',
        pill: 'Popular Sprint · Modernization',
        sla: 'Priority Kickoff',
        desc: 'Framework upgrades, security debt remediation, Core Web Vitals optimization, and code audits.',
        featured: true
      },
      {
        id: 'tier-h3',
        title: 'Flexible Engineering Bucket',
        hours: '50 Hours',
        period: 'valid for 180 calendar days',
        pill: 'Flexible Backlog',
        sla: 'Zero Lock-In',
        desc: 'An on-demand hours pool for companies with fluctuating backlogs or seasonal feature releases.',
        featured: false
      }
    ]
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'Can you build a product from just an idea?',
      answer: 'Yes. Many client collaborations begin with a conceptual brief or workflow challenge. Through our structured Discovery phase, we translate high-level ideas into concrete architecture blueprints, user journeys, data schemas, and prioritized sprint roadmaps before writing code.'
    },
    {
      id: 'faq-2',
      question: 'Can you improve or modernize an existing application?',
      answer: 'Absolutely. We regularly onboard legacy or inherited codebases. We begin with a comprehensive code audit to evaluate technical debt, test coverage, and security vulnerabilities, followed by strategic refactoring and zero-downtime upgrades.'
    },
    {
      id: 'faq-3',
      question: 'How do you estimate cost and timeline?',
      answer: 'Every project begins with a clear scope definition. Once user stories and technical requirements are agreed, we provide milestone-based sprint roadmaps with transparent deliverables. For ongoing needs, our monthly retainers and hourly packs provide flexible predictability.'
    },
    {
      id: 'faq-4',
      question: 'How do we communicate during development?',
      answer: 'We communicate directly with your team without bureaucratic intermediaries. You have a shared Slack or Microsoft Teams channel, bi-weekly video sprint demos, and direct access to your repository PRs. Our core hours overlap seamlessly with European working hours (CET / BST).'
    },
    {
      id: 'faq-5',
      question: 'Who owns the source code and intellectual property?',
      answer: 'You do—100%. All application source code, designs, and database schemas developed during the project belong entirely to your company. All code is pushed directly to your private GitHub or GitLab repositories under your license.'
    },
    {
      id: 'faq-6',
      question: 'Do you provide support and maintenance after launch?',
      answer: 'Yes. We offer structured monthly maintenance retainers (20h, 40h, and dedicated 160h pods) covering 99.9% uptime monitoring, security updates, database optimizations, and on-demand feature iterations with guaranteed response SLAs.'
    }
  ],
  process: {
    kicker: 'How We Deliver',
    title: 'From first conversation to confident launch.',
    description: 'A clear five-stage process turns your idea into a reliable product—with visible progress, focused collaboration, and no unnecessary surprises.',
    trustBadges: [
      { id: 'trust-1', icon: '🛡️', label: 'GDPR-Compliant', detail: 'Strict EU Data Privacy Standards' },
      { id: 'trust-2', icon: '⚡', label: '99.98% SLA', detail: 'High-Availability EU Infrastructure' },
      { id: 'trust-3', icon: '🔑', label: '100% IP Transfer', detail: 'Full Source Code & License Ownership' },
      { id: 'trust-4', icon: '⏱️', label: 'European Overlap', detail: 'Direct Sync in CET & BST Timezones' }
    ],
    stages: [
      {
        id: 'proc-1',
        step: '01. STAGE',
        title: 'Discover',
        desc: 'We align on core business objectives, define user journeys, assess technical constraints, and agree on an unambiguous functional scope.',
        deliverables: 'Architecture blueprint, user stories, technical feasibility matrix & sprint roadmap.',
        involvement: 'Collaborative discovery sessions and scope confirmation.'
      },
      {
        id: 'proc-2',
        step: '02. STAGE',
        title: 'Design',
        desc: 'We translate technical requirements into clean, accessible design systems and interactive UI prototypes tested for intuitive flows.',
        deliverables: 'Interactive design mockups, responsive component system & clickable user flows.',
        involvement: 'UX feedback rounds and visual approval sign-off.'
      },
      {
        id: 'proc-3',
        step: '03. STAGE',
        title: 'Develop',
        desc: 'We build your application in bi-weekly iterative sprints using modular, typed, and maintainable frontend and backend architectures.',
        deliverables: 'Weekly deployed test builds, clean Git repositories, and automated CI pipelines.',
        involvement: 'Bi-weekly sprint demos and test environment reviews.'
      },
      {
        id: 'proc-4',
        step: '04. STAGE',
        title: 'Test & Launch',
        desc: 'Comprehensive end-to-end integration testing, accessibility verification, and zero-downtime production deployment with container orchestration.',
        deliverables: 'Audited release build, automated health monitoring & production deployment.',
        involvement: 'Final user acceptance testing and release go-ahead.'
      },
      {
        id: 'proc-5',
        step: '05. STAGE',
        title: 'Retain & Scale',
        desc: 'Proactive maintenance, dependency security updates, feature enhancements, and dedicated engineering capacity as your user base expands.',
        deliverables: 'Guaranteed response SLAs, monthly performance audits & dedicated sprint hours.',
        involvement: 'Quarterly roadmap reviews and prioritized feature requests.'
      }
    ]
  },
  techStack: {
    kicker: 'Technical Capabilities',
    title: 'The right technology for lasting products.',
    description: 'We choose proven tools with strong ecosystems—so your product stays fast, maintainable, and ready for what comes next.',
    categories: [
      {
        id: 'cat-1',
        name: 'Frontend Engineering',
        role: 'Responsive web apps, administrative consoles & design systems.',
        tags: ['React', 'Next.js', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vue.js', 'Angular', 'Svelte', 'Storybook']
      },
      {
        id: 'cat-2',
        name: 'Mobile Applications',
        role: 'Cross-platform iOS and Android apps with native device integration.',
        tags: ['Flutter', 'React Native', 'Dart', 'SQLite', 'Push Notifications', 'Swift / iOS', 'Kotlin / Android', 'Expo', 'Firebase']
      },
      {
        id: 'cat-3',
        name: 'Backend & APIs',
        role: 'High-throughput RESTful endpoints, worker queues & service layers.',
        tags: ['Node.js', 'Express', 'Laravel', 'PHP', 'Python', 'REST & GraphQL', 'Go', 'Java / Spring', '.NET / C#', 'NestJS', 'FastAPI', 'WebSockets']
      },
      {
        id: 'cat-4',
        name: 'Data Storage & Caching',
        role: 'Reliable relational data models, transactions & low-latency caches.',
        tags: ['PostgreSQL', 'MySQL', 'Redis', 'Database Migrations', 'MongoDB', 'MariaDB', 'DynamoDB', 'Elasticsearch', 'Supabase']
      },
      {
        id: 'cat-5',
        name: 'Delivery & Cloud DevOps',
        role: 'Automated CI/CD pipelines, container orchestration & low-latency European hosting.',
        tags: ['Docker', 'AWS', 'Hetzner Cloud', 'GitHub Actions', 'Linux / Ubuntu', 'NGINX', 'Cloudflare', 'Sentry Alerting']
      }
    ]
  },
  settings: {
    companyName: 'RSTechwerk',
    inquiryEmail: 'inquiry@rstechwerk.com',
    responseSla: 'We reply to every business inquiry within 24 business hours.',
    ndaText: 'We gladly sign standard mutual NDAs prior to detailed technical discussions.',
    cityOne: 'Berlin (CET)',
    cityTwo: 'Dhaka (BST)',
    metaTitle: 'RSTechwerk – Software Development & Technology Solutions | rstechwerk.com',
    metaDescription: 'RSTechwerk turns ideas into reliable digital products—from discovery and UI/UX design to full-stack engineering, cloud deployment, and ongoing maintenance for German and European businesses.',
    canonicalUrl: 'https://rstechwerk.com/',
    ogImage: 'https://rstechwerk.com/og-preview.png',
    backendBaseUrl: '/api',
    webhookUrl: ''
  }
};

// Global State
let adminState = loadAdminState();

function loadAdminState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_ADMIN_DATA,
        ...parsed,
        process: parsed.process ? { ...DEFAULT_ADMIN_DATA.process, ...parsed.process } : DEFAULT_ADMIN_DATA.process,
        techStack: parsed.techStack ? { ...DEFAULT_ADMIN_DATA.techStack, ...parsed.techStack } : DEFAULT_ADMIN_DATA.techStack
      };
    }
  } catch (e) {
    console.error('Failed to load admin state from localStorage', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_ADMIN_DATA));
}

function saveAdminState() {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminState));
    // Also publish minimal schema to live website key
    localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify({
      hero: adminState.hero,
      services: adminState.services,
      portfolio: adminState.portfolio,
      process: adminState.process,
      techStack: adminState.techStack,
      maintenance: adminState.maintenance,
      faqs: adminState.faqs,
      settings: adminState.settings
    }));
    // Persist editable public content to the API when an authenticated backend
    // session is available. Local storage remains a draft/cache fallback.
    const session = getAdminSession();
    if (session?.token) {
      adminApiFetch('/api/content/site', {
        method: 'PUT',
        body: JSON.stringify({
          hero: adminState.hero,
          services: adminState.services,
          portfolio: adminState.portfolio,
          process: adminState.process,
          techStack: adminState.techStack,
          maintenance: adminState.maintenance,
          faqs: adminState.faqs,
          settings: adminState.settings
        })
      }).catch((error) => console.warn('Could not publish content to API:', error.message));
    }
  } catch (e) {
    console.error('Failed to save admin state to localStorage', e);
  }
}

// Toast notification utility
function showToast(message, type = 'success') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <span style="color: ${type === 'error' ? '#ef4444' : '#10b981'};">●</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

const ADMIN_SESSION_KEY = 'rstechwerk_admin_session';
const PORTFOLIO_IMAGE_FALLBACKS = {
  nordiclogix: '/assets/portfolio/nordiclogix-v2.png', klinikflow: '/assets/portfolio/klinikflow-v2.png',
  voltgrid: '/assets/portfolio/voltgrid-iq-v2.png', aurapay: '/assets/portfolio/aurapay-v2.png',
  craftbourse: '/assets/portfolio/craftbourse-v2.png', sensora: '/assets/portfolio/sensora-field-v2.png'
};

function getAdminSession() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

async function adminApiFetch(path, options = {}) {
  const session = getAdminSession();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  let response;
  try { response = await fetch(path, { ...options, headers }); } catch { throw new Error('API unavailable. Please make sure npm run dev is running and the backend is listening on port 4000.'); }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'API request failed.');
  return result;
}

async function uploadPortfolioImage(file) {
  const session = getAdminSession();
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('/api/uploads/portfolio', {
    method: 'POST',
    headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
    body: formData
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Image upload failed.');
  return result.imageUrl;
}

async function loadRemoteAdminContent() {
  try {
    const result = await adminApiFetch('/api/content');
    const remote = result.content?.site;
    if (!remote || typeof remote !== 'object') {
      await publishAdminContentToApi();
      return;
    }
    adminState = {
      ...adminState,
      ...remote,
      process: remote.process ? { ...adminState.process, ...remote.process } : adminState.process,
      techStack: remote.techStack ? { ...adminState.techStack, ...remote.techStack } : adminState.techStack,
      maintenance: remote.maintenance || adminState.maintenance,
      faqs: Array.isArray(remote.faqs) ? remote.faqs : adminState.faqs,
      settings: remote.settings ? { ...adminState.settings, ...remote.settings } : adminState.settings
    };
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminState));
    localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(remote));
    console.info('Loaded published content from database.');
  } catch (error) {
    console.warn('Remote content unavailable; using local admin draft.', error.message);
  }
}

function publishAdminContentToApi() {
  return adminApiFetch('/api/content/site', {
    method: 'PUT',
    body: JSON.stringify({
      hero: adminState.hero,
      services: adminState.services,
      portfolio: adminState.portfolio,
      process: adminState.process,
      techStack: adminState.techStack,
      maintenance: adminState.maintenance,
      faqs: adminState.faqs,
      settings: adminState.settings
    })
  });
}

function formatStaffRoleLabel(role) {
  const map = {
    Administrator: 'Primary Admin',
    admin: 'Admin',
    sub_admin: 'Sub-Admin',
    developer: 'Developer',
    manager: 'Manager'
  };
  return map[role] || role || 'Staff';
}

function updateTopbarUserBadge(user) {
  if (!user) return;
  const displayName = user.fullName || user.name || user.email || 'Admin Lead';
  const nameEl = document.getElementById('adminUserName');
  const avatarEl = document.getElementById('adminUserAvatar');
  const roleEl = document.getElementById('adminUserRole');
  if (nameEl) nameEl.textContent = displayName;
  if (roleEl && user.role) roleEl.textContent = formatStaffRoleLabel(user.role);
  if (avatarEl) {
    const parts = displayName.trim().split(/\s+/);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : displayName.slice(0, 2);
    avatarEl.textContent = initials.toUpperCase();
  }
}

function checkAdminAuth() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      window.location.href = '/login.html?redirect=admin';
      return false;
    }
    const session = JSON.parse(raw);
    if (!session || !session.token) {
      window.location.href = '/login.html?redirect=admin';
      return false;
    }
    updateTopbarUserBadge(session);
    return true;
  } catch (e) {
    window.location.href = '/login.html?redirect=admin';
    return false;
  }
}

async function verifyAdminSession() {
  try {
    const result = await adminApiFetch('/api/auth/me');
    if (!['Administrator', 'admin', 'sub_admin', 'manager', 'developer'].includes(result.user?.role)) {
      throw new Error('Staff access required.');
    }
    updateTopbarUserBadge(result.user);
    return true;
  } catch (error) {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.href = '/login.html?redirect=admin';
    return false;
  }
}

function initAdminLogout() {
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const sidebarLogout = document.getElementById('sidebarLogoutBtn');

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    showToast('Signed out successfully. Redirecting to console login...', 'success');
    window.location.href = '/login.html?redirect=admin';
  };

  if (logoutBtn && !logoutBtn.dataset.logoutBound) {
    logoutBtn.dataset.logoutBound = 'true';
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (sidebarLogout && !sidebarLogout.dataset.logoutBound) {
    sidebarLogout.dataset.logoutBound = 'true';
    sidebarLogout.addEventListener('click', handleLogout);
  }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  initAdminLogout();
  if (!checkAdminAuth()) return;
  if (!(await verifyAdminSession())) return;

  await loadRemoteAdminContent();

  initThemeToggle();
  initSidebarAndTabs();
  initGlobalSearch();
  initDashboard();
  initInquiriesModule();
  initDeliveryWorkspace();
  initHeroModule();
  initServicesModule();
  initPortfolioModule();
  initProcessModule();
  initMaintenanceModule();
  initTechStackModule();
  initFaqModule();
  initSeoLiveModule();
  initSettingsModule();
  initApiModule();
  initResetDataHandler();

  // Check if an inquiry was recently submitted from index.html
  checkForNewPublicInquiry();
});

async function initDeliveryWorkspace() {
  const clientForm = document.getElementById('clientCreateForm');
  const projectForm = document.getElementById('projectCreateForm');
  const refresh = document.getElementById('refreshDeliveryBtn');
  const refreshUsersBtn = document.getElementById('refreshUsersBtn');
  const clientSelect = document.getElementById('projectClientSelect');
  const proposalClientSelect = document.getElementById('proposalClientSelect');
  const maintenanceClientSelect = document.getElementById('maintenanceClientSelect');
  const maintenanceProjectSelect = document.getElementById('maintenanceProjectSelect');
  const passwordInput = document.getElementById('clientPassword');

  const deliveryState = {
    clients: [],
    staff: [],
    canManageTeam: false,
    canAssignAdmin: false,
    projects: [],
    proposals: [],
    maintenance: [],
    activeSubtab: 'projects',
    usersSubtab: 'clients',
    projectQuery: '',
    projectStatus: 'all',
    proposalQuery: '',
    proposalStatus: 'all',
    maintenanceQuery: '',
    userQuery: '',
    userStatus: 'all',
    staffQuery: '',
    staffRole: 'all',
    expandedProjects: new Set()
  };

  function generateSecurePassword() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const values = crypto.getRandomValues(new Uint32Array(16));
    return Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
  }

  function formatOpsMoney(amount, currency = 'EUR') {
    const code = String(currency || 'EUR').toUpperCase();
    return `${escapeHtml(code)} ${Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function formatOpsDate(value) {
    if (!value) return 'Not set';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return escapeHtml(value);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatOpsStatus(status) {
    if (!status) return 'Unknown';
    return String(status).replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function getOpsStatusClass(status) {
    const s = String(status || '').toLowerCase();
    if (['active', 'paid', 'approved', 'accepted', 'completed'].includes(s)) return 'success';
    if (['sent', 'submitted', 'client_review', 'testing', 'in_progress'].includes(s)) return 'info';
    if (['draft', 'pending', 'payment_pending', 'on_hold', 'revision_requested'].includes(s)) return 'warn';
    if (['suspended', 'inactive', 'rejected', 'overdue', 'cancelled', 'expired'].includes(s)) return 'danger';
    return '';
  }

  function renderOpsTag(status) {
    return `<span class="ops-status-tag ${getOpsStatusClass(status)}">${escapeHtml(formatOpsStatus(status))}</span>`;
  }

  // Reusable Action Modal Controller
  const actionModal = document.getElementById('deliveryActionModal');
  const actionModalForm = document.getElementById('deliveryActionModalForm');
  const actionModalKicker = document.getElementById('deliveryModalKicker');
  const actionModalTitle = document.getElementById('deliveryModalTitle');
  const actionModalBody = document.getElementById('deliveryActionModalBody');
  const actionModalSubmit = document.getElementById('submitDeliveryActionModalBtn');
  let activeModalSubmitHandler = null;

  function closeDeliveryActionModal() {
    if (!actionModal) return;
    actionModal.classList.remove('open');
    activeModalSubmitHandler = null;
    if (actionModalBody) actionModalBody.innerHTML = '';
  }

  function openDeliveryActionModal({ kicker, title, submitLabel = 'Save', bodyHtml, onSubmit }) {
    if (!actionModal) return;
    if (actionModalKicker) actionModalKicker.textContent = kicker || 'Workspace Action';
    if (actionModalTitle) actionModalTitle.textContent = title || 'Action';
    if (actionModalSubmit) {
      actionModalSubmit.textContent = submitLabel;
      actionModalSubmit.disabled = false;
    }
    if (actionModalBody) actionModalBody.innerHTML = bodyHtml || '';
    activeModalSubmitHandler = onSubmit;
    actionModal.classList.add('open');
    const firstInput = actionModalBody?.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  }

  document.getElementById('closeDeliveryActionModalBtn')?.addEventListener('click', closeDeliveryActionModal);
  document.getElementById('cancelDeliveryActionModalBtn')?.addEventListener('click', closeDeliveryActionModal);
  actionModal?.addEventListener('click', (event) => {
    if (event.target === actionModal) closeDeliveryActionModal();
  });

  actionModalForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!activeModalSubmitHandler) return;
    if (actionModalSubmit) actionModalSubmit.disabled = true;
    try {
      await activeModalSubmitHandler(new FormData(actionModalForm));
      closeDeliveryActionModal();
    } catch (error) {
      showToast(error.message || 'Action failed.', 'error');
      if (actionModalSubmit) actionModalSubmit.disabled = false;
    }
  });

  // Sub-tab Switching
  function switchDeliverySubtab(subtab, focusCardId = null) {
    deliveryState.activeSubtab = subtab;
    document.querySelectorAll('[data-delivery-subtab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.deliverySubtab === subtab);
    });
    const map = {
      projects: 'deliverySubpanelProjects',
      proposals: 'deliverySubpanelProposals',
      maintenance: 'deliverySubpanelMaintenance',
      create: 'deliverySubpanelCreate'
    };
    Object.entries(map).forEach(([key, panelId]) => {
      document.getElementById(panelId)?.classList.toggle('active', key === subtab);
    });
    if (focusCardId) {
      setTimeout(() => {
        const card = document.getElementById(focusCardId);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.querySelector('input, select')?.focus();
        }
      }, 60);
    }
  }

  document.querySelectorAll('[data-delivery-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => switchDeliverySubtab(btn.dataset.deliverySubtab));
  });

  document.querySelectorAll('[data-delivery-quick-create]').forEach((btn) => {
    btn.addEventListener('click', () => switchDeliverySubtab('create', btn.dataset.deliveryQuickCreate));
  });

  document.getElementById('usersCreateClientBtn')?.addEventListener('click', () => {
    document.querySelector('.nav-tab-btn[data-tab="tab-delivery"]')?.click();
    switchDeliverySubtab('create', 'clientCreateCard');
  });

  // Password Generator on Client Create Form
  document.getElementById('generateClientPassword')?.addEventListener('click', () => {
    passwordInput.value = generateSecurePassword();
    passwordInput.type = 'text';
  });
  document.getElementById('toggleClientPassword')?.addEventListener('click', (event) => {
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    event.currentTarget.textContent = visible ? '◉' : '○';
    event.currentTarget.title = visible ? 'Show password' : 'Hide password';
  });

  function switchUsersSubtab(subtab) {
    deliveryState.usersSubtab = subtab;
    document.querySelectorAll('[data-users-subtab]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.usersSubtab === subtab);
    });
    document.getElementById('usersSubpanelClients')?.classList.toggle('active', subtab === 'clients');
    document.getElementById('usersSubpanelStaff')?.classList.toggle('active', subtab === 'staff');
  }

  document.querySelectorAll('[data-users-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => switchUsersSubtab(btn.dataset.usersSubtab));
  });

  function openAddStaffModal() {
    if (!deliveryState.canManageTeam) {
      showToast('Only administrators or sub-admins can create internal accounts.', 'error');
      return;
    }
    const adminOption = deliveryState.canAssignAdmin ? '<option value="admin">Admin (Full Console)</option>' : '';
    openDeliveryActionModal({
      kicker: 'Internal Team Access',
      title: 'Add Sub-Admin or Developer',
      submitLabel: 'Create Team Account',
      bodyHtml: `
        <div class="form-group">
          <label class="form-label" for="modalStaffFullName">Full Name</label>
          <input type="text" id="modalStaffFullName" name="fullName" class="form-input" required placeholder="e.g. Tariq Hasan" />
        </div>
        <div class="form-grid two-col">
          <div class="form-group">
            <label class="form-label" for="modalStaffEmail">Work Email</label>
            <input type="email" id="modalStaffEmail" name="email" class="form-input" required placeholder="dev@rstechwerk.com" />
          </div>
          <div class="form-group">
            <label class="form-label" for="modalStaffRole">Console Role</label>
            <select id="modalStaffRole" name="role" class="form-select">
              <option value="developer">Developer</option>
              <option value="sub_admin">Sub-Admin</option>
              <option value="manager">Delivery Manager</option>
              ${adminOption}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="modalStaffPassword">Temporary Password (min. 10 characters)</label>
          <div class="password-field">
            <input type="text" id="modalStaffPassword" name="password" class="form-input" minlength="10" required placeholder="Enter or generate password" />
            <button type="button" class="password-action" id="modalGenStaffPwdBtn" style="right:0.75rem;">Generate</button>
          </div>
          <span class="form-help-text">Share these credentials securely. They sign in via the Admin &amp; Team Console login page.</span>
        </div>
      `,
      onSubmit: async (formData) => {
        await adminApiFetch('/api/staff', {
          method: 'POST',
          body: JSON.stringify({
            fullName: String(formData.get('fullName') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            role: String(formData.get('role') || 'developer'),
            password: String(formData.get('password') || '')
          })
        });
        showToast('Team account created successfully.');
        await loadDeliveryData();
        switchUsersSubtab('staff');
      }
    });
    document.getElementById('modalGenStaffPwdBtn')?.addEventListener('click', () => {
      const inp = document.getElementById('modalStaffPassword');
      if (inp) inp.value = generateSecurePassword();
    });
  }

  document.getElementById('usersAddStaffBtn')?.addEventListener('click', openAddStaffModal);
  document.getElementById('staffPanelAddBtn')?.addEventListener('click', openAddStaffModal);

  // KPI & Segmented Counts Renderer
  function updateWorkspaceKpis() {
    const { clients, staff, projects, proposals, maintenance } = deliveryState;
    const activeProjects = projects.filter((p) => !['completed', 'cancelled'].includes(p.status));
    const openOffers = proposals.filter((p) => ['draft', 'sent'].includes(p.status));
    const activeMaint = maintenance.filter((m) => m.status === 'active');
    const activeClients = clients.filter((c) => c.status === 'active');
    const suspendedClients = clients.filter((c) => c.status !== 'active');
    const activeStaff = staff.filter((member) => (member.status || 'active') === 'active');
    const totalRunningEngagements = clients.reduce((sum, c) => sum + Number(c.activeProjectCount || 0), 0);

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl('kpiDeliveryProjects', String(activeProjects.length));
    setEl('kpiDeliveryProjectsMeta', `${projects.length} total workspace${projects.length === 1 ? '' : 's'}`);
    setEl('kpiDeliveryOffers', String(openOffers.length));
    setEl('kpiDeliveryOffersMeta', `${proposals.length} proposal${proposals.length === 1 ? '' : 's'} on file`);
    setEl('kpiDeliveryMaintenance', String(activeMaint.length));
    setEl('kpiDeliveryMaintenanceMeta', `${maintenance.length} contract${maintenance.length === 1 ? '' : 's'} on file`);
    setEl('kpiDeliveryClients', String(clients.length));
    setEl('kpiDeliveryClientsMeta', `${activeClients.length} active portal user${activeClients.length === 1 ? '' : 's'}`);

    setEl('deliveryCountProjects', String(projects.length));
    setEl('deliveryCountProposals', String(proposals.length));
    setEl('deliveryCountMaintenance', String(maintenance.length));

    setEl('kpiUsersTotal', String(clients.length));
    setEl('kpiUsersSuspendedMeta', `${suspendedClients.length} suspended / inactive`);
    setEl('kpiUsersActive', String(activeClients.length));
    setEl('kpiUsersStaffTotal', String(staff.length));
    setEl('kpiUsersStaffMeta', `${activeStaff.length} active internal user${activeStaff.length === 1 ? '' : 's'}`);
    setEl('kpiUsersProjects', String(totalRunningEngagements));
    setEl('kpiUsersProjectsMeta', `${projects.length} total client project${projects.length === 1 ? '' : 's'}`);
    setEl('usersCountClients', String(clients.length));
    setEl('usersCountStaff', String(staff.length));

    const addButtons = [document.getElementById('usersAddStaffBtn'), document.getElementById('staffPanelAddBtn')];
    addButtons.forEach((btn) => {
      if (btn) btn.style.display = deliveryState.canManageTeam ? '' : 'none';
    });
  }

  // Renderers
  function getStaffRoleTagClass(role) {
    if (role === 'Administrator' || role === 'admin') return 'success';
    if (role === 'sub_admin') return 'info';
    if (role === 'developer') return '';
    return 'warn';
  }

  function renderStaffAccountsTable() {
    const container = document.getElementById('staffAccountsContainer');
    if (!container) return;
    const session = getAdminSession();
    const q = deliveryState.staffQuery.trim().toLowerCase();
    const filtered = deliveryState.staff.filter((member) => {
      const matchesRole = deliveryState.staffRole === 'all' || member.role === deliveryState.staffRole;
      const matchesQuery =
        !q ||
        (member.fullName || '').toLowerCase().includes(q) ||
        (member.email || '').toLowerCase().includes(q) ||
        formatStaffRoleLabel(member.role).toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });

    if (!filtered.length) {
      container.innerHTML = `<div class="ops-empty-box"><strong>${
        deliveryState.staff.length ? 'No matching team members' : 'No sub-admins or developers added yet'
      }</strong><p>${
        deliveryState.staff.length
          ? 'Try adjusting your search query or role filter.'
          : 'Click + Add Sub-Admin / Dev to create dedicated console accounts for developers and managers.'
      }</p></div>`;
      return;
    }

    container.innerHTML = `
      <table class="admin-table ops-responsive-table">
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Console Role</th>
            <th>Access Status</th>
            <th>Added On</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map((member) => {
              const memberStatus = member.status || 'active';
              const isSelf = session?.id && member.id === session.id;
              const isPrimaryAdmin = member.role === 'Administrator' || member.role === 'admin';
              const canEditRow = deliveryState.canManageTeam && (!isPrimaryAdmin || deliveryState.canAssignAdmin);
              const displayName = member.fullName || member.email.split('@')[0];
              return `
                <tr>
                  <td data-label="Team Member">
                    <strong style="color:var(--admin-text-primary);display:block;">${escapeHtml(displayName)}${
                      isSelf ? ' <span style="font-size:0.72rem;color:var(--admin-accent);font-weight:600;">(You)</span>' : ''
                    }</strong>
                    <span class="ops-tabular" style="font-size:0.78rem;color:var(--admin-text-muted);overflow-wrap:anywhere;">${escapeHtml(member.email)}</span>
                  </td>
                  <td data-label="Role">
                    <span class="ops-status-tag ${getStaffRoleTagClass(member.role)}">${escapeHtml(formatStaffRoleLabel(member.role))}</span>
                  </td>
                  <td data-label="Status">${renderOpsTag(memberStatus)}</td>
                  <td data-label="Added On" class="ops-tabular">${formatOpsDate(member.createdAt)}</td>
                  <td data-label="Actions" style="text-align:right;">
                    <div class="ops-table-actions">
                      ${
                        canEditRow
                          ? `
                        <button type="button" class="btn btn-secondary btn-sm staff-edit-btn" data-staff="${escapeHtml(member.id)}">Edit Role</button>
                        ${
                          !isSelf
                            ? `<button type="button" class="btn btn-secondary btn-sm staff-status-btn" data-staff="${escapeHtml(member.id)}" data-status="${
                                memberStatus === 'active' ? 'suspended' : 'active'
                              }">${memberStatus === 'active' ? 'Suspend' : 'Activate'}</button>`
                            : ''
                        }
                        <button type="button" class="btn btn-secondary btn-sm staff-password-btn" data-staff="${escapeHtml(member.id)}" data-name="${escapeHtml(
                              displayName
                            )}">Reset Password</button>
                        ${
                          !isSelf
                            ? `<button type="button" class="btn btn-secondary btn-sm staff-delete-btn" data-staff="${escapeHtml(
                                member.id
                              )}" data-name="${escapeHtml(displayName)}" style="color:#ef4444;">Remove</button>`
                            : ''
                        }
                      `
                          : '<span style="font-size:0.76rem;color:var(--admin-text-subtle);">Protected / View Only</span>'
                      }
                    </div>
                  </td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
    `;
  }
  function renderClientAccountsTable() {
    const container = document.getElementById('clientAccountsContainer');
    if (!container) return;
    const q = deliveryState.userQuery.trim().toLowerCase();
    const filtered = deliveryState.clients.filter((client) => {
      const matchesStatus =
        deliveryState.userStatus === 'all' ||
        (deliveryState.userStatus === 'suspended' ? client.status !== 'active' : client.status === deliveryState.userStatus);
      const matchesQuery =
        !q ||
        (client.companyName || '').toLowerCase().includes(q) ||
        (client.contactName || '').toLowerCase().includes(q) ||
        (client.email || '').toLowerCase().includes(q) ||
        (client.country || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });

    if (!filtered.length) {
      container.innerHTML = `<div class="ops-empty-box"><strong>${
        deliveryState.clients.length ? 'No matching client accounts' : 'No client accounts yet'
      }</strong><p>${
        deliveryState.clients.length
          ? 'Try adjusting your search query or status filter.'
          : 'Provision your first client portal account to grant secure project access.'
      }</p></div>`;
      return;
    }

    container.innerHTML = `
      <table class="admin-table ops-responsive-table">
        <thead>
          <tr>
            <th>Organization &amp; Contact</th>
            <th>Email &amp; Phone</th>
            <th>Engagements</th>
            <th>Access Status</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (client) => `
            <tr>
              <td data-label="Organization">
                <strong style="color:var(--admin-text-primary);display:block;">${escapeHtml(client.companyName)}</strong>
                <span style="font-size:0.78rem;color:var(--admin-text-muted);">${escapeHtml(client.contactName)}${
                client.country ? ` · ${escapeHtml(client.country)}` : ''
              }</span>
              </td>
              <td data-label="Contact">
                <span class="ops-tabular" style="font-size:0.8rem;color:var(--admin-text-primary);display:block;overflow-wrap:anywhere;">${escapeHtml(client.email)}</span>
                <span style="font-size:0.76rem;color:var(--admin-text-muted);">${escapeHtml(client.phone || 'No phone on file')}</span>
              </td>
              <td data-label="Engagements" class="ops-tabular">
                <strong style="color:var(--admin-accent);">${Number(client.activeProjectCount || 0)}</strong>
                <span style="color:var(--admin-text-muted);"> running · ${Number(client.projectCount || 0)} total</span>
              </td>
              <td data-label="Status">${renderOpsTag(client.status)}</td>
              <td data-label="Actions" style="text-align:right;">
                <div class="ops-table-actions">
                  <button type="button" class="btn btn-secondary btn-sm client-edit-btn" data-client="${escapeHtml(client.id)}">Edit Profile</button>
                  <button type="button" class="btn btn-secondary btn-sm client-status-btn" data-client="${escapeHtml(client.id)}" data-status="${
                client.status === 'active' ? 'suspended' : 'active'
              }">${client.status === 'active' ? 'Suspend' : 'Activate'}</button>
                  <button type="button" class="btn btn-secondary btn-sm client-password-btn" data-client="${escapeHtml(client.id)}" data-name="${escapeHtml(
                client.companyName
              )}">Reset Password</button>
                </div>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  function renderProposalsTable() {
    const container = document.getElementById('proposalsContainer');
    if (!container) return;
    const q = deliveryState.proposalQuery.trim().toLowerCase();
    const filtered = deliveryState.proposals.filter((p) => {
      const matchesStatus = deliveryState.proposalStatus === 'all' || p.status === deliveryState.proposalStatus;
      const matchesQuery =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.companyName || '').toLowerCase().includes(q) ||
        (p.scope || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });

    if (!filtered.length) {
      container.innerHTML = `<div class="ops-empty-box"><strong>${
        deliveryState.proposals.length ? 'No matching proposals' : 'No offers or proposals yet'
      }</strong><p>Prepare a new client proposal in Create &amp; Onboarding.</p></div>`;
      return;
    }

    container.innerHTML = `
      <table class="admin-table ops-responsive-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Proposal &amp; Scope</th>
            <th>Amount</th>
            <th>Status</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (proposal) => `
            <tr>
              <td data-label="Client" style="font-weight:600;color:var(--admin-text-primary);white-space:nowrap;">${escapeHtml(proposal.companyName)}</td>
              <td data-label="Proposal">
                <strong style="color:var(--admin-text-primary);display:block;">${escapeHtml(proposal.title)}</strong>
                <span style="font-size:0.78rem;color:var(--admin-text-muted);display:block;max-width:52ch;">${escapeHtml(
                  proposal.scope.length > 130 ? proposal.scope.slice(0, 130) + '…' : proposal.scope
                )}</span>
              </td>
              <td data-label="Amount" class="ops-tabular" style="font-weight:700;color:var(--admin-text-primary);white-space:nowrap;">${formatOpsMoney(
                proposal.totalAmount,
                proposal.currency
              )}</td>
              <td data-label="Status">${renderOpsTag(proposal.status)}</td>
              <td data-label="Actions" style="text-align:right;">
                <div class="ops-table-actions">
                  ${
                    proposal.status === 'draft'
                      ? `<button type="button" class="btn btn-secondary btn-sm proposal-status-btn" data-proposal="${escapeHtml(
                          proposal.id
                        )}" data-status="sent">Send Offer</button>`
                      : ''
                  }
                  ${
                    proposal.status === 'accepted'
                      ? `<button type="button" class="btn btn-primary btn-sm proposal-project-btn" data-client="${escapeHtml(
                          proposal.clientId
                        )}" data-proposal="${escapeHtml(proposal.id)}" data-title="${escapeHtml(proposal.title)}">Create Project</button>`
                      : ''
                  }
                  ${
                    proposal.status !== 'draft' && proposal.status !== 'accepted'
                      ? `<span style="font-size:0.78rem;color:var(--admin-text-subtle);">—</span>`
                      : ''
                  }
                </div>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  function renderMaintenanceTable() {
    const container = document.getElementById('maintenanceContractsContainer');
    if (!container) return;
    const q = deliveryState.maintenanceQuery.trim().toLowerCase();
    const filtered = deliveryState.maintenance.filter((item) => {
      return (
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.projectName || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
      );
    });

    if (!filtered.length) {
      container.innerHTML = `<div class="ops-empty-box"><strong>${
        deliveryState.maintenance.length ? 'No matching maintenance contracts' : 'No maintenance contracts yet'
      }</strong><p>Add recurring or on-demand support retainers under Create &amp; Onboarding.</p></div>`;
      return;
    }

    container.innerHTML = `
      <table class="admin-table ops-responsive-table">
        <thead>
          <tr>
            <th>Contract &amp; Scope</th>
            <th>Linked Project</th>
            <th>Billing</th>
            <th>Rate</th>
            <th>Next Billing</th>
            <th>Status</th>
            <th style="text-align:right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (item) => `
            <tr>
              <td data-label="Contract">
                <strong style="color:var(--admin-text-primary);display:block;">${escapeHtml(item.title)}</strong>
                <span style="font-size:0.78rem;color:var(--admin-text-muted);">${escapeHtml(
                  item.description || 'Ongoing software maintenance and SLA coverage'
                )}</span>
              </td>
              <td data-label="Project">${escapeHtml(item.projectName || 'Account-level service')}</td>
              <td data-label="Billing">${escapeHtml(formatOpsStatus(item.billingType))}</td>
              <td data-label="Rate" class="ops-tabular" style="font-weight:700;color:var(--admin-text-primary);white-space:nowrap;">${formatOpsMoney(
                item.amount,
                item.currency
              )}</td>
              <td data-label="Next Billing" class="ops-tabular">${formatOpsDate(item.nextBillingDate)}</td>
              <td data-label="Status">${renderOpsTag(item.status)}</td>
              <td data-label="Action" style="text-align:right;">
                <div class="ops-table-actions">
                  <button type="button" class="btn btn-secondary btn-sm maintenance-invoice-btn" data-maintenance="${escapeHtml(
                    item.id
                  )}" data-title="${escapeHtml(item.title)}">Generate Invoice</button>
                </div>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  function renderProjectsList() {
    const container = document.getElementById('deliveryProjectsContainer');
    if (!container) return;
    const q = deliveryState.projectQuery.trim().toLowerCase();
    const filtered = deliveryState.projects.filter((project) => {
      const matchesStatus = deliveryState.projectStatus === 'all' || project.status === deliveryState.projectStatus;
      const matchesQuery =
        !q ||
        (project.name || '').toLowerCase().includes(q) ||
        (project.companyName || '').toLowerCase().includes(q) ||
        (project.description || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });

    if (!filtered.length) {
      container.innerHTML = `<div class="ops-empty-box"><strong>${
        deliveryState.projects.length ? 'No matching projects' : 'No projects created yet'
      }</strong><p>${
        deliveryState.projects.length
          ? 'Clear your search or status filter to view all workspaces.'
          : 'Click + New Project above to create your first client workspace.'
      }</p></div>`;
      return;
    }

    container.innerHTML = filtered
      .map((project) => {
        const pct = Math.min(100, Math.max(0, Number(project.progress) || 0));
        const isExpanded = deliveryState.expandedProjects.has(project.id);
        return `
          <article class="ops-project-card ${isExpanded ? 'is-highlight' : ''}">
            <div class="ops-project-head">
              <div class="ops-project-main">
                <div class="ops-project-title-row">
                  <h3 class="ops-project-title">${escapeHtml(project.name)}</h3>
                  ${renderOpsTag(project.status)}
                </div>
                <div class="ops-project-meta">
                  <span>${escapeHtml(project.companyName)}</span>
                  <span aria-hidden="true">·</span>
                  <span class="ops-tabular">Due ${formatOpsDate(project.dueDate)}</span>
                </div>
                <p class="ops-project-desc">${escapeHtml(project.description || 'No project description provided.')}</p>
                <div class="ops-project-progress-row">
                  <div class="ops-progress-track"><div class="ops-progress-fill" style="width:${pct}%"></div></div>
                  <span class="ops-tabular" style="font-size:0.8rem;font-weight:700;color:var(--admin-accent);">${pct}% complete</span>
                </div>
              </div>
              <div class="ops-project-actions">
                <button type="button" class="btn ${isExpanded ? 'btn-primary' : 'btn-secondary'} btn-sm delivery-open-btn" data-project="${escapeHtml(
          project.id
        )}">${isExpanded ? 'Hide Workspace' : 'Manage Workspace'}</button>
                <button type="button" class="btn btn-secondary btn-sm delivery-progress-btn" data-project="${escapeHtml(
          project.id
        )}" data-name="${escapeHtml(project.name)}" data-status="${escapeHtml(project.status)}" data-progress="${pct}">Update Progress</button>
                <button type="button" class="btn btn-secondary btn-sm delivery-milestone-btn" data-project="${escapeHtml(
          project.id
        )}" data-name="${escapeHtml(project.name)}">+ Milestone</button>
                <button type="button" class="btn btn-secondary btn-sm delivery-update-btn" data-project="${escapeHtml(
          project.id
        )}" data-name="${escapeHtml(project.name)}">Post Update</button>
              </div>
            </div>
            <div class="ops-project-detail ${isExpanded ? 'open' : ''}" id="delivery-detail-${escapeHtml(project.id)}"></div>
          </article>
        `;
      })
      .join('');

    // Rehydrate any already-expanded workspaces
    deliveryState.expandedProjects.forEach((projectId) => {
      if (filtered.some((p) => p.id === projectId)) {
        loadProjectWorkspaceDetail(projectId);
      }
    });
  }

  async function loadProjectWorkspaceDetail(projectId) {
    const detail = document.getElementById(`delivery-detail-${projectId}`);
    if (!detail) return;
    detail.innerHTML = '<div style="padding:1.25rem;" class="form-help-text">Loading workspace details…</div>';
    try {
      const [milestones, updates, files, invoices] = await Promise.all([
        adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/milestones`),
        adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/updates`),
        adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/files`),
        adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/invoices`)
      ]);

      const msList = milestones.milestones || [];
      const invList = invoices.invoices || [];
      const updList = updates.updates || [];
      const fileList = files.files || [];

      const milestoneHtml = msList.length
        ? msList
            .map(
              (item) => `
          <div class="ops-detail-item">
            <div>
              <span class="ops-detail-item-title">${escapeHtml(item.title)}</span>
              <span class="ops-detail-item-sub ops-tabular">${formatOpsMoney(item.amount, item.currency)} · Due ${formatOpsDate(
                item.dueDate
              )}</span>
            </div>
            ${renderOpsTag(item.status)}
          </div>`
            )
            .join('')
        : '<span class="form-help-text">No milestones scheduled yet.</span>';

      const invoiceHtml = invList.length
        ? invList
            .map(
              (inv) => `
          <div class="ops-detail-item">
            <div>
              <span class="ops-detail-item-title ops-tabular">${escapeHtml(inv.invoiceNumber)}</span>
              <span class="ops-detail-item-sub">${escapeHtml(inv.description)} · ${formatOpsMoney(inv.amount, inv.currency)}</span>
            </div>
            ${renderOpsTag(inv.status)}
          </div>`
            )
            .join('')
        : '<span class="form-help-text">No invoices created yet.</span>';

      const updateHtml = updList.length
        ? updList
            .map(
              (item) => `
          <div class="ops-detail-item">
            <div>
              <span class="ops-detail-item-title">${escapeHtml(item.title)}</span>
              <span class="ops-detail-item-sub">${escapeHtml(item.body)}</span>
            </div>
            <small class="ops-tabular" style="color:var(--admin-text-subtle);white-space:nowrap;">${formatOpsDate(item.createdAt)}</small>
          </div>`
            )
            .join('')
        : '<span class="form-help-text">No delivery updates posted yet.</span>';

      const fileHtml = fileList.length
        ? fileList
            .map(
              (file) => `
          <div class="ops-detail-item">
            <div>
              <span class="ops-detail-item-title">${escapeHtml(file.originalName)}</span>
              <span class="ops-detail-item-sub ops-tabular">${Math.max(1, Math.ceil(Number(file.fileSize || 0) / 1024))} KB · ${
                file.visibleToClient ? 'Visible to client' : 'Internal only'
              }</span>
            </div>
          </div>`
            )
            .join('')
        : '<span class="form-help-text">No files uploaded yet.</span>';

      detail.innerHTML = `
        <div class="ops-detail-grid">
          <div class="ops-detail-pane">
            <div class="ops-detail-pane-header">
              <span class="ops-detail-pane-title">Milestones (${msList.length})</span>
              <button type="button" class="btn btn-secondary btn-sm delivery-milestone-btn" data-project="${escapeHtml(projectId)}">+ Add Milestone</button>
            </div>
            <div class="ops-detail-list">${milestoneHtml}</div>
          </div>
          <div class="ops-detail-pane">
            <div class="ops-detail-pane-header">
              <span class="ops-detail-pane-title">Invoices (${invList.length})</span>
              <button type="button" class="btn btn-secondary btn-sm delivery-invoice-btn" data-project="${escapeHtml(projectId)}">+ Create Invoice</button>
            </div>
            <div class="ops-detail-list">${invoiceHtml}</div>
          </div>
          <div class="ops-detail-pane">
            <div class="ops-detail-pane-header">
              <span class="ops-detail-pane-title">Client Updates (${updList.length})</span>
              <button type="button" class="btn btn-secondary btn-sm delivery-update-btn" data-project="${escapeHtml(projectId)}">+ Post Update</button>
            </div>
            <div class="ops-detail-list">${updateHtml}</div>
          </div>
          <div class="ops-detail-pane">
            <div class="ops-detail-pane-header">
              <span class="ops-detail-pane-title">Shared Files (${fileList.length})</span>
            </div>
            <div class="ops-detail-list">${fileHtml}</div>
            <div class="ops-upload-bar">
              <input type="file" class="delivery-file-input" accept="application/pdf,image/jpeg,image/png,image/webp,.zip,.docx,.xlsx" data-project="${escapeHtml(
                projectId
              )}">
              <label class="ops-upload-check"><input type="checkbox" class="delivery-file-visible" checked> Visible to client</label>
              <button type="button" class="btn btn-secondary btn-sm delivery-upload-btn" data-project="${escapeHtml(projectId)}">Upload</button>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      detail.innerHTML = `<div style="padding:1.25rem;color:#ef4444;" class="form-help-text">${escapeHtml(error.message)}</div>`;
    }
  }

  async function loadDeliveryData() {
    try {
      const [clientResult, staffResult, projectResult, maintenanceResult, proposalResult] = await Promise.all([
        adminApiFetch('/api/clients'),
        adminApiFetch('/api/staff').catch(() => ({ staff: [], canManageTeam: false, canAssignAdmin: false })),
        adminApiFetch('/api/projects'),
        adminApiFetch('/api/maintenance'),
        adminApiFetch('/api/proposals')
      ]);

      deliveryState.clients = clientResult.clients || [];
      deliveryState.staff = staffResult.staff || [];
      deliveryState.canManageTeam = Boolean(staffResult.canManageTeam);
      deliveryState.canAssignAdmin = Boolean(staffResult.canAssignAdmin);
      deliveryState.projects = projectResult.projects || [];
      deliveryState.maintenance = maintenanceResult.maintenance || [];
      deliveryState.proposals = proposalResult.proposals || [];

      const clientOptions =
        '<option value="">Select a client</option>' +
        deliveryState.clients
          .map((client) => `<option value="${escapeHtml(client.id)}">${escapeHtml(client.companyName)} — ${escapeHtml(client.contactName)}</option>`)
          .join('');
      if (clientSelect) clientSelect.innerHTML = clientOptions;
      if (proposalClientSelect) proposalClientSelect.innerHTML = clientOptions;
      if (maintenanceClientSelect) maintenanceClientSelect.innerHTML = clientOptions;
      if (maintenanceProjectSelect) {
        maintenanceProjectSelect.innerHTML =
          '<option value="">Account-level service</option>' +
          deliveryState.projects
            .map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)} — ${escapeHtml(project.companyName)}</option>`)
            .join('');
      }

      updateWorkspaceKpis();
      renderClientAccountsTable();
      renderStaffAccountsTable();
      renderProposalsTable();
      renderMaintenanceTable();
      renderProjectsList();
    } catch (error) {
      const errHtml = `<div class="ops-empty-box"><strong style="color:#ef4444">Unable to load workspace data</strong><p>${escapeHtml(
        error.message
      )}</p></div>`;
      const pCont = document.getElementById('deliveryProjectsContainer');
      if (pCont) pCont.innerHTML = errHtml;
    }
  }

  // Search & Filter Listeners
  document.getElementById('deliveryProjectSearch')?.addEventListener('input', (e) => {
    deliveryState.projectQuery = e.target.value;
    renderProjectsList();
  });
  document.getElementById('deliveryProjectStatusFilter')?.addEventListener('change', (e) => {
    deliveryState.projectStatus = e.target.value;
    renderProjectsList();
  });
  document.getElementById('deliveryProposalSearch')?.addEventListener('input', (e) => {
    deliveryState.proposalQuery = e.target.value;
    renderProposalsTable();
  });
  document.getElementById('deliveryProposalStatusFilter')?.addEventListener('change', (e) => {
    deliveryState.proposalStatus = e.target.value;
    renderProposalsTable();
  });
  document.getElementById('deliveryMaintenanceSearch')?.addEventListener('input', (e) => {
    deliveryState.maintenanceQuery = e.target.value;
    renderMaintenanceTable();
  });
  document.getElementById('usersSearchInput')?.addEventListener('input', (e) => {
    deliveryState.userQuery = e.target.value;
    renderClientAccountsTable();
  });
  document.getElementById('staffSearchInput')?.addEventListener('input', (e) => {
    deliveryState.staffQuery = e.target.value;
    renderStaffAccountsTable();
  });
  document.getElementById('staffRoleFilter')?.addEventListener('change', (e) => {
    deliveryState.staffRole = e.target.value;
    renderStaffAccountsTable();
  });
  document.querySelectorAll('[data-user-status-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deliveryState.userStatus = btn.dataset.userStatusFilter;
      document.querySelectorAll('[data-user-status-filter]').forEach((b) => b.classList.toggle('active', b === btn));
      renderClientAccountsTable();
    });
  });

  // Creation Forms
  clientForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (clientForm.dataset.submitting === 'true') return;
    clientForm.dataset.submitting = 'true';
    const submitButton = clientForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Creating…';
    }
    const feedback = document.getElementById('clientCreateFeedback');
    try {
      await adminApiFetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          companyName: document.getElementById('clientCompanyName').value.trim(),
          contactName: document.getElementById('clientContactName').value.trim(),
          email: document.getElementById('clientEmail').value.trim(),
          phone: document.getElementById('clientPhone').value.trim(),
          password: document.getElementById('clientPassword').value
        })
      });
      clientForm.reset();
      if (feedback) {
        feedback.textContent = 'Client account created successfully.';
        feedback.style.color = 'var(--admin-accent)';
      }
      showToast('Client portal account created.');
      await loadDeliveryData();
    } catch (error) {
      if (feedback) {
        feedback.textContent = error.message;
        feedback.style.color = '#ef4444';
      }
    } finally {
      clientForm.dataset.submitting = 'false';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Create Client Access';
      }
    }
  });

  projectForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (projectForm.dataset.submitting === 'true') return;
    projectForm.dataset.submitting = 'true';
    const submitButton = projectForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Creating…';
    }
    const feedback = document.getElementById('projectCreateFeedback');
    try {
      await adminApiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          clientId: clientSelect.value,
          name: document.getElementById('deliveryProjectName').value.trim(),
          description: document.getElementById('deliveryProjectDescription').value.trim()
        })
      });
      projectForm.reset();
      if (feedback) {
        feedback.textContent = 'Project created successfully.';
        feedback.style.color = 'var(--admin-accent)';
      }
      showToast('Project workspace created.');
      await loadDeliveryData();
      switchDeliverySubtab('projects');
    } catch (error) {
      if (feedback) {
        feedback.textContent = error.message;
        feedback.style.color = '#ef4444';
      }
    } finally {
      projectForm.dataset.submitting = 'false';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Create Project';
      }
    }
  });

  document.getElementById('proposalCreateForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (event.currentTarget.dataset.submitting === 'true') return;
    event.currentTarget.dataset.submitting = 'true';
    const submitButton = event.currentTarget.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Saving…';
    }
    const feedback = document.getElementById('proposalCreateFeedback');
    try {
      await adminApiFetch('/api/proposals', {
        method: 'POST',
        body: JSON.stringify({
          clientId: proposalClientSelect.value,
          title: document.getElementById('proposalTitle').value.trim(),
          scope: document.getElementById('proposalScope').value.trim(),
          currency: document.getElementById('proposalCurrency').value,
          totalAmount: Number(document.getElementById('proposalAmount').value)
        })
      });
      event.target.reset();
      if (feedback) {
        feedback.textContent = 'Draft offer saved successfully.';
        feedback.style.color = 'var(--admin-accent)';
      }
      showToast('Draft offer created.');
      await loadDeliveryData();
      switchDeliverySubtab('proposals');
    } catch (error) {
      if (feedback) {
        feedback.textContent = error.message;
        feedback.style.color = '#ef4444';
      }
    } finally {
      event.currentTarget.dataset.submitting = 'false';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Save Draft Offer';
      }
    }
  });

  document.getElementById('maintenanceCreateForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = document.getElementById('maintenanceCreateFeedback');
    if (event.currentTarget.dataset.submitting === 'true') return;
    event.currentTarget.dataset.submitting = 'true';
    const submitButton = event.currentTarget.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Saving…';
    }
    try {
      await adminApiFetch('/api/maintenance', {
        method: 'POST',
        body: JSON.stringify({
          clientId: maintenanceClientSelect.value,
          projectId: maintenanceProjectSelect.value || null,
          title: document.getElementById('maintenanceTitle').value.trim(),
          description: document.getElementById('maintenanceDescription').value.trim(),
          billingType: document.getElementById('maintenanceBillingType').value,
          currency: document.getElementById('maintenanceCurrency').value,
          amount: Number(document.getElementById('maintenanceAmount').value)
        })
      });
      event.target.reset();
      if (feedback) {
        feedback.textContent = 'Maintenance service saved successfully.';
        feedback.style.color = 'var(--admin-accent)';
      }
      showToast('Maintenance contract created.');
      await loadDeliveryData();
      switchDeliverySubtab('maintenance');
    } catch (error) {
      if (feedback) {
        feedback.textContent = error.message;
        feedback.style.color = '#ef4444';
      }
    } finally {
      event.currentTarget.dataset.submitting = 'false';
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Save Maintenance Service';
      }
    }
  });

  // Table & Project Delegated Actions
  document.getElementById('maintenanceContractsContainer')?.addEventListener('click', (event) => {
    const button = event.target.closest('.maintenance-invoice-btn');
    if (!button) return;
    openDeliveryActionModal({
      kicker: 'Maintenance Billing',
      title: `Generate Invoice — ${button.dataset.title || 'Contract'}`,
      submitLabel: 'Generate Invoice',
      bodyHtml: `
        <div class="form-group">
          <label class="form-label" for="modalMaintDueDate">Due Date (optional)</label>
          <input type="date" id="modalMaintDueDate" name="dueDate" class="form-input" />
          <span class="form-help-text">Leave blank if no specific due date is required.</span>
        </div>
      `,
      onSubmit: async (formData) => {
        const dueDate = formData.get('dueDate') || null;
        await adminApiFetch(`/api/maintenance/${encodeURIComponent(button.dataset.maintenance)}/invoices`, {
          method: 'POST',
          body: JSON.stringify({ dueDate })
        });
        showToast('Maintenance invoice generated.');
      }
    });
  });

  document.getElementById('proposalsContainer')?.addEventListener('click', async (event) => {
    const proposalStatusBtn = event.target.closest('.proposal-status-btn');
    const proposalProjectBtn = event.target.closest('.proposal-project-btn');
    if (proposalStatusBtn) {
      if (proposalStatusBtn.dataset.submitting === 'true') return;
      proposalStatusBtn.dataset.submitting = 'true';
      proposalStatusBtn.disabled = true;
      const originalText = proposalStatusBtn.textContent;
      proposalStatusBtn.textContent = 'Sending…';
      try {
        await adminApiFetch(`/api/proposals/${encodeURIComponent(proposalStatusBtn.dataset.proposal)}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: proposalStatusBtn.dataset.status })
        });
        showToast('Proposal marked as sent and notification queued.');
        await loadDeliveryData();
      } catch (error) {
        proposalStatusBtn.disabled = false;
        proposalStatusBtn.dataset.submitting = 'false';
        proposalStatusBtn.textContent = originalText;
        showToast(error.message, 'error');
      }
      return;
    }
    if (proposalProjectBtn) {
      if (proposalProjectBtn.dataset.submitting === 'true') return;
      proposalProjectBtn.dataset.submitting = 'true';
      proposalProjectBtn.disabled = true;
      try {
        await adminApiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify({
            clientId: proposalProjectBtn.dataset.client,
            proposalId: proposalProjectBtn.dataset.proposal,
            name: proposalProjectBtn.dataset.title,
            description: 'Project created from accepted proposal.'
          })
        });
        showToast('Project created from accepted proposal.');
        await loadDeliveryData();
        switchDeliverySubtab('projects');
      } catch (error) {
        proposalProjectBtn.disabled = false;
        proposalProjectBtn.dataset.submitting = 'false';
        showToast(error.message, 'error');
      }
    }
  });

  document.getElementById('clientAccountsContainer')?.addEventListener('click', async (event) => {
    const editButton = event.target.closest('.client-edit-btn');
    if (editButton) {
      const modal = document.getElementById('clientEditModal');
      const frame = document.getElementById('clientEditFrame');
      frame.src = `/admin-client.html?id=${encodeURIComponent(editButton.dataset.client)}&embedded=1`;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      return;
    }
    const statusButton = event.target.closest('.client-status-btn');
    if (statusButton) {
      statusButton.disabled = true;
      try {
        await adminApiFetch(`/api/clients/${encodeURIComponent(statusButton.dataset.client)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: statusButton.dataset.status })
        });
        showToast(`Client access set to ${statusButton.dataset.status}.`);
        await loadDeliveryData();
      } catch (error) {
        statusButton.disabled = false;
        showToast(error.message, 'error');
      }
      return;
    }
    const passwordButton = event.target.closest('.client-password-btn');
    if (passwordButton) {
      openDeliveryActionModal({
        kicker: 'Account Recovery',
        title: `Reset Password — ${passwordButton.dataset.name || 'Client'}`,
        submitLabel: 'Reset Password',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="modalResetPasswordInput">New Temporary Password (min. 10 characters)</label>
            <div class="password-field">
              <input type="text" id="modalResetPasswordInput" name="password" class="form-input" minlength="10" required placeholder="Enter or generate password" />
              <button type="button" class="password-action" id="modalGenClientPwdBtn" style="right:0.75rem;">Generate</button>
            </div>
            <span class="form-help-text">Share this temporary password securely. The client can change it inside their portal.</span>
          </div>
        `,
        onSubmit: async (formData) => {
          const password = String(formData.get('password') || '');
          await adminApiFetch(`/api/clients/${encodeURIComponent(passwordButton.dataset.client)}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ password })
          });
          showToast('Client password reset successfully.');
        }
      });
      document.getElementById('modalGenClientPwdBtn')?.addEventListener('click', () => {
        const inp = document.getElementById('modalResetPasswordInput');
        if (inp) inp.value = generateSecurePassword();
      });
    }
  });

  document.getElementById('staffAccountsContainer')?.addEventListener('click', async (event) => {
    const editBtn = event.target.closest('.staff-edit-btn');
    if (editBtn) {
      const member = deliveryState.staff.find((s) => s.id === editBtn.dataset.staff);
      if (!member) return;
      const adminOpt = deliveryState.canAssignAdmin
        ? `<option value="admin" ${member.role === 'admin' || member.role === 'Administrator' ? 'selected' : ''}>Admin</option>`
        : '';
      openDeliveryActionModal({
        kicker: 'Team Role & Profile',
        title: `Edit Team Member — ${member.fullName || member.email}`,
        submitLabel: 'Save Changes',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="modalEditStaffName">Full Name</label>
            <input type="text" id="modalEditStaffName" name="fullName" class="form-input" required value="${escapeHtml(member.fullName || '')}" />
          </div>
          <div class="form-grid two-col">
            <div class="form-group">
              <label class="form-label" for="modalEditStaffRole">Console Role</label>
              <select id="modalEditStaffRole" name="role" class="form-select">
                <option value="developer" ${member.role === 'developer' ? 'selected' : ''}>Developer</option>
                <option value="sub_admin" ${member.role === 'sub_admin' ? 'selected' : ''}>Sub-Admin</option>
                <option value="manager" ${member.role === 'manager' ? 'selected' : ''}>Delivery Manager</option>
                ${adminOpt}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="modalEditStaffStatus">Access Status</label>
              <select id="modalEditStaffStatus" name="status" class="form-select">
                <option value="active" ${(member.status || 'active') === 'active' ? 'selected' : ''}>Active</option>
                <option value="suspended" ${member.status === 'suspended' ? 'selected' : ''}>Suspended</option>
              </select>
            </div>
          </div>
        `,
        onSubmit: async (formData) => {
          await adminApiFetch(`/api/staff/${encodeURIComponent(member.id)}`, {
            method: 'PATCH',
            body: JSON.stringify({
              fullName: String(formData.get('fullName') || '').trim(),
              role: String(formData.get('role') || member.role),
              status: String(formData.get('status') || member.status || 'active')
            })
          });
          showToast('Team member updated.');
          await loadDeliveryData();
        }
      });
      return;
    }

    const statusBtn = event.target.closest('.staff-status-btn');
    if (statusBtn) {
      statusBtn.disabled = true;
      try {
        await adminApiFetch(`/api/staff/${encodeURIComponent(statusBtn.dataset.staff)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: statusBtn.dataset.status })
        });
        showToast(`Team access set to ${statusBtn.dataset.status}.`);
        await loadDeliveryData();
      } catch (error) {
        statusBtn.disabled = false;
        showToast(error.message, 'error');
      }
      return;
    }

    const pwdBtn = event.target.closest('.staff-password-btn');
    if (pwdBtn) {
      openDeliveryActionModal({
        kicker: 'Team Account Recovery',
        title: `Reset Password — ${pwdBtn.dataset.name || 'Team Member'}`,
        submitLabel: 'Reset Password',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="modalStaffResetPwd">New Temporary Password (min. 10 characters)</label>
            <div class="password-field">
              <input type="text" id="modalStaffResetPwd" name="password" class="form-input" minlength="10" required placeholder="Enter or generate password" />
              <button type="button" class="password-action" id="modalGenStaffResetBtn" style="right:0.75rem;">Generate</button>
            </div>
            <span class="form-help-text">Share this temporary password securely with the team member.</span>
          </div>
        `,
        onSubmit: async (formData) => {
          await adminApiFetch(`/api/staff/${encodeURIComponent(pwdBtn.dataset.staff)}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ password: String(formData.get('password') || '') })
          });
          showToast('Team member password reset successfully.');
        }
      });
      document.getElementById('modalGenStaffResetBtn')?.addEventListener('click', () => {
        const inp = document.getElementById('modalStaffResetPwd');
        if (inp) inp.value = generateSecurePassword();
      });
      return;
    }

    const delBtn = event.target.closest('.staff-delete-btn');
    if (delBtn) {
      openDeliveryActionModal({
        kicker: 'Revoke Access',
        title: `Remove Team Member — ${delBtn.dataset.name || 'Account'}`,
        submitLabel: 'Remove Account',
        bodyHtml: `
          <p style="margin:0;color:var(--admin-text-secondary);font-size:0.9rem;line-height:1.55;">
            This will permanently revoke console access for <strong>${escapeHtml(delBtn.dataset.name || 'this user')}</strong>.
            You can recreate their account at any time later.
          </p>
        `,
        onSubmit: async () => {
          await adminApiFetch(`/api/staff/${encodeURIComponent(delBtn.dataset.staff)}`, {
            method: 'DELETE'
          });
          showToast('Team account removed.');
          await loadDeliveryData();
        }
      });
    }
  });

  document.querySelectorAll('[data-close-client-modal]').forEach((element) =>
    element.addEventListener('click', () => {
      const modal = document.getElementById('clientEditModal');
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.getElementById('clientEditFrame').src = 'about:blank';
      loadDeliveryData();
    })
  );

  document.getElementById('generateDueMaintenanceBtn')?.addEventListener('click', async () => {
    try {
      const result = await adminApiFetch('/api/maintenance/generate-due-invoices', { method: 'POST' });
      showToast(result.message || 'Due invoices generated.');
      await loadDeliveryData();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  document.getElementById('deliveryProjectsContainer')?.addEventListener('click', async (event) => {
    const openBtn = event.target.closest('.delivery-open-btn');
    if (openBtn) {
      const projectId = openBtn.dataset.project;
      const detail = document.getElementById(`delivery-detail-${projectId}`);
      const card = openBtn.closest('.ops-project-card');
      if (deliveryState.expandedProjects.has(projectId)) {
        deliveryState.expandedProjects.delete(projectId);
        detail?.classList.remove('open');
        card?.classList.remove('is-highlight');
        openBtn.textContent = 'Manage Workspace';
        openBtn.classList.replace('btn-primary', 'btn-secondary');
      } else {
        deliveryState.expandedProjects.add(projectId);
        detail?.classList.add('open');
        card?.classList.add('is-highlight');
        openBtn.textContent = 'Hide Workspace';
        openBtn.classList.replace('btn-secondary', 'btn-primary');
        await loadProjectWorkspaceDetail(projectId);
      }
      return;
    }

    const progressBtn = event.target.closest('.delivery-progress-btn');
    if (progressBtn) {
      const currentProgress = Number(progressBtn.dataset.progress) || 0;
      const currentStatus = progressBtn.dataset.status || 'active';
      openDeliveryActionModal({
        kicker: 'Project Status',
        title: `Update Progress — ${progressBtn.dataset.name || 'Project'}`,
        submitLabel: 'Update Project',
        bodyHtml: `
          <div class="form-grid two-col">
            <div class="form-group">
              <label class="form-label" for="modalProjectProgress">Progress (0–100%)</label>
              <input type="number" id="modalProjectProgress" name="progress" class="form-input" min="0" max="100" required value="${currentProgress}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="modalProjectStatus">Status</label>
              <select id="modalProjectStatus" name="status" class="form-select">
                ${['active', 'on_hold', 'client_review', 'testing', 'completed', 'maintenance']
                  .map((s) => `<option value="${s}" ${s === currentStatus ? 'selected' : ''}>${formatOpsStatus(s)}</option>`)
                  .join('')}
              </select>
            </div>
          </div>
        `,
        onSubmit: async (formData) => {
          const progress = Number(formData.get('progress'));
          const status = String(formData.get('status') || currentStatus);
          await adminApiFetch(`/api/projects/${encodeURIComponent(progressBtn.dataset.project)}`, {
            method: 'PATCH',
            body: JSON.stringify({ progress, status })
          });
          showToast('Project progress updated.');
          await loadDeliveryData();
        }
      });
      return;
    }

    const uploadBtn = event.target.closest('.delivery-upload-btn');
    if (uploadBtn) {
      const projectId = uploadBtn.dataset.project;
      const pane = uploadBtn.closest('.ops-detail-pane');
      const fileInput = pane?.querySelector(`.delivery-file-input[data-project="${CSS.escape(projectId)}"]`);
      const visibleCheck = pane?.querySelector('.delivery-file-visible');
      const file = fileInput?.files?.[0];
      if (!file) {
        showToast('Select a file to upload first.', 'error');
        return;
      }
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading…';
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('visibleToClient', String(Boolean(visibleCheck?.checked)));
        const session = getAdminSession();
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/files`, {
          method: 'POST',
          headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
          body: formData
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Upload failed.');
        showToast('Project file uploaded successfully.');
        await loadProjectWorkspaceDetail(projectId);
      } catch (error) {
        showToast(error.message, 'error');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload';
      }
      return;
    }

    const invoiceBtn = event.target.closest('.delivery-invoice-btn');
    if (invoiceBtn) {
      const projectId = invoiceBtn.dataset.project;
      openDeliveryActionModal({
        kicker: 'Project Billing',
        title: 'Create Project Invoice',
        submitLabel: 'Create Invoice',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="modalInvoiceDesc">Description</label>
            <input type="text" id="modalInvoiceDesc" name="description" class="form-input" required placeholder="Sprint 2 frontend engineering" />
          </div>
          <div class="form-grid three-col">
            <div class="form-group">
              <label class="form-label" for="modalInvoiceCurrency">Currency</label>
              <select id="modalInvoiceCurrency" name="currency" class="form-select"><option value="EUR">EUR</option><option value="USD">USD</option></select>
            </div>
            <div class="form-group">
              <label class="form-label" for="modalInvoiceAmount">Amount</label>
              <input type="number" id="modalInvoiceAmount" name="amount" class="form-input" min="0.01" step="0.01" required placeholder="2500" />
            </div>
            <div class="form-group">
              <label class="form-label" for="modalInvoiceDueDate">Due Date</label>
              <input type="date" id="modalInvoiceDueDate" name="dueDate" class="form-input" />
            </div>
          </div>
        `,
        onSubmit: async (formData) => {
          await adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/invoices`, {
            method: 'POST',
            body: JSON.stringify({
              description: String(formData.get('description') || '').trim(),
              amount: Number(formData.get('amount') || 0),
              currency: String(formData.get('currency') || 'EUR'),
              dueDate: formData.get('dueDate') || null
            })
          });
          showToast('Invoice created successfully.');
          await loadProjectWorkspaceDetail(projectId);
        }
      });
      return;
    }

    const milestoneBtn = event.target.closest('.delivery-milestone-btn');
    if (milestoneBtn) {
      const projectId = milestoneBtn.dataset.project;
      openDeliveryActionModal({
        kicker: 'Project Milestone',
        title: `Add Milestone${milestoneBtn.dataset.name ? ` — ${milestoneBtn.dataset.name}` : ''}`,
        submitLabel: 'Save Milestone',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="modalMilestoneTitle">Milestone Title</label>
            <input type="text" id="modalMilestoneTitle" name="title" class="form-input" required placeholder="Architecture & Design Sign-off" />
          </div>
          <div class="form-group">
            <label class="form-label" for="modalMilestoneDesc">Deliverables Summary (optional)</label>
            <textarea id="modalMilestoneDesc" name="description" class="form-textarea" rows="2" placeholder="Interactive prototypes and database schema"></textarea>
          </div>
          <div class="form-grid three-col">
            <div class="form-group">
              <label class="form-label" for="modalMilestoneCurrency">Currency</label>
              <select id="modalMilestoneCurrency" name="currency" class="form-select"><option value="EUR">EUR</option><option value="USD">USD</option></select>
            </div>
            <div class="form-group">
              <label class="form-label" for="modalMilestoneAmount">Amount</label>
              <input type="number" id="modalMilestoneAmount" name="amount" class="form-input" min="0" step="0.01" value="0" />
            </div>
            <div class="form-group">
              <label class="form-label" for="modalMilestoneDue">Due Date</label>
              <input type="date" id="modalMilestoneDue" name="dueDate" class="form-input" />
            </div>
          </div>
        `,
        onSubmit: async (formData) => {
          await adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/milestones`, {
            method: 'POST',
            body: JSON.stringify({
              title: String(formData.get('title') || '').trim(),
              description: String(formData.get('description') || '').trim(),
              amount: Number(formData.get('amount') || 0),
              currency: String(formData.get('currency') || 'EUR'),
              dueDate: formData.get('dueDate') || null
            })
          });
          showToast('Milestone added successfully.');
          if (deliveryState.expandedProjects.has(projectId)) {
            await loadProjectWorkspaceDetail(projectId);
          }
        }
      });
      return;
    }

    const updateBtn = event.target.closest('.delivery-update-btn');
    if (updateBtn) {
      const projectId = updateBtn.dataset.project;
      openDeliveryActionModal({
        kicker: 'Client Communication',
        title: `Post Delivery Update${updateBtn.dataset.name ? ` — ${updateBtn.dataset.name}` : ''}`,
        submitLabel: 'Publish Update',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="modalUpdateTitle">Update Title</label>
            <input type="text" id="modalUpdateTitle" name="title" class="form-input" required placeholder="Sprint 3 API Integration Completed" />
          </div>
          <div class="form-group">
            <label class="form-label" for="modalUpdateBody">Update Details</label>
            <textarea id="modalUpdateBody" name="body" class="form-textarea" rows="4" required placeholder="Summarize completed engineering deliverables and next steps..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="modalUpdateProgress">Progress Snapshot % (optional)</label>
            <input type="number" id="modalUpdateProgress" name="progress" class="form-input" min="0" max="100" placeholder="Leave blank if unchanged" />
          </div>
        `,
        onSubmit: async (formData) => {
          const progressRaw = String(formData.get('progress') || '').trim();
          await adminApiFetch(`/api/projects/${encodeURIComponent(projectId)}/updates`, {
            method: 'POST',
            body: JSON.stringify({
              title: String(formData.get('title') || '').trim(),
              body: String(formData.get('body') || '').trim(),
              progress: progressRaw === '' ? null : Number(progressRaw),
              visibleToClient: true
            })
          });
          showToast('Client update posted successfully.');
          if (deliveryState.expandedProjects.has(projectId)) {
            await loadProjectWorkspaceDetail(projectId);
          }
        }
      });
    }
  });

  refresh?.addEventListener('click', loadDeliveryData);
  refreshUsersBtn?.addEventListener('click', loadDeliveryData);
  await loadDeliveryData();
}

/* ==========================================================================
   1. Theme Toggle
   ========================================================================== */

function initThemeToggle() {
  const toggleBtn = document.getElementById('adminThemeToggle');
  const icon = document.getElementById('adminThemeIcon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('tecklumo_admin_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (icon) icon.textContent = savedTheme === 'dark' ? '☀' : '☾';

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tecklumo_admin_theme', next);
    if (icon) icon.textContent = next === 'dark' ? '☀' : '☾';
    showToast(`Theme switched to ${next} mode`);
  });
}

/* ==========================================================================
   2. Sidebar & Tab Switching
   ========================================================================== */

function initSidebarAndTabs() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const panels = document.querySelectorAll('.admin-tab-panel');
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('adminSidebarBackdrop');
  const toggleBtn = document.getElementById('sidebarToggleBtn');

  function setDrawerOpen(isOpen) {
    if (!sidebar) return;
    sidebar.classList.toggle('open', isOpen);
    backdrop?.classList.toggle('open', isOpen);
    toggleBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('drawer-open', isOpen && window.innerWidth <= 1024);
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      setDrawerOpen(!sidebar.classList.contains('open'));
    });

    backdrop?.addEventListener('click', () => setDrawerOpen(false));

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          setDrawerOpen(false);
        }
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        setDrawerOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
        setDrawerOpen(false);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (window.innerWidth <= 1024 && sidebar) {
        setDrawerOpen(false);
      }

      // Update URL hash for easy bookmarking
      window.location.hash = targetId.replace('tab-', '');
    });
  });

  // Handle direct hash navigation
  if (window.location.hash) {
    const hashTarget = 'tab-' + window.location.hash.replace('#', '');
    const matchingBtn = document.querySelector(`.nav-tab-btn[data-tab="${hashTarget}"]`);
    if (matchingBtn) matchingBtn.click();
  }

  // Quick link from dashboard to all inquiries
  const viewAllLink = document.getElementById('viewAllInquiriesLink');
  if (viewAllLink) {
    viewAllLink.addEventListener('click', () => {
      const inqTabBtn = document.querySelector('.nav-tab-btn[data-tab="tab-inquiries"]');
      if (inqTabBtn) inqTabBtn.click();
    });
  }
}

/* ==========================================================================
   3. Global Search (Keyboard '/' shortcut)
   ========================================================================== */

function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) return;

    // Filter inquiries if on inquiries tab, or switch to inquiries tab on enter
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        const inqTabBtn = document.querySelector('.nav-tab-btn[data-tab="tab-inquiries"]');
        if (inqTabBtn) inqTabBtn.click();
        const inqSearch = document.getElementById('inquiryFilterSearch');
        if (inqSearch) {
          inqSearch.value = query;
          inqSearch.dispatchEvent(new Event('input'));
        }
      }
    }
  });
}

/* ==========================================================================
   3.1 Operations & Delivery Dashboard Telemetry
   ========================================================================== */

function initDashboard() {
  updateDashboardStats();
  renderInquiriesTable();
  loadDashboardStats();
}

async function loadDashboardStats() {
  try {
    const result = await adminApiFetch('/api/dashboard/stats');
    const statLeads = document.getElementById('statInboundLeads');
    if (statLeads && result.stats) statLeads.textContent = Number(result.stats.total || 0);
  } catch (error) {
    console.warn('Live dashboard stats unavailable:', error.message);
  }
}

function updateDashboardStats() {
  const statLeads = document.getElementById('statInboundLeads');
  const statRetainers = document.getElementById('statActiveRetainers');

  if (statLeads && window.adminState && Array.isArray(adminState.inquiries)) {
    statLeads.textContent = adminState.inquiries.length;
  }

  if (statRetainers) {
    const tierCount = (window.adminState && adminState.maintenance && Array.isArray(adminState.maintenance.tiers))
      ? adminState.maintenance.tiers.length
      : 3;
    statRetainers.textContent = `${tierCount} Tiers · Active`;
  }
}

/* ==========================================================================
   4. Inquiries & CRM Module
   ========================================================================== */

function initInquiriesModule() {
  renderInquiriesTable();
  updateInquiriesBadges();
  loadInquiriesFromApi();

  const searchInput = document.getElementById('inquiryFilterSearch');
  const statusFilter = document.getElementById('inquiryStatusFilter');
  const serviceFilter = document.getElementById('inquiryServiceFilter');

  if (searchInput) searchInput.addEventListener('input', renderInquiriesTable);
  if (statusFilter) statusFilter.addEventListener('change', renderInquiriesTable);
  if (serviceFilter) serviceFilter.addEventListener('change', renderInquiriesTable);

  // Export CSV
  const exportBtn1 = document.getElementById('exportLeadsBtn');
  const exportBtn2 = document.getElementById('exportLeadsCsvBtn');
  const handleExport = () => exportInquiriesToCsv();
  if (exportBtn1) exportBtn1.addEventListener('click', handleExport);
  if (exportBtn2) exportBtn2.addEventListener('click', handleExport);

  // Manual new lead
  const quickNewLead = document.getElementById('quickNewLeadBtn');
  const createNewLead = document.getElementById('createNewInquiryBtn');
  const handleNewLead = () => promptCreateManualLead();
  if (quickNewLead) quickNewLead.addEventListener('click', handleNewLead);
  if (createNewLead) createNewLead.addEventListener('click', handleNewLead);

  // Modal handlers
  initInquiryModal();
}

async function loadInquiriesFromApi() {
  try {
    const result = await adminApiFetch('/api/inquiries');
    if (!Array.isArray(result.inquiries)) return;
    adminState.inquiries = result.inquiries.map((item) => ({
      ...item,
      name: item.fullName || item.name || '',
      date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : item.date || '',
      serviceName: item.serviceName || item.service || '',
      budget: item.budget || (item.customBudget ? `${item.currency || ''} ${item.customBudget}` : 'Custom Discovery')
    }));
    renderInquiriesTable();
    updateInquiriesBadges();
    loadDashboardStats();
    showToast('Live inquiries loaded from database.');
  } catch (error) {
    console.warn('Live inquiry API unavailable; showing local draft data.', error.message);
  }
}

function renderInquiriesTable() {
  const tbody = document.getElementById('inquiriesMasterTbody');
  const dashTbody = document.getElementById('dashboardInquiriesTbody');
  const searchInput = document.getElementById('inquiryFilterSearch');
  const statusFilter = document.getElementById('inquiryStatusFilter');
  const serviceFilter = document.getElementById('inquiryServiceFilter');
  const counter = document.getElementById('inquiriesResultsCounter');

  if (!tbody) return;

  const query = (searchInput?.value || '').toLowerCase().trim();
  const selectedStatus = statusFilter?.value || 'all';
  const selectedService = serviceFilter?.value || 'all';

  const filtered = adminState.inquiries.filter(item => {
    const matchQuery = !query || 
      item.name.toLowerCase().includes(query) || 
      item.company.toLowerCase().includes(query) || 
      item.email.toLowerCase().includes(query);

    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchService = selectedService === 'all' || item.service.includes(selectedService);

    return matchQuery && matchStatus && matchService;
  });

  if (counter) {
    counter.textContent = `Showing ${filtered.length} of ${adminState.inquiries.length} leads`;
  }

  // Render Master Table
  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--admin-text-muted);">No inbound leads match the current filters.</td></tr>`;
  } else {
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Date" style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--admin-text-muted);">${item.date}</td>
        <td data-label="Client">
          <div style="font-weight: 700; color: var(--admin-text-primary);">${escapeHtml(item.name)}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${escapeHtml(item.company || 'Direct Inquiry')}</div>
        </td>
        <td data-label="Email">
          <a href="mailto:${escapeHtml(item.email)}" class="email-link" style="overflow-wrap:anywhere;">${escapeHtml(item.email)}</a>
        </td>
        <td data-label="Service">
          <span style="font-size: 0.8rem; font-weight: 600;">${escapeHtml(item.serviceName || item.service)}</span>
        </td>
        <td data-label="Est. Budget" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--admin-accent); font-weight: 700;">
          ${escapeHtml(item.budget || 'Custom Discovery')}
        </td>
        <td data-label="Status">
          <span class="status-chip ${item.status}">${item.status.replace('_', ' ')}</span>
        </td>
        <td data-label="Actions" style="text-align: right;">
          <div class="ops-table-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="openInquiryDetail('${item.id}')">Review &amp; Edit</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render Dashboard stream (first 4 items)
  if (dashTbody) {
    dashTbody.innerHTML = '';
    adminState.inquiries.slice(0, 4).forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Client">
          <div style="font-weight: 700; color: var(--admin-text-primary); font-size: 0.85rem;">${escapeHtml(item.name)}</div>
          <div style="font-size: 0.72rem; color: var(--admin-text-muted);">${escapeHtml(item.company || 'Individual')}</div>
        </td>
        <td data-label="Service" style="font-size: 0.8rem;">${escapeHtml(item.serviceName || item.service)}</td>
        <td data-label="Budget" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--admin-accent); font-weight: 700;">${escapeHtml(item.budget || 'Discovery')}</td>
        <td data-label="Status"><span class="status-chip ${item.status}">${item.status}</span></td>
        <td data-label="Action">
          <div class="ops-table-actions">
            <button type="button" class="btn-action-icon" onclick="openInquiryDetail('${item.id}')">View</button>
          </div>
        </td>
      `;
      dashTbody.appendChild(tr);
    });
  }
}

function updateInquiriesBadges() {
  const badge = document.getElementById('inquiriesCountBadge');
  const statLeads = document.getElementById('statInboundLeads');
  if (badge) badge.textContent = adminState.inquiries.length;
  if (statLeads) statLeads.textContent = adminState.inquiries.length;
  updateDashboardStats();
}

// Modal View & Update
let activeEditingInquiryId = null;

function initInquiryModal() {
  const modal = document.getElementById('inquiryDetailModal');
  const closeBtn = document.getElementById('closeInquiryModalBtn');
  const saveBtn = document.getElementById('saveInquiryModalBtn');
  const deleteBtn = document.getElementById('deleteInquiryBtn');

  if (closeBtn) closeBtn.addEventListener('click', () => closeInquiryModal());
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeInquiryModal();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!activeEditingInquiryId) return;
      const inquiry = adminState.inquiries.find(i => i.id === activeEditingInquiryId);
      if (!inquiry) return;

      const statusSelect = document.getElementById('modalInquiryStatusSelect');
      const notesInput = document.getElementById('modalInquiryInternalNotes');

      inquiry.status = statusSelect.value;
      inquiry.internalNotes = notesInput.value.trim();

      try {
        await adminApiFetch(`/api/inquiries/${encodeURIComponent(inquiry.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: inquiry.status, internalNotes: inquiry.internalNotes })
        });
        saveAdminState();
        renderInquiriesTable();
        closeInquiryModal();
        showToast(`Inquiry ${inquiry.id} updated to ${inquiry.status}`);
      } catch (error) {
        showToast(error.message || 'Could not update inquiry in database.', 'error');
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      if (!activeEditingInquiryId) return;
      if (confirm('Are you sure you want to delete this inquiry record?')) {
        try {
          await adminApiFetch(`/api/inquiries/${encodeURIComponent(activeEditingInquiryId)}`, { method: 'DELETE' });
          adminState.inquiries = adminState.inquiries.filter(i => i.id !== activeEditingInquiryId);
          saveAdminState();
          renderInquiriesTable();
          updateInquiriesBadges();
          closeInquiryModal();
          showToast('Inquiry deleted successfully', 'error');
        } catch (error) {
          showToast(error.message || 'Could not delete inquiry from database.', 'error');
        }
      }
    });
  }
}

window.openInquiryDetail = function(id) {
  const inquiry = adminState.inquiries.find(i => i.id === id);
  if (!inquiry) return;

  activeEditingInquiryId = id;
  const modal = document.getElementById('inquiryDetailModal');
  if (!modal) return;

  document.getElementById('modalInquiryId').textContent = inquiry.id;
  document.getElementById('modalInquiryName').textContent = inquiry.name;
  
  const emailEl = document.getElementById('modalInquiryEmail');
  emailEl.textContent = inquiry.email;
  emailEl.href = `mailto:${inquiry.email}`;

  const phoneEl = document.getElementById('modalInquiryPhone');
  if (phoneEl) {
    phoneEl.textContent = inquiry.phone || 'Not provided';
    phoneEl.href = inquiry.phone ? `tel:${inquiry.phone}` : '#';
  }

  document.getElementById('modalInquiryCompany').textContent = inquiry.company || 'Not provided';
  document.getElementById('modalInquiryService').textContent = inquiry.serviceName || inquiry.service;
  document.getElementById('modalInquiryBudget').textContent = inquiry.budget || 'Custom Discovery';
  document.getElementById('modalInquiryDesc').textContent = inquiry.description;
  document.getElementById('modalInquiryStatusSelect').value = inquiry.status;
  document.getElementById('modalInquiryInternalNotes').value = inquiry.internalNotes || '';

  const emailDraftBtn = document.getElementById('emailClientBtn');
  if (emailDraftBtn) {
    const subject = encodeURIComponent(`RSTechwerk – Following up on your inquiry: ${inquiry.serviceName || 'Project'}`);
    const body = encodeURIComponent(`Hi ${inquiry.name},\n\nThank you for reaching out to RSTechwerk regarding your project requirements.\n\nWe have reviewed your request and would be glad to schedule a brief discovery call.\n\nBest regards,\nRSTechwerk Engineering Team`);
    emailDraftBtn.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
  }

  modal.classList.add('open');
};

function closeInquiryModal() {
  const modal = document.getElementById('inquiryDetailModal');
  if (modal) modal.classList.remove('open');
  activeEditingInquiryId = null;
}

function promptCreateManualLead() {
  const name = prompt('Enter Client Full Name:');
  if (!name) return;
  const email = prompt('Enter Client Work Email:');
  if (!email) return;
  const company = prompt('Enter Company Name (Optional):') || 'Direct';
  const service = prompt('Enter Service (e.g. ERP, Web, Mobile, AI, Maintenance):') || 'Custom Software Development';
  const budget = prompt('Enter Estimated Budget (e.g. EUR €25,000):') || 'EUR €10,000 – 25,000';
  const description = prompt('Enter Project Scope Summary:') || 'Requested technical discussion.';

  const newLead = {
    id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    name,
    company,
    email,
    service: 'custom-software',
    serviceName: service,
    budget,
    status: 'new',
    description,
    internalNotes: 'Manually logged from admin portal.'
  };

  adminState.inquiries.unshift(newLead);
  saveAdminState();
  renderInquiriesTable();
  updateInquiriesBadges();
  showToast(`New lead ${newLead.id} added successfully!`);
}

function exportInquiriesToCsv() {
  if (!adminState.inquiries.length) {
    showToast('No inquiries available to export', 'error');
    return;
  }

  const headers = ['ID', 'Date', 'Full Name', 'Company', 'Email', 'Service', 'Budget', 'Status', 'Description', 'Notes'];
  const rows = adminState.inquiries.map(i => [
    i.id,
    i.date,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    `"${(i.company || '').replace(/"/g, '""')}"`,
    i.email,
    `"${(i.serviceName || i.service || '').replace(/"/g, '""')}"`,
    `"${(i.budget || '').replace(/"/g, '""')}"`,
    i.status,
    `"${(i.description || '').replace(/"/g, '""')}"`,
    `"${(i.internalNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rstechwerk-leads-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Leads CSV exported successfully!');
}

/* ==========================================================================
   5. Hero & Announcement Manager
   ========================================================================== */

function initHeroModule() {
  const pillInput = document.getElementById('heroAnnouncementPill');
  const subtextInput = document.getElementById('heroAnnouncementText');
  const prefixInput = document.getElementById('heroHeadlinePrefix');
  const gradientInput = document.getElementById('heroHeadlineGradient');
  const subheadInput = document.getElementById('heroSubhead');
  const primaryCtaInput = document.getElementById('heroPrimaryCtaText');
  const secondaryCtaInput = document.getElementById('heroSecondaryCtaText');
  const maintenanceCtaInput = document.getElementById('heroMaintenanceCtaText');
  const capabilitiesInput = document.getElementById('heroCapabilitiesTags');
  const saveBtn = document.getElementById('saveHeroBtn');

  // Populate inputs from state
  if (pillInput) pillInput.value = adminState.hero.pill;
  if (subtextInput) subtextInput.value = adminState.hero.subtext;
  if (prefixInput) prefixInput.value = adminState.hero.headlinePrefix;
  if (gradientInput) gradientInput.value = adminState.hero.headlineGradient;
  if (subheadInput) subheadInput.value = adminState.hero.subhead;
  if (primaryCtaInput) primaryCtaInput.value = adminState.hero.primaryCtaText;
  if (secondaryCtaInput) secondaryCtaInput.value = adminState.hero.secondaryCtaText;
  if (maintenanceCtaInput) maintenanceCtaInput.value = adminState.hero.maintenanceCtaText || 'Maintain Your Project';
  if (capabilitiesInput) capabilitiesInput.value = adminState.hero.capabilities.join(', ');

  // Live preview update function
  function updateHeroPreview() {
    const prevPill = document.getElementById('prevHeroPill');
    const prevSubtext = document.getElementById('prevHeroSubtext');
    const prevPrefix = document.getElementById('prevHeroPrefix');
    const prevGradient = document.getElementById('prevHeroGradient');
    const prevSubhead = document.getElementById('prevHeroSubhead');
    const prevPrimary = document.getElementById('prevPrimaryBtn');
    const prevSecondary = document.getElementById('prevSecondaryBtn');
    const prevMaintenance = document.getElementById('prevMaintenanceBtn');
    const tagsWrap = document.getElementById('prevTagsWrap');

    if (prevPill) prevPill.textContent = pillInput.value;
    if (prevSubtext) prevSubtext.textContent = subtextInput.value;
    if (prevPrefix) prevPrefix.textContent = prefixInput.value + ' ';
    if (prevGradient) prevGradient.textContent = gradientInput.value;
    if (prevSubhead) prevSubhead.textContent = subheadInput.value;
    if (prevPrimary) prevPrimary.textContent = primaryCtaInput.value + ' →';
    if (prevSecondary) prevSecondary.textContent = secondaryCtaInput.value;
    if (prevMaintenance && maintenanceCtaInput) prevMaintenance.textContent = maintenanceCtaInput.value;

    if (tagsWrap) {
      const tags = capabilitiesInput.value.split(',').map(t => t.trim()).filter(Boolean);
      tagsWrap.innerHTML = tags.map(t => `<span class="preview-tag-pill">${escapeHtml(t)}</span>`).join('');
    }
  }

  [pillInput, subtextInput, prefixInput, gradientInput, subheadInput, primaryCtaInput, secondaryCtaInput, maintenanceCtaInput, capabilitiesInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updateHeroPreview);
  });

  updateHeroPreview();

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      adminState.hero.pill = pillInput.value.trim();
      adminState.hero.subtext = subtextInput.value.trim();
      adminState.hero.headlinePrefix = prefixInput.value.trim();
      adminState.hero.headlineGradient = gradientInput.value.trim();
      adminState.hero.subhead = subheadInput.value.trim();
      adminState.hero.primaryCtaText = primaryCtaInput.value.trim();
      adminState.hero.secondaryCtaText = secondaryCtaInput.value.trim();
      adminState.hero.maintenanceCtaText = maintenanceCtaInput ? maintenanceCtaInput.value.trim() : 'Maintain Your Project';
      adminState.hero.capabilities = capabilitiesInput.value.split(',').map(t => t.trim()).filter(Boolean);

      saveAdminState();
      updateJsonSchemaDisplay();
      showToast('Hero section changes saved!');
    });
  }
}

/* ==========================================================================
   6. Services & Bento Module
   ========================================================================== */

function initServicesModule() {
  renderServicesGrid();

  const addBtn = document.getElementById('addNewServiceBtn');
  if (addBtn) addBtn.addEventListener('click', () => openServiceModal(null));

  initServiceModal();
}

function renderServicesGrid() {
  const container = document.getElementById('servicesAdminContainer');
  const countBadge = document.getElementById('servicesCountBadge');
  if (!container) return;

  if (countBadge) countBadge.textContent = adminState.services.length;

  container.innerHTML = adminState.services.map(srv => `
    <div class="service-admin-card" data-id="${srv.id}">
      <div class="card-top-row">
        <span class="card-kicker">${escapeHtml(srv.number)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(srv.title)}</h3>
      <p class="card-desc">${escapeHtml(srv.desc)}</p>
      
      <div class="card-deliverables-box">
        <div class="card-deliverables-title">Key Deliverables</div>
        <ul class="card-deliverables-list">
          ${srv.deliverables.map(d => `<li>• ${escapeHtml(d)}</li>`).join('')}
        </ul>
      </div>

      <div class="card-tech-tag">Stack: ${escapeHtml(srv.tech)}</div>

      <div class="card-actions-row">
        <button type="button" class="btn btn-secondary btn-sm" onclick="openServiceModal('${srv.id}')">Edit Card</button>
        <button type="button" class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteService('${srv.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function initServiceModal() {
  const modal = document.getElementById('serviceEditModal');
  const closeBtn = document.getElementById('closeServiceModalBtn');
  const cancelBtn = document.getElementById('cancelServiceModalBtn');
  const saveBtn = document.getElementById('saveServiceModalBtn');

  const closeFn = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', closeFn);
  if (cancelBtn) cancelBtn.addEventListener('click', closeFn);

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const id = document.getElementById('serviceModalId').value;
      const number = document.getElementById('serviceModalNumber').value.trim();
      const title = document.getElementById('serviceModalTitleInput').value.trim();
      const desc = document.getElementById('serviceModalDesc').value.trim();
      const tech = document.getElementById('serviceModalTech').value.trim();
      const deliverables = document.getElementById('serviceModalDeliverables').value.split('\n').map(s => s.trim()).filter(Boolean);

      if (!title || !desc) {
        alert('Please fill in both title and summary.');
        return;
      }

      if (id) {
        // Edit existing
        const item = adminState.services.find(s => s.id === id);
        if (item) {
          item.number = number;
          item.title = title;
          item.desc = desc;
          item.tech = tech;
          item.deliverables = deliverables;
        }
      } else {
        // New service
        adminState.services.push({
          id: `srv-${Date.now()}`,
          number: number || `0${adminState.services.length + 1}. Capability`,
          title,
          desc,
          tech,
          deliverables
        });
      }

      saveAdminState();
      renderServicesGrid();
      closeFn();
      showToast('Service card saved successfully!');
    });
  }
}

window.openServiceModal = function(id) {
  const modal = document.getElementById('serviceEditModal');
  if (!modal) return;

  const titleEl = document.getElementById('serviceModalTitle');
  const idInput = document.getElementById('serviceModalId');
  const numberInput = document.getElementById('serviceModalNumber');
  const titleInput = document.getElementById('serviceModalTitleInput');
  const descInput = document.getElementById('serviceModalDesc');
  const techInput = document.getElementById('serviceModalTech');
  const delivInput = document.getElementById('serviceModalDeliverables');

  if (id) {
    const srv = adminState.services.find(s => s.id === id);
    if (!srv) return;
    titleEl.textContent = 'Edit Service Card';
    idInput.value = srv.id;
    numberInput.value = srv.number;
    titleInput.value = srv.title;
    descInput.value = srv.desc;
    techInput.value = srv.tech;
    delivInput.value = srv.deliverables.join('\n');
  } else {
    titleEl.textContent = 'Add New Service Card';
    idInput.value = '';
    numberInput.value = `0${adminState.services.length + 1}. Core Service`;
    titleInput.value = '';
    descInput.value = '';
    techInput.value = '';
    delivInput.value = '';
  }

  modal.classList.add('open');
};

window.deleteService = function(id) {
  if (confirm('Delete this service card?')) {
    adminState.services = adminState.services.filter(s => s.id !== id);
    saveAdminState();
    renderServicesGrid();
    showToast('Service card removed', 'error');
  }
};

/* ==========================================================================
   7. Portfolio & Case Studies Module
   ========================================================================== */

function initPortfolioModule() {
  renderPortfolioGrid();

  const addBtn = document.getElementById('addNewProjectBtn');
  if (addBtn) addBtn.addEventListener('click', () => openProjectModal(null));

  initProjectModal();
}

function renderPortfolioGrid() {
  const container = document.getElementById('portfolioAdminContainer');
  const countBadge = document.getElementById('portfolioCountBadge');
  if (!container) return;

  if (countBadge) countBadge.textContent = adminState.portfolio.length;

  container.innerHTML = adminState.portfolio.map(proj => `
    <div class="project-admin-card" data-key="${proj.key}">
      ${(proj.image || PORTFOLIO_IMAGE_FALLBACKS[proj.key]) ? `<img class="project-admin-thumbnail" src="${escapeHtml(proj.image || PORTFOLIO_IMAGE_FALLBACKS[proj.key])}" alt="${escapeHtml(proj.title)} preview" loading="lazy" />` : ''}
      <div class="card-top-row">
        <span class="card-kicker">${escapeHtml(proj.industry)}</span>
        <span class="status-chip new" style="font-size:0.65rem;">Concept</span>
      </div>
      <h3 class="card-title">${escapeHtml(proj.title)}</h3>
      <p class="card-desc">${escapeHtml(proj.summary)}</p>

      <div class="card-deliverables-box">
        <div class="card-deliverables-title">The Challenge &amp; Solution</div>
        <p style="font-size: 0.76rem; color: var(--admin-text-secondary); margin-bottom: 0.4rem;"><strong>Problem:</strong> ${escapeHtml(proj.problem)}</p>
        <p style="font-size: 0.76rem; color: var(--admin-text-secondary);"><strong>Solution:</strong> ${escapeHtml(proj.solution)}</p>
      </div>

      <div class="card-tech-tag">Tags: ${escapeHtml(proj.categories)} · ${escapeHtml(proj.tech)}</div>

      <div class="card-actions-row">
        <button type="button" class="btn btn-secondary btn-sm" onclick="openProjectModal('${proj.key}')">Edit Case Study</button>
        <button type="button" class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteProject('${proj.key}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function initProjectModal() {
  const modal = document.getElementById('projectEditModal');
  const closeBtn = document.getElementById('closeProjectModalBtn');
  const cancelBtn = document.getElementById('cancelProjectModalBtn');
  const saveBtn = document.getElementById('saveProjectModalBtn');

  const closeFn = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', closeFn);
  if (cancelBtn) cancelBtn.addEventListener('click', closeFn);

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const key = document.getElementById('projectModalKey').value;
      const title = document.getElementById('projectModalName').value.trim();
      const industry = document.getElementById('projectModalIndustry').value.trim();
      const categories = document.getElementById('projectModalCategories').value.trim();
      const badge = document.getElementById('projectModalBadge').value.trim();
      const image = document.getElementById('projectModalImage').value.trim();
      const imageFile = document.getElementById('projectModalImageFile').files[0];
      const summary = document.getElementById('projectModalSummary').value.trim();
      const problem = document.getElementById('projectModalProblem').value.trim();
      const solution = document.getElementById('projectModalSolution').value.trim();
      const tech = document.getElementById('projectModalTech').value.trim();
      const features = document.getElementById('projectModalFeatures').value.split('\n').map(f => f.trim()).filter(Boolean);

      if (!title || !summary) {
        alert('Please fill in title and summary.');
        return;
      }

      saveBtn.disabled = true;
      try {
        const uploadedImage = imageFile ? await uploadPortfolioImage(imageFile) : '';
        const finalImage = uploadedImage || image;

        if (key) {
        const item = adminState.portfolio.find(p => p.key === key);
        if (item) {
          item.title = title;
          item.industry = industry;
          item.categories = categories;
          item.badge = badge;
          item.image = finalImage;
          item.summary = summary;
          item.problem = problem;
          item.solution = solution;
          item.tech = tech;
          item.features = features;
        }
        } else {
        const newKey = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        adminState.portfolio.push({
          key: newKey || `proj-${Date.now()}`,
          title,
          industry,
          categories,
          badge,
          image: finalImage,
          summary,
          problem,
          solution,
          tech,
          features
        });
        }

        saveAdminState();
        renderPortfolioGrid();
        closeFn();
        showToast(imageFile ? 'Image uploaded and case study saved!' : 'Portfolio case study saved!');
      } catch (error) {
        showToast(error.message || 'Could not upload image.', 'error');
      } finally {
        saveBtn.disabled = false;
      }
    });
  }
}

window.openProjectModal = function(key) {
  const modal = document.getElementById('projectEditModal');
  if (!modal) return;

  const titleEl = document.getElementById('projectModalTitle');
  const keyInput = document.getElementById('projectModalKey');
  const nameInput = document.getElementById('projectModalName');
  const industryInput = document.getElementById('projectModalIndustry');
  const catInput = document.getElementById('projectModalCategories');
  const badgeInput = document.getElementById('projectModalBadge');
  const imageInput = document.getElementById('projectModalImage');
  const sumInput = document.getElementById('projectModalSummary');
  const probInput = document.getElementById('projectModalProblem');
  const solInput = document.getElementById('projectModalSolution');
  const techInput = document.getElementById('projectModalTech');
  const featInput = document.getElementById('projectModalFeatures');

  if (key) {
    const proj = adminState.portfolio.find(p => p.key === key);
    if (!proj) return;
    titleEl.textContent = 'Edit Case Study';
    keyInput.value = proj.key;
    nameInput.value = proj.title;
    industryInput.value = proj.industry;
    catInput.value = proj.categories;
    badgeInput.value = proj.badge;
    imageInput.value = proj.image || PORTFOLIO_IMAGE_FALLBACKS[proj.key] || '';
    sumInput.value = proj.summary;
    probInput.value = proj.problem;
    solInput.value = proj.solution;
    techInput.value = proj.tech;
    featInput.value = (proj.features || []).join('\n');
  } else {
    titleEl.textContent = 'Add New Concept Project';
    keyInput.value = '';
    nameInput.value = '';
    industryInput.value = 'Enterprise SaaS';
    catInput.value = 'saas web erp';
    badgeInput.value = 'Concept Project · SaaS / Web';
    imageInput.value = '';
    sumInput.value = '';
    probInput.value = '';
    solInput.value = '';
    techInput.value = 'TypeScript, React, Node.js, PostgreSQL';
    featInput.value = '';
  }

  modal.classList.add('open');
};

window.deleteProject = function(key) {
  if (confirm('Delete this case study?')) {
    adminState.portfolio = adminState.portfolio.filter(p => p.key !== key);
    saveAdminState();
    renderPortfolioGrid();
    showToast('Case study deleted', 'error');
  }
};

/* ==========================================================================
   7.1 Process & Trust Strip Module
   ========================================================================== */

function initProcessModule() {
  renderProcessHeader();
  renderTrustBadges();
  renderProcessStages();
  initProcessStageModal();

  const saveHeaderBtn = document.getElementById('saveProcessHeaderBtn');
  if (saveHeaderBtn) {
    saveHeaderBtn.addEventListener('click', () => {
      const kicker = document.getElementById('processKickerInput')?.value || '';
      const title = document.getElementById('processTitleInput')?.value || '';
      const desc = document.getElementById('processDescInput')?.value || '';
      if (!adminState.process) adminState.process = {};
      adminState.process.kicker = kicker;
      adminState.process.title = title;
      adminState.process.description = desc;
      saveAdminState();
      showToast('Process section header saved!');
    });
  }

  const saveTrustBtn = document.getElementById('saveTrustStripBtn');
  if (saveTrustBtn) {
    saveTrustBtn.addEventListener('click', () => {
      if (!adminState.process || !Array.isArray(adminState.process.trustBadges)) return;
      adminState.process.trustBadges.forEach((tb, i) => {
        const labelEl = document.getElementById(`trust-label-${i}`);
        const detailEl = document.getElementById(`trust-detail-${i}`);
        if (labelEl) tb.label = labelEl.value;
        if (detailEl) tb.detail = detailEl.value;
      });
      saveAdminState();
      showToast('Trust strip principles saved!');
    });
  }

  const addBtn = document.getElementById('addNewProcessStageBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openStageModal());
  }
}

function renderProcessHeader() {
  const kicker = document.getElementById('processKickerInput');
  const title = document.getElementById('processTitleInput');
  const desc = document.getElementById('processDescInput');
  if (kicker && adminState.process?.kicker) kicker.value = adminState.process.kicker;
  if (title && adminState.process?.title) title.value = adminState.process.title;
  if (desc && adminState.process?.description) desc.value = adminState.process.description;
}

function renderTrustBadges() {
  const container = document.getElementById('trustBadgesAdminContainer');
  if (!container || !adminState.process?.trustBadges) return;

  container.innerHTML = adminState.process.trustBadges.map((tb, idx) => `
    <div class="trust-badge-card">
      <div class="form-group" style="margin-bottom:0.4rem;">
        <label class="form-label">Title / Metric (${tb.icon || '✓'})</label>
        <input type="text" id="trust-label-${idx}" class="form-input" value="${escapeHtml(tb.label)}" />
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Institutional Detail</label>
        <input type="text" id="trust-detail-${idx}" class="form-input" value="${escapeHtml(tb.detail)}" />
      </div>
    </div>
  `).join('');
}

function renderProcessStages() {
  const container = document.getElementById('processStagesAdminContainer');
  const countBadge = document.getElementById('processCountBadge');
  if (!container || !adminState.process?.stages) return;

  if (countBadge) countBadge.textContent = adminState.process.stages.length;

  container.innerHTML = adminState.process.stages.map(st => `
    <div class="process-admin-card" data-id="${st.id}">
      <div class="card-top-row">
        <span class="process-stage-badge">${escapeHtml(st.step)}</span>
        <div style="display:flex; gap:0.4rem;">
          <button type="button" class="btn-action-icon" onclick="openStageModal('${st.id}')">Edit</button>
          <button type="button" class="btn-action-icon" style="color:#ef4444;" onclick="deleteProcessStage('${st.id}')">Delete</button>
        </div>
      </div>
      <h3 class="card-title">${escapeHtml(st.title)}</h3>
      <p class="card-desc">${escapeHtml(st.desc)}</p>

      <div class="process-detail-item">
        <div class="process-detail-label">Key Deliverables</div>
        <div class="process-detail-text">${escapeHtml(st.deliverables || 'N/A')}</div>
      </div>

      <div class="process-detail-item">
        <div class="process-detail-label">Client Involvement</div>
        <div class="process-detail-text">${escapeHtml(st.involvement || 'N/A')}</div>
      </div>
    </div>
  `).join('');
}

function initProcessStageModal() {
  const modal = document.getElementById('stageEditModal');
  const closeBtn = document.getElementById('closeStageModalBtn');
  const cancelBtn = document.getElementById('cancelStageModalBtn');
  const saveBtn = document.getElementById('saveStageModalBtn');
  if (!modal) return;

  const hide = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (cancelBtn) cancelBtn.addEventListener('click', hide);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hide();
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const id = document.getElementById('stageModalId')?.value;
      const step = document.getElementById('stageModalStep')?.value.trim();
      const title = document.getElementById('stageModalTitleInput')?.value.trim();
      const desc = document.getElementById('stageModalDesc')?.value.trim();
      const deliverables = document.getElementById('stageModalDeliverables')?.value.trim();
      const involvement = document.getElementById('stageModalInvolvement')?.value.trim();

      if (!title || !step) {
        showToast('Please provide a step number and stage title', 'error');
        return;
      }

      if (!adminState.process) adminState.process = { stages: [] };
      if (!Array.isArray(adminState.process.stages)) adminState.process.stages = [];

      if (id) {
        const stage = adminState.process.stages.find(s => s.id === id);
        if (stage) {
          stage.step = step;
          stage.title = title;
          stage.desc = desc;
          stage.deliverables = deliverables;
          stage.involvement = involvement;
        }
      } else {
        adminState.process.stages.push({
          id: `proc-${Date.now()}`,
          step,
          title,
          desc,
          deliverables,
          involvement
        });
      }

      saveAdminState();
      renderProcessStages();
      hide();
      showToast('Process stage saved successfully!');
    });
  }
}

window.openStageModal = function(id) {
  const modal = document.getElementById('stageEditModal');
  if (!modal) return;
  const titleEl = document.getElementById('stageModalTitle');
  const idInput = document.getElementById('stageModalId');
  const stepInput = document.getElementById('stageModalStep');
  const titleInput = document.getElementById('stageModalTitleInput');
  const descInput = document.getElementById('stageModalDesc');
  const delInput = document.getElementById('stageModalDeliverables');
  const invInput = document.getElementById('stageModalInvolvement');

  if (id) {
    const stage = adminState.process?.stages?.find(s => s.id === id);
    if (!stage) return;
    titleEl.textContent = 'Edit Process Stage';
    idInput.value = stage.id;
    stepInput.value = stage.step;
    titleInput.value = stage.title;
    descInput.value = stage.desc;
    delInput.value = stage.deliverables;
    invInput.value = stage.involvement;
  } else {
    titleEl.textContent = 'Add New Process Stage';
    idInput.value = '';
    const stagesLen = adminState.process?.stages?.length || 0;
    const nextNum = (stagesLen + 1).toString().padStart(2, '0');
    stepInput.value = `${nextNum}. STAGE`;
    titleInput.value = '';
    descInput.value = '';
    delInput.value = 'Architecture blueprint & sprint roadmap.';
    invInput.value = 'Collaborative review and sprint confirmation.';
  }

  modal.classList.add('open');
};

window.deleteProcessStage = function(id) {
  if (confirm('Delete this delivery stage?')) {
    if (adminState.process?.stages) {
      adminState.process.stages = adminState.process.stages.filter(s => s.id !== id);
      saveAdminState();
      renderProcessStages();
      showToast('Process stage deleted', 'error');
    }
  }
};

/* ==========================================================================
   8. Maintenance Tiers Module
   ========================================================================== */

function initMaintenanceModule() {
  renderMaintenanceTiers();

  const saveBtn = document.getElementById('saveMaintenanceTiersBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Collect values from rendered inputs
      adminState.maintenance.monthly.forEach((tier, index) => {
        const titleInp = document.getElementById(`m-title-${index}`);
        const hoursInp = document.getElementById(`m-hours-${index}`);
        const slaInp = document.getElementById(`m-sla-${index}`);
        const descInp = document.getElementById(`m-desc-${index}`);
        if (titleInp) tier.title = titleInp.value;
        if (hoursInp) tier.hours = hoursInp.value;
        if (slaInp) tier.sla = slaInp.value;
        if (descInp) tier.desc = descInp.value;
      });

      adminState.maintenance.hourly.forEach((tier, index) => {
        const titleInp = document.getElementById(`h-title-${index}`);
        const hoursInp = document.getElementById(`h-hours-${index}`);
        const slaInp = document.getElementById(`h-sla-${index}`);
        const descInp = document.getElementById(`h-desc-${index}`);
        if (titleInp) tier.title = titleInp.value;
        if (hoursInp) tier.hours = hoursInp.value;
        if (slaInp) tier.sla = slaInp.value;
        if (descInp) tier.desc = descInp.value;
      });

      saveAdminState();
      showToast('Maintenance & Retainer tiers saved!');
    });
  }
}

function renderMaintenanceTiers() {
  const monthlyContainer = document.getElementById('monthlyTiersAdminContainer');
  const hourlyContainer = document.getElementById('hourlyTiersAdminContainer');

  if (monthlyContainer) {
    monthlyContainer.innerHTML = adminState.maintenance.monthly.map((tier, idx) => `
      <div class="tier-admin-card ${tier.featured ? 'featured' : ''}">
        <div class="form-group" style="margin-bottom:0.5rem;">
          <label class="form-label">Tier Name</label>
          <input type="text" id="m-title-${idx}" class="form-input" value="${escapeHtml(tier.title)}" />
        </div>
        <div class="form-grid two-col" style="margin-bottom:0.5rem;">
          <div class="form-group">
            <label class="form-label">Hours Capacity</label>
            <input type="text" id="m-hours-${idx}" class="form-input" value="${escapeHtml(tier.hours)}" />
          </div>
          <div class="form-group">
            <label class="form-label">SLA Tag</label>
            <input type="text" id="m-sla-${idx}" class="form-input" value="${escapeHtml(tier.sla)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea id="m-desc-${idx}" class="form-textarea" rows="2">${escapeHtml(tier.desc)}</textarea>
        </div>
      </div>
    `).join('');
  }

  if (hourlyContainer) {
    hourlyContainer.innerHTML = adminState.maintenance.hourly.map((tier, idx) => `
      <div class="tier-admin-card ${tier.featured ? 'featured' : ''}">
        <div class="form-group" style="margin-bottom:0.5rem;">
          <label class="form-label">Pack Name</label>
          <input type="text" id="h-title-${idx}" class="form-input" value="${escapeHtml(tier.title)}" />
        </div>
        <div class="form-grid two-col" style="margin-bottom:0.5rem;">
          <div class="form-group">
            <label class="form-label">Hours Capacity</label>
            <input type="text" id="h-hours-${idx}" class="form-input" value="${escapeHtml(tier.hours)}" />
          </div>
          <div class="form-group">
            <label class="form-label">SLA / Validity</label>
            <input type="text" id="h-sla-${idx}" class="form-input" value="${escapeHtml(tier.sla)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea id="h-desc-${idx}" class="form-textarea" rows="2">${escapeHtml(tier.desc)}</textarea>
        </div>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   8.1 Tech Stack & Tools Module
   ========================================================================== */

function initTechStackModule() {
  renderTechHeader();
  renderTechCategories();
  initTechCategoryModal();

  const saveHeaderBtn = document.getElementById('saveTechHeaderBtn');
  if (saveHeaderBtn) {
    saveHeaderBtn.addEventListener('click', () => {
      const kicker = document.getElementById('techKickerInput')?.value || '';
      const title = document.getElementById('techTitleInput')?.value || '';
      const desc = document.getElementById('techDescInput')?.value || '';
      if (!adminState.techStack) adminState.techStack = {};
      adminState.techStack.kicker = kicker;
      adminState.techStack.title = title;
      adminState.techStack.description = desc;
      saveAdminState();
      showToast('Tech stack header saved!');
    });
  }

  const addBtn = document.getElementById('addNewTechCategoryBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openTechModal());
  }
}

function renderTechHeader() {
  const kicker = document.getElementById('techKickerInput');
  const title = document.getElementById('techTitleInput');
  const desc = document.getElementById('techDescInput');
  if (kicker && adminState.techStack?.kicker) kicker.value = adminState.techStack.kicker;
  if (title && adminState.techStack?.title) title.value = adminState.techStack.title;
  if (desc && adminState.techStack?.description) desc.value = adminState.techStack.description;
}

function renderTechCategories() {
  const container = document.getElementById('techCategoriesAdminContainer');
  const countBadge = document.getElementById('techCountBadge');
  if (!container || !adminState.techStack?.categories) return;

  if (countBadge) countBadge.textContent = adminState.techStack.categories.length;

  container.innerHTML = adminState.techStack.categories.map(cat => `
    <div class="tech-category-card" data-id="${cat.id}">
      <div class="card-top-row">
        <h3 class="card-title" style="margin:0;">${escapeHtml(cat.name)}</h3>
        <div style="display:flex; gap:0.4rem;">
          <button type="button" class="btn-action-icon" onclick="openTechModal('${cat.id}')">Edit</button>
          <button type="button" class="btn-action-icon" style="color:#ef4444;" onclick="deleteTechCategory('${cat.id}')">Delete</button>
        </div>
      </div>
      <p class="card-desc" style="margin-top:0.35rem; margin-bottom:0.75rem;">${escapeHtml(cat.role)}</p>

      <div class="tech-tags-wrapper">
        ${(cat.tags || []).map((t, idx) => `
          <span class="tech-tag-chip">
            <span>${escapeHtml(t)}</span>
            <button type="button" class="tech-tag-remove-btn" onclick="removeTechTag('${cat.id}', ${idx})" title="Remove tag">&times;</button>
          </span>
        `).join('')}
      </div>

      <div class="tech-add-tag-form">
        <input type="text" class="form-input form-input-sm" id="new-tag-input-${cat.id}" placeholder="Add tool (e.g. Next.js)..." />
        <button type="button" class="btn btn-secondary btn-sm" onclick="addTechTag('${cat.id}')">+ Add</button>
      </div>
    </div>
  `).join('');
}

window.addTechTag = function(catId) {
  const input = document.getElementById(`new-tag-input-${catId}`);
  if (!input || !input.value.trim()) return;
  const cat = adminState.techStack?.categories?.find(c => c.id === catId);
  if (!cat) return;
  if (!Array.isArray(cat.tags)) cat.tags = [];
  cat.tags.push(input.value.trim());
  input.value = '';
  saveAdminState();
  renderTechCategories();
  showToast('Tool added to stack');
};

window.removeTechTag = function(catId, tagIndex) {
  const cat = adminState.techStack?.categories?.find(c => c.id === catId);
  if (!cat || !cat.tags) return;
  cat.tags.splice(tagIndex, 1);
  saveAdminState();
  renderTechCategories();
};

function initTechCategoryModal() {
  const modal = document.getElementById('techCategoryModal');
  const closeBtn = document.getElementById('closeTechCategoryModalBtn');
  const cancelBtn = document.getElementById('cancelTechCategoryModalBtn');
  const saveBtn = document.getElementById('saveTechCategoryModalBtn');
  if (!modal) return;

  const hide = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (cancelBtn) cancelBtn.addEventListener('click', hide);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hide();
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const id = document.getElementById('techCategoryModalId')?.value;
      const name = document.getElementById('techCategoryModalName')?.value.trim();
      const role = document.getElementById('techCategoryModalRole')?.value.trim();
      const tagsRaw = document.getElementById('techCategoryModalTags')?.value || '';
      const tags = tagsRaw.split(',').map(s => s.trim()).filter(Boolean);

      if (!name) {
        showToast('Please provide a category name', 'error');
        return;
      }

      if (!adminState.techStack) adminState.techStack = { categories: [] };
      if (!Array.isArray(adminState.techStack.categories)) adminState.techStack.categories = [];

      if (id) {
        const cat = adminState.techStack.categories.find(c => c.id === id);
        if (cat) {
          cat.name = name;
          cat.role = role;
          cat.tags = tags;
        }
      } else {
        adminState.techStack.categories.push({
          id: `cat-${Date.now()}`,
          name,
          role,
          tags
        });
      }

      saveAdminState();
      renderTechCategories();
      hide();
      showToast('Tech category saved successfully!');
    });
  }
}

window.openTechModal = function(id) {
  const modal = document.getElementById('techCategoryModal');
  if (!modal) return;
  const titleEl = document.getElementById('techCategoryModalTitle');
  const idInput = document.getElementById('techCategoryModalId');
  const nameInput = document.getElementById('techCategoryModalName');
  const roleInput = document.getElementById('techCategoryModalRole');
  const tagsInput = document.getElementById('techCategoryModalTags');

  if (id) {
    const cat = adminState.techStack?.categories?.find(c => c.id === id);
    if (!cat) return;
    titleEl.textContent = 'Edit Stack Category';
    idInput.value = cat.id;
    nameInput.value = cat.name;
    roleInput.value = cat.role;
    tagsInput.value = (cat.tags || []).join(', ');
  } else {
    titleEl.textContent = 'Add New Stack Category';
    idInput.value = '';
    nameInput.value = '';
    roleInput.value = 'Core engineering tools & frameworks';
    tagsInput.value = 'React, TypeScript, Node.js, Docker';
  }

  modal.classList.add('open');
};

window.deleteTechCategory = function(id) {
  if (confirm('Delete this entire tech category?')) {
    if (adminState.techStack?.categories) {
      adminState.techStack.categories = adminState.techStack.categories.filter(c => c.id !== id);
      saveAdminState();
      renderTechCategories();
      showToast('Tech category deleted', 'error');
    }
  }
};

/* ==========================================================================
   9. FAQ Module
   ========================================================================== */

function initFaqModule() {
  renderFaqList();

  const addBtn = document.getElementById('addNewFaqBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const q = prompt('Enter FAQ Question:');
      if (!q) return;
      const a = prompt('Enter FAQ Answer:');
      if (!a) return;

      adminState.faqs.push({
        id: `faq-${Date.now()}`,
        question: q,
        answer: a
      });

      saveAdminState();
      renderFaqList();
      showToast('New FAQ added!');
    });
  }
}

function renderFaqList() {
  const container = document.getElementById('faqAdminListContainer');
  const countBadge = document.getElementById('faqCountBadge');
  if (!container) return;

  if (countBadge) countBadge.textContent = adminState.faqs.length;

  container.innerHTML = adminState.faqs.map(faq => `
    <div class="faq-admin-item" data-id="${faq.id}">
      <div class="faq-item-header">
        <span class="faq-question-text">${escapeHtml(faq.question)}</span>
        <div style="display:flex; gap:0.4rem;">
          <button type="button" class="btn-action-icon" onclick="editFaq('${faq.id}')">Edit</button>
          <button type="button" class="btn-action-icon" style="color:#ef4444;" onclick="deleteFaq('${faq.id}')">Delete</button>
        </div>
      </div>
      <p class="faq-answer-text">${escapeHtml(faq.answer)}</p>
    </div>
  `).join('');
}

window.editFaq = function(id) {
  const faq = adminState.faqs.find(f => f.id === id);
  if (!faq) return;
  const newQ = prompt('Edit Question:', faq.question);
  if (newQ === null) return;
  const newA = prompt('Edit Answer:', faq.answer);
  if (newA === null) return;

  faq.question = newQ;
  faq.answer = newA;
  saveAdminState();
  renderFaqList();
  showToast('FAQ updated!');
};

window.deleteFaq = function(id) {
  if (confirm('Delete this FAQ question?')) {
    adminState.faqs = adminState.faqs.filter(f => f.id !== id);
    saveAdminState();
    renderFaqList();
    showToast('FAQ removed', 'error');
  }
};

/* ==========================================================================
   9.1 Live SEO & Rich Snippets Preview Module
   ========================================================================== */

function initSeoLiveModule() {
  const titleInput = document.getElementById('seoQuickTitle');
  const descInput = document.getElementById('seoQuickDesc');
  const applyBtn = document.getElementById('applyQuickSeoBtn');
  const copyBtn = document.getElementById('copySchemaJsonBtn');

  // Populate from settings
  if (titleInput && adminState.settings?.metaTitle) {
    titleInput.value = adminState.settings.metaTitle;
  }
  if (descInput && adminState.settings?.metaDescription) {
    descInput.value = adminState.settings.metaDescription;
  }

  const updatePreview = () => {
    const titleVal = titleInput?.value || adminState.settings?.metaTitle || 'RSTechwerk – Software Solutions';
    const descVal = descInput?.value || adminState.settings?.metaDescription || '';

    const titlePreview = document.getElementById('serpTitlePreview');
    const descPreview = document.getElementById('serpDescPreview');
    const titleCount = document.getElementById('seoTitleCount');
    const descCount = document.getElementById('seoDescCount');

    if (titlePreview) titlePreview.textContent = titleVal;
    if (descPreview) descPreview.textContent = descVal;
    if (titleCount) titleCount.textContent = `${titleVal.length} / 60 chars`;
    if (descCount) descCount.textContent = `${descVal.length} / 160 chars`;

    // Social card preview
    const socialTitle = document.getElementById('socialCardTitle');
    const socialDesc = document.getElementById('socialCardDesc');
    if (socialTitle) socialTitle.textContent = titleVal;
    if (socialDesc) socialDesc.textContent = descVal;

    // Refresh Schema.org JSON-LD
    renderSchemaJson(titleVal, descVal);
  };

  if (titleInput) titleInput.addEventListener('input', updatePreview);
  if (descInput) descInput.addEventListener('input', updatePreview);

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      if (titleInput) adminState.settings.metaTitle = titleInput.value.trim();
      if (descInput) adminState.settings.metaDescription = descInput.value.trim();

      // Mirror to main settings tab inputs
      const mainTitle = document.getElementById('settingMetaTitle');
      const mainDesc = document.getElementById('settingMetaDescription');
      if (mainTitle && titleInput) mainTitle.value = titleInput.value;
      if (mainDesc && descInput) mainDesc.value = descInput.value;

      saveAdminState();
      showToast('SEO metadata saved and applied to live site!');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeBlock = document.getElementById('schemaJsonCodeBlock');
      if (codeBlock && navigator.clipboard) {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          showToast('Schema.org JSON-LD copied to clipboard!');
        });
      }
    });
  }

  updatePreview();
}

function renderSchemaJson(title, desc) {
  const codeBlock = document.getElementById('schemaJsonCodeBlock');
  if (!codeBlock) return;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://rstechwerk.com/#organization",
        "name": adminState.settings?.companyName || "RSTechwerk",
        "url": adminState.settings?.canonicalUrl || "https://rstechwerk.com/",
        "logo": adminState.settings?.ogImage || "https://rstechwerk.com/og-preview.png",
        "image": adminState.settings?.ogImage || "https://rstechwerk.com/og-preview.png",
        "description": desc,
        "email": adminState.settings?.inquiryEmail || "inquiry@rstechwerk.com",
        "priceRange": "€€€",
        "areaServed": ["DE", "AT", "CH", "EU", "GB", "Global"],
        "knowsAbout": [
          "Custom Software Development",
          "Web & SaaS Platforms",
          "Mobile App Development",
          "PostgreSQL Architecture",
          "Full-Stack Engineering Retainers"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://rstechwerk.com/#faq",
        "mainEntity": (adminState.faqs || []).map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }
    ]
  };

  codeBlock.textContent = JSON.stringify(schema, null, 2);
}

/* ==========================================================================
   10. Company Settings & SEO Module
   ========================================================================== */

function initSettingsModule() {
  const nameInput = document.getElementById('settingCompanyName');
  const emailInput = document.getElementById('settingInquiryEmail');
  const slaInput = document.getElementById('settingResponseSla');
  const ndaInput = document.getElementById('settingNdaText');
  const cityOneInput = document.getElementById('settingCityOne');
  const cityTwoInput = document.getElementById('settingCityTwo');

  const metaTitleInput = document.getElementById('settingMetaTitle');
  const metaDescInput = document.getElementById('settingMetaDescription');
  const canonicalInput = document.getElementById('settingCanonicalUrl');
  const ogImgInput = document.getElementById('settingOgImage');

  const saveBtn = document.getElementById('saveCompanySettingsBtn');

  // Populate from state
  if (nameInput) nameInput.value = adminState.settings.companyName;
  if (emailInput) emailInput.value = adminState.settings.inquiryEmail;
  if (slaInput) slaInput.value = adminState.settings.responseSla;
  if (ndaInput) ndaInput.value = adminState.settings.ndaText;
  if (cityOneInput) cityOneInput.value = adminState.settings.cityOne;
  if (cityTwoInput) cityTwoInput.value = adminState.settings.cityTwo;

  if (metaTitleInput) metaTitleInput.value = adminState.settings.metaTitle;
  if (metaDescInput) metaDescInput.value = adminState.settings.metaDescription;
  if (canonicalInput) canonicalInput.value = adminState.settings.canonicalUrl;
  if (ogImgInput) ogImgInput.value = adminState.settings.ogImage;

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      adminState.settings.companyName = nameInput.value.trim();
      adminState.settings.inquiryEmail = emailInput.value.trim();
      adminState.settings.responseSla = slaInput.value.trim();
      adminState.settings.ndaText = ndaInput.value.trim();
      adminState.settings.cityOne = cityOneInput.value.trim();
      adminState.settings.cityTwo = cityTwoInput.value.trim();

      adminState.settings.metaTitle = metaTitleInput.value.trim();
      adminState.settings.metaDescription = metaDescInput.value.trim();
      adminState.settings.canonicalUrl = canonicalInput.value.trim();
      adminState.settings.ogImage = ogImgInput.value.trim();

      saveAdminState();
      updateJsonSchemaDisplay();
      showToast('All company settings and SEO meta saved!');
    });
  }
}

/* ==========================================================================
   11. API & Backend Schemas Module
   ========================================================================== */

function initApiModule() {
  const baseInput = document.getElementById('backendBaseUrl');
  const webhookInput = document.getElementById('webhookInquiryUrl');
  const saveBtn = document.getElementById('saveApiConfigBtn');
  const testBtn = document.getElementById('testApiEndpointBtn');
  const copyBtn = document.getElementById('copyJsonSchemaBtn');

  if (baseInput) baseInput.value = adminState.settings.backendBaseUrl || '/api';
  if (webhookInput) webhookInput.value = adminState.settings.webhookUrl || '';

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      adminState.settings.backendBaseUrl = baseInput.value.trim();
      adminState.settings.webhookUrl = webhookInput.value.trim();
      saveAdminState();
      showToast('Backend API configuration saved!');
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      const url = baseInput.value.trim();
      showToast(`Testing local endpoint: ${url}...`, 'info');
      try {
        const res = await fetch(`${url}/health`, { method: 'GET' });
        if (res.ok) {
          showToast(`Endpoint ${url} connected successfully! (HTTP 200)`);
        } else {
          showToast(`Endpoint responded with status ${res.status}. Ready for your server logic!`, 'info');
        }
      } catch (err) {
        showToast(`Ready for backend connection. Route ${url} is configured.`, 'info');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const display = document.getElementById('jsonSchemaDisplay');
      if (display) {
        navigator.clipboard.writeText(display.textContent).then(() => {
          showToast('JSON schema payload copied to clipboard!');
        });
      }
    });
  }

  updateJsonSchemaDisplay();
}

function updateJsonSchemaDisplay() {
  const display = document.getElementById('jsonSchemaDisplay');
  if (!display) return;

  const payload = {
    meta: {
      generator: 'RSTechwerk Control Engine API v2',
      domain: 'rstechwerk.com',
      timestamp: new Date().toISOString(),
      environment: 'production'
    },
    hero: adminState.hero,
    servicesCount: adminState.services.length,
    services: adminState.services,
    portfolioCount: adminState.portfolio.length,
    portfolio: adminState.portfolio,
    maintenance: adminState.maintenance,
    faqsCount: adminState.faqs.length,
    faqs: adminState.faqs,
    settings: adminState.settings
  };

  display.textContent = JSON.stringify(payload, null, 2);
}

/* ==========================================================================
   12. Synchronize Inquiries from Public Form
   ========================================================================== */

function checkForNewPublicInquiry() {
  try {
    const rawLatest = localStorage.getItem('tecklumo_latest_inquiry');
    if (rawLatest) {
      const latest = JSON.parse(rawLatest);
      // Check if already in inquiries list
      const exists = adminState.inquiries.some(i => i.id === latest.id || (i.email === latest.email && i.date === latest.date));
      if (!exists && latest.name && latest.email) {
        adminState.inquiries.unshift({
          id: latest.id || `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
          date: latest.date || new Date().toISOString().split('T')[0],
          name: latest.name,
          company: latest.company || 'Website Inquiry',
          email: latest.email,
          service: latest.service || 'custom-software',
          serviceName: latest.serviceName || latest.service,
          budget: latest.budget || 'EUR €10,000 – 25,000',
          status: 'new',
          description: latest.description || 'Submitted via landing page inquiry form.',
          internalNotes: 'Auto-ingested from live website submission.'
        });
        saveAdminState();
        renderInquiriesTable();
        updateInquiriesBadges();
        showToast(`★ New incoming inquiry received from ${latest.name}!`);
        localStorage.removeItem('tecklumo_latest_inquiry');
      }
    }
  } catch (e) {
    console.error('Inquiry check error', e);
  }
}

/* ==========================================================================
   13. Reset & Sync Helpers
   ========================================================================== */

function initResetDataHandler() {
  const resetBtn = document.getElementById('resetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore default template data? Any custom inquiries or text edits will be reset.')) {
        localStorage.removeItem(STORAGE_KEY_ADMIN);
        localStorage.removeItem(STORAGE_KEY_PUBLISHED);
        adminState = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DATA));
        saveAdminState();
        location.reload();
      }
    });
  }

  const syncBtn = document.getElementById('syncLiveBtn');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      saveAdminState();
      showToast('All changes synchronized with public landing page!');
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
