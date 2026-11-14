/**
 * RSTechwerk - Software Development & Technology Solutions
 * Domain: rstechwerk.com
 * Vanilla JavaScript: Accessible Interactions, Portfolio Filter, Case Study Dialogs, FAQ Accordion, Form Validation
 */

// Enable progressive enhancement class for CSS reveals
document.documentElement.classList.add('js');

// Configurable endpoint hook for production deployment
const CONFIG = {
  // Vite proxies this path to the local API in development. In production,
  // serve the API behind the same origin or set a full API URL at deploy time.
  apiEndpoint: '/api/inquiries',
  companyName: 'RSTechwerk',
  companyDomain: 'rstechwerk.com',
  companyEmail: 'inquiry@rstechwerk.com'
};
const PORTFOLIO_IMAGE_FALLBACKS = {
  nordiclogix: '/assets/portfolio/nordiclogix-v2.png',
  klinikflow: '/assets/portfolio/klinikflow-v2.png',
  voltgrid: '/assets/portfolio/voltgrid-iq-v2.png',
  aurapay: '/assets/portfolio/aurapay-v2.png',
  craftbourse: '/assets/portfolio/craftbourse-v2.png',
  sensora: '/assets/portfolio/sensora-field-v2.png'
};

const LANGUAGE_COPY = {
  de: {
    'Services': 'Leistungen', 'Work': 'Projekte', 'Process': 'Prozess', 'About': 'Über uns', 'FAQ': 'FAQ', 'Client Portal': 'Kundenportal',
    'Discuss Your Project': 'Projekt besprechen', 'Start Your Project': 'Projekt starten', 'Explore Our Work': 'Unsere Projekte ansehen', 'Maintain Your Project': 'Projektwartung & Retainer',
    'Europe & DACH': 'Europa & DACH', 'Senior Product Engineering': 'Senior Product Engineering',
    'Build digital products': 'Digitale Produkte entwickeln', 'that move your business forward.': 'die Ihr Unternehmen voranbringen.',
    'From first idea to production-ready software, we help ambitious businesses launch faster with reliable design, development, and ongoing support.': 'Von der ersten Idee bis zur produktionsreifen Software unterstützen wir ambitionierte Unternehmen mit zuverlässigem Design, Entwicklung und laufender Betreuung.',
    'Web Platforms': 'Webplattformen', 'Mobile Apps': 'Mobile Apps', 'SaaS Systems': 'SaaS-Systeme', 'AI Solutions': 'KI-Lösungen', 'ERP & Business Systems': 'ERP & Geschäftssysteme', 'APIs & Integrations': 'APIs & Integrationen', 'Cloud & DevOps': 'Cloud & DevOps', 'ERP & Business': 'ERP & Geschäftssysteme',
    'Built for serious delivery': 'Für zuverlässige Umsetzung', 'Senior engineering': 'Senior Engineering', 'Weekly demos': 'Wöchentliche Demos', 'Full code ownership': 'Volle Code-Rechte', 'European time-zone overlap': 'Europäische Zeitzonen-Überschneidung',
    'What We Build': 'Unsere Leistungen', 'Software built around your business': 'Software, die sich an Ihrem Unternehmen orientiert', '—not the other way around.': '– nicht umgekehrt.',
    'From ERP systems and SaaS platforms to AI workflows and mobile apps, we design and build technology that makes your business faster, smarter, and easier to scale.': 'Von ERP-Systemen und SaaS-Plattformen bis hin zu KI-Workflows und mobilen Apps entwickeln wir Technologie, die Ihr Unternehmen schneller, intelligenter und skalierbarer macht.',
    'Portfolio & Prototypes': 'Portfolio & Prototypen', 'Real products start with': 'Echte Produkte beginnen mit', 'real problems.': 'echten Problemen.', 'Explore selected product concepts across logistics, healthcare, energy, fintech, and commerce—each shaped around a real operational challenge.': 'Entdecken Sie ausgewählte Produktkonzepte für Logistik, Gesundheitswesen, Energie, Fintech und Handel – jeweils entwickelt für eine konkrete operative Herausforderung.',
    'How We Deliver': 'Unsere Vorgehensweise', 'From first conversation to': 'Vom ersten Gespräch bis zum', 'confident launch.': 'sicheren Launch.', 'A clear five-stage process turns your idea into a reliable product—with visible progress, focused collaboration, and no unnecessary surprises.': 'Ein klarer Prozess in fünf Phasen verwandelt Ihre Idee in ein zuverlässiges Produkt – mit sichtbarem Fortschritt, fokussierter Zusammenarbeit und ohne unnötige Überraschungen.',
    'Why RSTechwerk': 'Warum RSTechwerk', 'Why Tecklumo': 'Warum RSTechwerk', 'A better way to build software': 'Software gemeinsam besser entwickeln', 'together.': '– gemeinsam.', 'The best products come from strong partnerships—clear communication, thoughtful engineering, and a team that stays accountable from day one.': 'Die besten Produkte entstehen durch starke Partnerschaften – klare Kommunikation, durchdachte Technik und ein Team, das vom ersten Tag an Verantwortung übernimmt.',
    'Technical Capabilities': 'Technische Kompetenzen', 'The right technology for': 'Die richtige Technologie für', 'lasting products.': 'nachhaltige Produkte.', 'We choose proven tools with strong ecosystems—so your product stays fast, maintainable, and ready for what comes next.': 'Wir wählen bewährte Technologien mit starken Ökosystemen, damit Ihr Produkt schnell, wartbar und zukunftssicher bleibt.',
    'About RSTechwerk': 'Über RSTechwerk', 'About Tecklumo': 'Über RSTechwerk', 'A dedicated team for': 'Ein engagiertes Team für', 'ambitious digital products.': 'ambitionierte digitale Produkte.', 'Frequently Asked Questions': 'Häufige Fragen', 'Clear answers for a': 'Klare Antworten für einen', 'confident start.': 'sicheren Start.', 'Everything you need to know about our process, communication, ownership, and delivery timelines.': 'Alles über unseren Prozess, Kommunikation, Eigentum und Lieferzeiten.',
    'Start a Conversation': 'Gespräch starten', 'Let’s build something': 'Lassen Sie uns etwas', 'valuable.': 'Wertvolles entwickeln.', 'Bring us a clear brief or just a rough idea. We’ll help shape the right product, technology, and next step for your business.': 'Bringen Sie uns ein klares Briefing oder nur eine grobe Idee. Wir helfen Ihnen beim passenden Produkt, der Technologie und dem nächsten Schritt.',
    'Direct Email': 'Direkte E-Mail', 'Response Time': 'Antwortzeit', 'Mutual Non-Disclosure': 'Gegenseitige Vertraulichkeit',
    'Submit Project Inquiry': 'Projektanfrage senden', 'Full Name': 'Vollständiger Name', 'Company Name (Optional)': 'Unternehmen (optional)', 'Service Interest': 'Gewünschte Leistung', 'Project Requirements': 'Projektanforderungen',
    'Maintenance': 'Wartung & Support', 'Maintenance & Retainers': 'Wartung & Retainer', 'Dedicated Engineering & Retainers': 'Dedizierte Entwicklung & Wartung',
    'Hire an expert engineering team': 'Erfahrenes Entwicklerteam mieten', 'monthly or on demand.': 'monatlich oder auf Abruf.',
    'Keep your production software reliable, secure, and continuously evolving. Hire our senior engineering squad for monthly maintenance retainers or book flexible hourly sprint packs—with guaranteed SLAs, direct developer communication, and complete code ownership.': 'Halten Sie Ihre produktive Software zuverlässig, sicher und zukunftsfähig. Mieten Sie unser Senior-Entwicklerteam auf monatlicher Retainer-Basis oder buchen Sie flexible Stundenpakete – mit garantierten SLAs, direktem Entwicklerkontakt und vollem Code-Eigentum.',
    'Monthly Dedicated Retainers': 'Monatliche Retainer (Dediziertes Team)', 'Hourly & Sprint Packs': 'Stunden- & Sprint-Pakete (Flexibel)',
    'Essential Care': 'Essential Care', 'Growth & Scale Pod': 'Growth & Scale Pod', 'Dedicated Team Pod': 'Dediziertes Team-Pod',
    'Quick-Fix Sprint': 'Quick-Fix Sprint', 'Modernization Pack': 'Modernisierungs-Paket', 'Flexible Engineering Bucket': 'Flexibles Stundenkontingent',
    'per month dedicated': 'pro Monat dediziert', 'full-time team pod': 'Vollzeit-Team-Pod',
    'valid for 60 calendar days': 'gültig für 60 Kalendertage', 'valid for 90 calendar days': 'gültig für 90 Kalendertage', 'valid for 180 calendar days': 'gültig für 180 Kalendertage',
    'Select Essential Retainer': 'Essential Retainer wählen', 'Select Growth Retainer': 'Growth Retainer wählen', 'Hire Dedicated Team': 'Dediziertes Team mieten',
    'Book 10h Quick-Fix': '10h Quick-Fix buchen', 'Book 25h Modernization': '25h Modernisierung buchen', 'Book 50h Flexible Bucket': '50h Kontingent buchen',
    'European Timezone Overlap': 'Europäische Zeitzonen-Überschneidung', '100% Client Code Ownership': '100% Code-Eigentum beim Kunden',
    'Direct Senior Developer Access': 'Direkter Kontakt zu Senior-Entwicklern', 'Tested on Staging First': 'Zuerst auf Staging getestet'
  }
};
const ORIGINAL_TEXT = new WeakMap();

function applyLanguage(language) {
  const translations = LANGUAGE_COPY[language] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, node.nodeValue);
    const source = ORIGINAL_TEXT.get(node);
    const original = source.trim();
    if (!original) return;
    node.nodeValue = translations[original] ? source.replace(original, translations[original]) : source;
  });
}

// Case Study Projects Database (Concept Projects)
const CASE_STUDIES = {
  nordiclogix: {
    title: 'NordicLogix',
    badge: 'Concept Project · SaaS / Web',
    industry: 'Freight & Logistics Orchestration',
    summary: 'A cloud-based freight and multi-stop logistics platform designed for European cross-border carriers operating across DACH and Nordic transport corridors.',
    problem: 'European freight forwarders grapple with fragmented telematics systems, manual paper-based customs consignment notes (e-CMR), and unpredictable border delays that complicate ETA forecasting.',
    solution: 'We architected a unified logistics dashboard that ingests real-time GPS telemetry, automates digital consignment note generation, and recalculates optimal route deviations dynamically.',
    features: [
      'Real-time GPS vehicle tracking with automatic geofence alerts',
      'Digital e-CMR document generation compliant with cross-border protocols',
      'Dynamic multi-stop route optimization and toll cost estimation',
      'Sub-contractor carrier portal with instant proof-of-delivery uploads'
    ],
    techStack: 'TypeScript, React, Node.js, PostgreSQL, Docker, Redis, Leaflet Mapping'
  },
  klinikflow: {
    title: 'KlinikFlow',
    badge: 'Concept Project · Web / SaaS',
    industry: 'Outpatient Healthcare Workflow',
    summary: 'A streamlined patient intake and clinical workflow portal engineered for medical practices and outpatient clinics in Germany and the EU.',
    problem: 'Administrative staff and practitioners spend up to 30% of their working hours manually transcribing paper intake forms and managing appointment reschedules, leading to patient delays.',
    solution: 'Designed an accessible web application allowing patients to securely complete triage questionnaires from home, view estimated wait times, and exchange encrypted records with clinical staff.',
    features: [
      'Zero-installation mobile-friendly patient check-in questionnaire',
      'Automated appointment reminder sequences via SMS and email',
      'Role-based clinical dashboard with practitioner handoff notes',
      'Structured export compatible with healthcare record standards'
    ],
    techStack: 'Next.js, TypeScript, Tailwind CSS, PostgreSQL, REST APIs, Web Crypto API'
  },
  voltgrid: {
    title: 'VoltGrid IQ',
    badge: 'Concept Project · AI / Web',
    industry: 'Renewable Energy & Battery Telemetry',
    summary: 'An intelligent energy telemetry dashboard enabling commercial micro-grid operators to forecast day-ahead electricity prices and optimize battery dispatch schedules.',
    problem: 'Commercial solar and energy storage systems frequently miss optimal revenue windows because manual dispatch strategies cannot keep pace with hourly fluctuations on European energy spot markets.',
    solution: 'Built an automated dispatch modeling platform that combines weather forecasts with time-series machine learning models to recommend automated battery charge and discharge cycles.',
    features: [
      '24-hour day-ahead European electricity tariff ingestion and visualization',
      'Automated peak-shaving recommendations to minimize grid demand surcharges',
      'Real-time inverter telemetry tracking with sub-second alert thresholds',
      'Historical efficiency and degradation reporting for commercial storage'
    ],
    techStack: 'Python time-series engine, Node.js, React, Chart engine, Docker, MQTT'
  },
  aurapay: {
    title: 'AuraPay',
    badge: 'Concept Project · Mobile / Web',
    industry: 'Cross-Border Fintech & SME Billing',
    summary: 'A mobile-first business wallet and reconciliation engine built for digital European SMBs handling multi-currency invoices and instant SEPA transfers.',
    problem: 'Online businesses selling across borders struggle to manually match incoming bank transfers against outstanding VAT invoices, creating tedious accounting backlogs.',
    solution: 'Developed a cross-platform mobile wallet that notifies business owners of incoming SEPA payments in real time and automatically reconciles payments against pending digital invoices.',
    features: [
      'Instant SEPA push notifications with automated customer matching',
      'Multi-currency balance overview with live European Central Bank FX rates',
      'Integrated PDF invoice creator with dynamic EPC-QR codes for instant payment',
      'One-click accounting exports formatted for standard tax preparation'
    ],
    techStack: 'React Native, TypeScript, Node.js, MySQL, REST APIs, Biometric Auth'
  },
  craftbourse: {
    title: 'CraftBourse',
    badge: 'Concept Project · Web / E-Commerce',
    industry: 'B2B Wholesale Marketplace',
    summary: 'A curated wholesale marketplace connecting independent European boutique retailers with verified artisanal lifestyle and homeware producers.',
    problem: 'Small-batch manufacturers face high customer acquisition barriers and cumbersome email-based wholesale negotiation, while retailers struggle to discover vetted regional makers.',
    solution: 'Created a responsive B2B platform with tiered wholesale catalog pricing, sample evaluation workflows, minimum order quantity rules, and automated purchase order generation.',
    features: [
      'Verified maker directories with artisan storytelling and product portfolios',
      'Tiered wholesale pricing engines with dynamic volume discounts',
      'Sample request and approval escrow workflow',
      'Automated PDF purchase order generation and packing slips'
    ],
    techStack: 'Next.js, TypeScript, Node.js, PostgreSQL, Stripe Payments, Cloud Storage'
  },
  sensora: {
    title: 'Sensora Field',
    badge: 'Concept Project · Mobile / AI',
    industry: 'Precision Agronomy & Soil Telemetry',
    summary: 'An offline-first mobile companion app providing agronomists and crop managers with offline soil moisture telemetry and on-device crop health diagnostics.',
    problem: 'Agricultural field workers operating in remote acreage often encounter zero network connectivity, making cloud-only crop inspection tools ineffective during on-site assessments.',
    solution: 'Engineered a resilient mobile app that caches local sensor readings locally in SQLite, runs lightweight visual diagnosis on-device, and synchronizes seamlessly when cell reception returns.',
    features: [
      'Offline-first sensor data capture with robust background sync queue',
      'On-device image analysis for crop foliage distress indicators',
      'Localized soil moisture mapping and irrigation timing suggestions',
      'Multi-field parcel management with GPS boundary tags'
    ],
    techStack: 'Flutter, SQLite, Dart, On-Device AI Vision models, REST Sync Gateway'
  }
};

// Legal Content Modals Database (Disclosures & Placeholders)
const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Notice (Datenschutzerklärung)',
    content: `
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Inquiry Data</h4>
        <p>Project inquiries submitted through this website are sent securely to our backend and stored for the purpose of reviewing and responding to your request. We use your contact details only for project communication and do not sell them to third parties.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Data Protection Standards</h4>
        <p>In production operations, RSTechwerk adheres to applicable data protection principles, including the European Union General Data Protection Regulation (GDPR). When contacting us regarding a real project, your contact details (name, email, company, and project scope) are used solely for communicating regarding your specific project inquiry and are never sold or shared with unauthorized third parties.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Your Rights</h4>
        <p>You have the right to request access to any personal data held about you, request corrections, or request deletion of your information at any time by contacting our team at <strong>inquiry@rstechwerk.com</strong>.</p>
      </div>
    `
  },
  impressum: {
    title: 'Legal Notice / Impressum',
    content: `
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Website Provider Information</h4>
        <p><strong>RSTechwerk</strong><br>
        Software Development & Technology Solutions (rstechwerk.com)<br>
        Primary Operational Team: Dhaka, Bangladesh<br>
        Contact Email: <a href="mailto:inquiry@rstechwerk.com" style="color:var(--color-accent); text-decoration:underline;">inquiry@rstechwerk.com</a></p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Prototype Notice</h4>
        <p>This web application is an interactive presentation of RSTechwerk's design, technology capabilities, and software delivery process. Portfolio items displayed are conceptual prototypes developed to demonstrate system architecture across various industries.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Copyright & Intellectual Property</h4>
        <p>All website content, custom mockups, layout code, and graphics are the property of RSTechwerk unless otherwise indicated. Unauthorized reproduction of code or brand elements is prohibited.</p>
      </div>
    `
  },
  accessibility: {
    title: 'Accessibility Statement',
    content: `
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Commitment to Accessibility</h4>
        <p>RSTechwerk is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone, applying relevant Web Content Accessibility Guidelines (WCAG 2.1 Level AA) standards.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Measures Taken</h4>
        <ul class="dialog-feature-list">
          <li class="dialog-feature-item"><span>·</span> Semantic HTML structure with logical heading hierarchy (H1 through H3).</li>
          <li class="dialog-feature-item"><span>·</span> Keyboard accessible navigation, accordion components, and modal dialogs with focus trapping.</li>
          <li class="dialog-feature-item"><span>·</span> High-contrast typography meeting WCAG AA requirements (4.5:1 text, 3:1 graphical elements).</li>
          <li class="dialog-feature-item"><span>·</span> Respect for user prefers-reduced-motion operating system preferences.</li>
          <li class="dialog-feature-item"><span>·</span> Minimum touch target sizes of 44×44 pixels on interactive mobile elements.</li>
        </ul>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Feedback</h4>
        <p>If you encounter any accessibility barriers on this website, please let us know at <strong>inquiry@rstechwerk.com</strong> and we will address it promptly.</p>
      </div>
    `
  }
};

/* ==========================================================================
   DOM Ready Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initLanguageSwitcher();
  initMobileNav();
  initHeroConsoleTabs();
  initLiveWorldClocks();
  initScrollToTop();
  initPortfolioFilter();
  initPortfolioStagger();
  initCaseStudyModal();
  initLegalModal();
  initFaqAccordion();
  initMaintenanceToggle();
  initContactForm();
  initScrollSpyAndSmoothScroll();
  initScrollReveals();
  updateFooterYear();
  applyPublishedAdminContent();
  initClientProfileLink();
});

function initClientProfileLink() {
  const portalLink = document.getElementById('portalHeaderLink');
  const avatarBadge = document.getElementById('portalAvatarBadge');
  const portalIcon = portalLink?.querySelector('.portal-btn-icon');
  const drawerPortalLink = document.querySelector('.mobile-nav-links a[href*="redirect=portal"]');
  try {
    const raw = localStorage.getItem('rstechwerk_admin_session') || sessionStorage.getItem('rstechwerk_admin_session');
    const session = raw ? JSON.parse(raw) : null;
    if (session?.token && session?.role === 'client') {
      if (portalLink) {
        portalLink.href = '/portal.html';
        portalLink.classList.add('is-authenticated');
        portalLink.title = 'Open client portal';
        portalLink.setAttribute('aria-label', 'Open client portal');
      }
      if (drawerPortalLink) {
        drawerPortalLink.href = '/portal.html';
      }
      if (avatarBadge) {
        avatarBadge.textContent = (session.name || session.email || 'C').slice(0, 1).toUpperCase();
        avatarBadge.style.display = 'inline-flex';
      }
      if (portalIcon) {
        portalIcon.style.display = 'none';
      }
    }
  } catch { /* Ignore malformed local session data. */ }
}

function initThemeSwitcher() {
  const button = document.querySelector('#themeToggle');
  if (!button) return;
  const saved = localStorage.getItem('tecklumo-theme');
  const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(theme, button);
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('tecklumo-theme', next); setTheme(next, button);
  });
}

function setTheme(theme, button) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  button.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
}

function initLanguageSwitcher() {
  const selectors = [document.querySelector('#languageSelect'), document.querySelector('#mobileLanguageSelect')].filter(Boolean);
  const savedLanguage = localStorage.getItem('tecklumo-language') || 'en';
  selectors.forEach((select) => {
    select.value = savedLanguage;
    select.addEventListener('change', (event) => {
      const language = event.target.value;
      localStorage.setItem('tecklumo-language', language);
      selectors.forEach((other) => { other.value = language; });
      document.documentElement.lang = language;
      applyLanguage(language);
      document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
    });
  });
  document.documentElement.lang = savedLanguage;
  if (savedLanguage === 'de') applyLanguage('de');
}


/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */

function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Portfolio Gallery Filtering (With Staggered Re-Entry)
   ========================================================================== */

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(/\s+/);
        const matches = filterVal === 'all' || categories.includes(filterVal);
        if (matches) {
          card.classList.remove('hidden');
          card.classList.remove('card-entered');
        } else {
          card.classList.add('hidden');
          card.classList.remove('card-entered');
        }
      });

      // Stagger visible cards smoothly into view
      requestAnimationFrame(() => {
        animateCardsStaggered(projectCards, 65);
      });
    });
  });
}

/* ==========================================================================
   Case Study Dialog Modal
   ========================================================================== */

let lastActiveElement = null;

function initCaseStudyModal() {
  const modalBackdrop = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('caseStudyCloseBtn');
  const footerCloseBtn = document.getElementById('caseStudyFooterCloseBtn');
  const openBtns = document.querySelectorAll('[data-case-study]');

  if (!modalBackdrop) return;

  function openCaseStudy(projectId, triggerBtn) {
    lastActiveElement = triggerBtn;
    const data = CASE_STUDIES[projectId];
    if (!data) return;

    document.getElementById('csModalTitle').textContent = data.title;
    document.getElementById('csModalBadge').textContent = data.badge;
    document.getElementById('csModalIndustry').textContent = data.industry;
    document.getElementById('csModalProblem').textContent = data.problem;
    document.getElementById('csModalSolution').textContent = data.solution;
    document.getElementById('csModalTech').textContent = data.techStack;

    const featuresList = document.getElementById('csModalFeatures');
    featuresList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.className = 'dialog-feature-item';
      li.innerHTML = `<span style="color:var(--color-accent); font-weight:bold;">·</span> <span>${feat}</span>`;
      featuresList.appendChild(li);
    });

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap focus inside modal
    if (closeBtn) closeBtn.focus();
  }

  function closeCaseStudy() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-case-study');
      openCaseStudy(projectId, btn);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCaseStudy);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeCaseStudy);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeCaseStudy();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeCaseStudy();
    }
  });
}

/* ==========================================================================
   Legal Notice Modals (Privacy, Impressum, Accessibility)
   ========================================================================== */

function initLegalModal() {
  const legalModal = document.getElementById('legalModal');
  const closeBtn = document.getElementById('legalCloseBtn');
  const footerCloseBtn = document.getElementById('legalFooterCloseBtn');
  const legalTriggers = document.querySelectorAll('[data-legal-modal]');

  if (!legalModal) return;

  function openLegal(key, triggerBtn) {
    lastActiveElement = triggerBtn;
    const data = LEGAL_CONTENT[key];
    if (!data) return;

    document.getElementById('legalModalTitle').textContent = data.title;
    document.getElementById('legalModalBody').innerHTML = data.content;

    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeBtn) closeBtn.focus();
  }

  function closeLegal() {
    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  }

  legalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-legal-modal');
      openLegal(key, btn);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLegal);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeLegal);

  legalModal.addEventListener('click', (e) => {
    if (e.target === legalModal) {
      closeLegal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal.classList.contains('open')) {
      closeLegal();
    }
  });
}

/* ==========================================================================
   FAQ Accordion (Accessible with Smooth Collapse)
   ========================================================================== */

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-button');
    const panel = item.querySelector('.faq-panel');

    if (!button || !panel) return;

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Optionally close other items for an exclusive accordion experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-button');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherBtn && otherPanel) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherPanel.style.maxHeight = null;
          }
        }
      });

      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        button.setAttribute('aria-expanded', 'true');
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   Maintenance & Dedicated Team Engagement Switcher & CTAs
   ========================================================================== */

function initMaintenanceToggle() {
  const toggleBtns = document.querySelectorAll('.maintenance-toggle-btn');
  const cards = document.querySelectorAll('.maintenance-card');
  const planCtaBtns = document.querySelectorAll('.plan-cta-btn');
  const serviceSelect = document.getElementById('inquiryService');

  if (!toggleBtns.length || !cards.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-maintenance-mode');

      toggleBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const cardMode = card.getAttribute('data-plan-mode');
        if (cardMode === mode) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Wire up Plan CTA Buttons to preselect service and smooth scroll to contact form
  planCtaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetService = btn.getAttribute('data-plan-service');

      if (serviceSelect && targetService) {
        serviceSelect.value = targetService;
        serviceSelect.dispatchEvent(new Event('change'));
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 72;
        const targetPos = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        setTimeout(() => {
          const descInput = document.getElementById('inquiryDesc');
          if (descInput) {
            descInput.focus();
          }
        }, 600);
      }
    });
  });
}

/* ==========================================================================
   Contact / Project Inquiry Form Validation & Submission
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('projectInquiryForm');
  if (!form) return;

  const submitBtn = document.getElementById('inquirySubmitBtn');
  const feedbackEl = document.getElementById('formFeedback');

  // Fields
  const nameInput = document.getElementById('inquiryName');
  const emailInput = document.getElementById('inquiryEmail');
  const serviceInput = document.getElementById('inquiryService');
  const phoneInput = document.getElementById('inquiryPhone');
  const countryCodeInput = document.getElementById('inquiryCountryCode');
  const descInput = document.getElementById('inquiryDesc');
  const budgetInput = document.getElementById('inquiryBudget');
  const currencyInput = document.getElementById('inquiryCurrency');
  const customBudgetInput = document.getElementById('inquiryCustomBudget');
  const privacyCheckbox = document.getElementById('inquiryPrivacy');
  const honeypot = document.getElementById('inquiryHoneypot');

  // Use the browser's regional locale when available, while keeping Bangladesh
  // as the privacy-friendly fallback. Visitors can always change the code.
  const localeToCallingCode = {
    BD: '+880', DE: '+49', GB: '+44', FR: '+33', BE: '+32', CH: '+41',
    NL: '+31', SE: '+46', DK: '+45', US: '+1', CA: '+1', AU: '+61',
    IN: '+91', AE: '+971'
  };
  try {
    const region = new Intl.Locale(navigator.language || 'en-BD').region;
    const detectedCode = localeToCallingCode[region];
    if (detectedCode && countryCodeInput) countryCodeInput.value = detectedCode;
  } catch {
    // Keep the Bangladesh default when the browser does not expose a region.
  }

  let isSubmitting = false;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim().toLowerCase());
  }

  function setFieldError(input, errorId, message) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = message;
  }

  function clearFieldError(input, errorId) {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = '';
  }

  // Real-time input clearing
  if (nameInput) nameInput.addEventListener('input', () => clearFieldError(nameInput, 'nameError'));
  if (emailInput) emailInput.addEventListener('input', () => clearFieldError(emailInput, 'emailError'));
  if (serviceInput) serviceInput.addEventListener('change', () => clearFieldError(serviceInput, 'serviceError'));
  if (phoneInput) phoneInput.addEventListener('input', () => clearFieldError(phoneInput, 'phoneError'));
  if (descInput) descInput.addEventListener('input', () => clearFieldError(descInput, 'descError'));
  if (budgetInput) budgetInput.addEventListener('change', () => {
    const custom = budgetInput.value === 'custom';
    customBudgetInput.hidden = !custom;
    customBudgetInput.required = custom;
    if (!custom) customBudgetInput.value = '';
  });
  if (privacyCheckbox) privacyCheckbox.addEventListener('change', () => clearFieldError(privacyCheckbox, 'privacyError'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Check honeypot field (bots usually fill hidden fields)
    if (honeypot && honeypot.value.trim() !== '') {
      // Silently ignore bot spam
      return;
    }

    // Reset previous feedback
    feedbackEl.className = 'form-feedback';
    feedbackEl.textContent = '';

    let hasErrors = false;

    // 1. Full Name Validation
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'nameError', 'Please enter your full name.');
      hasErrors = true;
    } else {
      clearFieldError(nameInput, 'nameError');
    }

    // 2. Work Email Validation
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, 'emailError', 'Please enter your work email address.');
      hasErrors = true;
    } else if (!validateEmail(emailInput.value)) {
      setFieldError(emailInput, 'emailError', 'Please enter a valid email format (e.g., name@company.com).');
      hasErrors = true;
    } else {
      clearFieldError(emailInput, 'emailError');
    }

    // 3. Service Interest Validation
    if (!serviceInput.value) {
      setFieldError(serviceInput, 'serviceError', 'Please select a service category.');
      hasErrors = true;
    } else {
      clearFieldError(serviceInput, 'serviceError');
    }

    // 4. Phone Number Validation
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 6 || phoneDigits.length > 15) {
      setFieldError(phoneInput, 'phoneError', 'Please enter a valid phone number.');
      hasErrors = true;
    } else {
      clearFieldError(phoneInput, 'phoneError');
    }

    // 5. Project Description Validation
    if (!descInput.value.trim()) {
      setFieldError(descInput, 'descError', 'Please provide a brief description of your project.');
      hasErrors = true;
    } else if (descInput.value.trim().length < 20) {
      setFieldError(descInput, 'descError', 'Please describe your requirements in a bit more detail (minimum 20 characters).');
      hasErrors = true;
    } else {
      clearFieldError(descInput, 'descError');
    }

    // 6. Privacy Notice Acceptance Validation
    if (!privacyCheckbox.checked) {
      setFieldError(privacyCheckbox, 'privacyError', 'You must acknowledge the privacy notice to proceed.');
      hasErrors = true;
    } else {
      clearFieldError(privacyCheckbox, 'privacyError');
    }

    if (hasErrors) {
      // Focus first erroneous input
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Prepare payload
    const payload = {
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: `${countryCodeInput?.value || '+880'}${phoneDigits}`,
      company: document.getElementById('inquiryCompany')?.value.trim() || '',
      service: serviceInput.value,
      budget: budgetInput?.value || 'Not sure yet',
      customBudget: customBudgetInput?.value || '',
      currency: currencyInput?.value || 'EUR',
      description: descInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // UI Loading State
    isSubmitting = true;
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="width:18px; height:18px; animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="3" stroke="currentColor" stroke-dasharray="32" stroke-linecap="round"/>
      </svg>
      <span>Validating inquiry...</span>
    `;

    try {
      // Submit Handler
      const response = await submitProjectInquiry(payload);

      if (response.success) {
        feedbackEl.className = 'form-feedback success';
        feedbackEl.innerHTML = `<strong>Thanks — your inquiry has been received.</strong><br>Our team will review your project and respond within one business day.`;
        form.reset();
        if (customBudgetInput) customBudgetInput.hidden = true;
        if (customBudgetInput) customBudgetInput.required = false;
      } else {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = response.message || 'We could not process your inquiry. Please try again.';
      }
    } catch (err) {
      feedbackEl.className = 'form-feedback error';
      feedbackEl.textContent = 'Network error or connection failed. Entered data has been preserved; please try again.';
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Sends the inquiry to the configured backend API.
 */
async function submitProjectInquiry(formData) {
  if (CONFIG.apiEndpoint) {
    const res = await fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error('Failed to send inquiry to server');
    return await res.json();
  }

  throw new Error('Inquiry API is not configured.');
}

/* ==========================================================================
   Smooth Anchor Navigation & Active Nav Link Highlight
   ========================================================================== */

function initScrollSpyAndSmoothScroll() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.site-header');
  const getHeaderHeight = () => (header ? header.offsetHeight : 68);

  // Handle header offset for smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - getHeaderHeight() - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active link scroll spy & header scroll elevation
  const syncHeaderScrollState = () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.pageYOffset > 12);
    }

    let current = '';
    const scrollPos = window.pageYOffset + getHeaderHeight() + 60;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  syncHeaderScrollState();
  window.addEventListener('scroll', syncHeaderScrollState, { passive: true });
}

/* ==========================================================================
   Subtle Scroll Reveals (Progressive Enhancement)
   ========================================================================== */

function initScrollReveals() {
  if (!('IntersectionObserver' in window)) return;

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Footer Copyright Year
   ========================================================================== */

function updateFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   Hero Interactive Console Tabs (Google AI Studio aesthetic)
   ========================================================================== */

function initHeroConsoleTabs() {
  const tabBtns = document.querySelectorAll('.console-tab-btn');
  const panels = document.querySelectorAll('.console-panel');

  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   Live Dual World Clocks (Berlin CET & Dhaka BST)
   ========================================================================== */

function initLiveWorldClocks() {
  const berlinClock = document.getElementById('clockBerlin');
  const dhakaClock = document.getElementById('clockDhaka');

  if (!berlinClock || !dhakaClock) return;

  function updateClocks() {
    const now = new Date();

    try {
      const berlinFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const dhakaFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      berlinClock.textContent = berlinFormatter.format(now) + ' CET';
      dhakaClock.textContent = dhakaFormatter.format(now) + ' BST';
    } catch (e) {
      // Fallback
      berlinClock.textContent = '14:30:00 CET';
      dhakaClock.textContent = '19:30:00 BST';
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* ==========================================================================
   Floating Scroll-to-Top Button (Appears past Hero section)
   ========================================================================== */

function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  const heroSection = document.getElementById('home');
  if (!scrollBtn) return;

  function updateVisibility() {
    // Show button when scrolled past the hero section (or 400px threshold)
    const threshold = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight - 150) : 400;
    if (window.pageYOffset > threshold) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();

  scrollBtn.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
    scrollBtn.blur();
  });
}

/* ==========================================================================
   Portfolio Staggered Entry Animation (IntersectionObserver)
   ========================================================================== */

function initPortfolioStagger() {
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const cards = document.querySelectorAll('.portfolio-grid .project-card');
  if (!portfolioGrid || !cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('card-entered'));
    return;
  }

  let hasTriggered = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTriggered) {
        hasTriggered = true;
        animateCardsStaggered(cards, 90);
        obs.unobserve(portfolioGrid);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  observer.observe(portfolioGrid);
}

function animateCardsStaggered(cardsList, stepDelay = 80) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visibleCards = Array.from(cardsList).filter(card => !card.classList.contains('hidden'));

  visibleCards.forEach((card, index) => {
    if (prefersReducedMotion) {
      card.style.transitionDelay = '0ms';
      card.classList.add('card-entered');
      return;
    }

    card.style.transitionDelay = `${index * stepDelay}ms`;
    setTimeout(() => {
      card.classList.add('card-entered');
    }, 25);
  });
}

/* ==========================================================================
   Reflect Admin Content Updates on Public Landing Page
   ========================================================================== */

async function applyPublishedAdminContent() {
  try {
    const raw = localStorage.getItem('tecklumo_published_content');
    let published = raw ? JSON.parse(raw) : null;
    try {
      const response = await fetch('/api/content');
      const result = await response.json();
      if (result.success && result.content?.site) {
        published = result.content.site;
        localStorage.setItem('tecklumo_published_content', JSON.stringify(published));
      }
    } catch (apiError) {
      console.warn('Live content API unavailable; using local published cache.', apiError.message);
    }
    if (!published) return;

    if (published.settings) {
      const metaTitle = published.settings.metaTitle;
      const metaDescription = published.settings.metaDescription;
      const canonicalUrl = published.settings.canonicalUrl;
      if (metaTitle) document.title = metaTitle;
      if (metaDescription) {
        const description = document.querySelector('meta[name="description"]');
        if (description) description.setAttribute('content', metaDescription);
      }
      if (canonicalUrl) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', canonicalUrl);
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogTitle && metaTitle) ogTitle.setAttribute('content', metaTitle);
      if (ogDescription && metaDescription) ogDescription.setAttribute('content', metaDescription);
    }

    // 1. Hero Content
    if (published.hero) {
      const hero = published.hero;
      const pillEl = document.querySelector('.hero-announcement .announcement-pill');
      const textEl = document.querySelector('.hero-announcement .announcement-text');
      const headlineEl = document.querySelector('.hero-headline');
      const subheadEl = document.querySelector('.hero-subhead');
      const primaryCta = document.querySelector('.hero-btn-primary span');
      const secondaryCta = document.querySelector('.hero-btn-secondary');
      const maintenanceCta = document.querySelector('.hero-btn-maintenance span');

      if (pillEl && hero.pill) pillEl.textContent = hero.pill;
      if (textEl && hero.subtext) textEl.textContent = hero.subtext;
      if (headlineEl && hero.headlinePrefix && hero.headlineGradient) {
        headlineEl.innerHTML = `${escapeText(hero.headlinePrefix)} <span class="text-gradient">${escapeText(hero.headlineGradient)}</span>`;
      }
      if (subheadEl && hero.subhead) subheadEl.textContent = hero.subhead;
      if (primaryCta && hero.primaryCtaText) primaryCta.textContent = hero.primaryCtaText;
      if (secondaryCta && hero.secondaryCtaText) secondaryCta.textContent = hero.secondaryCtaText;
      if (maintenanceCta && hero.maintenanceCtaText) maintenanceCta.textContent = hero.maintenanceCtaText;
    }

    if (Array.isArray(published.services) && published.services.length > 0) {
      document.querySelectorAll('.service-card').forEach((card, index) => {
        const service = published.services[index];
        if (!service) return;
        const number = card.querySelector('.service-num');
        const title = card.querySelector('.service-title');
        const desc = card.querySelector('.service-desc');
        const tech = card.querySelector('.service-tech-note');
        const list = card.querySelector('.deliverables-list');
        if (number && service.number) number.textContent = service.number;
        if (title && service.title) title.textContent = service.title;
        if (desc && service.desc) desc.textContent = service.desc;
        if (tech && service.tech) tech.textContent = service.tech;
        if (list && Array.isArray(service.deliverables)) {
          list.innerHTML = service.deliverables.map((item) => `
            <li class="deliverable-item"><span class="deliverable-bullet">&bull;</span><span>${escapeText(item)}</span></li>
          `).join('');
        }
      });
    }

    if (Array.isArray(published.portfolio) && published.portfolio.length > 0) {
      document.querySelectorAll('.project-card').forEach((card, index) => {
        const project = published.portfolio[index];
        if (!project) return;
        if (project.categories) card.dataset.category = project.categories;
        const meta = card.querySelector('.project-meta-line span');
        const title = card.querySelector('.project-title');
        const summary = card.querySelector('.project-summary');
        const tags = card.querySelector('.project-tags-line');
        const button = card.querySelector('.view-case-study-btn');
        const media = card.querySelector('.project-mockup-frame');
        if (meta && project.industry) meta.textContent = project.industry;
        if (title && project.title) title.textContent = project.title;
        if (summary && project.summary) summary.textContent = project.summary;
        const legacyImage = project.image && /\/portfolio\/(nordiclogix|klinikflow|voltgrid-iq|aurapay|craftbourse|sensora-field)\.png$/.test(project.image);
        const imagePath = legacyImage ? PORTFOLIO_IMAGE_FALLBACKS[project.key] : (project.image || PORTFOLIO_IMAGE_FALLBACKS[project.key] || '');
        if (media && imagePath) {
          media.innerHTML = `<img class="project-card-image" src="${escapeText(imagePath)}" alt="${escapeText(project.title || 'Project')} software interface preview" loading="lazy" />`;
        }
        if (button && project.key) button.dataset.caseStudy = project.key;
        if (tags && project.tech) {
          tags.innerHTML = project.tech.split(',').map((tag) => `<span class="project-tag">${escapeText(tag.trim())}</span>`).join('<span aria-hidden="true">&bull;</span>');
        }
      });
    }

    if (published.process) {
      const process = published.process;
      const processSection = document.querySelector('#process');
      if (processSection) {
        const kicker = processSection.querySelector('.section-kicker');
        const title = processSection.querySelector('.section-title');
        const description = processSection.querySelector('.section-description');
        if (kicker && process.kicker) kicker.textContent = process.kicker;
        if (title && process.title) title.textContent = process.title;
        if (description && process.description) description.textContent = process.description;
        if (Array.isArray(process.stages)) {
          processSection.querySelectorAll('.process-card').forEach((card, index) => {
            const stage = process.stages[index];
            if (!stage) return;
            const fields = [
              ['.stage-num', stage.step], ['.stage-title', stage.title], ['.stage-desc', stage.desc],
              ['.stage-detail-text', stage.deliverables], ['.stage-detail-text:nth-of-type(2)', stage.involvement]
            ];
            fields.forEach(([selector, value]) => {
              const element = card.querySelector(selector);
              if (element && value) element.textContent = value;
            });
          });
        }
      }
    }

    if (published.techStack) {
      const techSection = document.querySelector('#tech-stack');
      if (techSection) {
        const kicker = techSection.querySelector('.section-kicker');
        const title = techSection.querySelector('.section-title');
        const description = techSection.querySelector('.section-description');
        if (kicker && published.techStack.kicker) kicker.textContent = published.techStack.kicker;
        if (title && published.techStack.title) title.textContent = published.techStack.title;
        if (description && published.techStack.description) description.textContent = published.techStack.description;
        if (Array.isArray(published.techStack.categories)) {
          techSection.querySelectorAll('.tech-card').forEach((card, index) => {
            const category = published.techStack.categories[index];
            if (!category) return;
            const heading = card.querySelector('.tech-group-title');
            const role = card.querySelector('.tech-group-role');
            const tags = card.querySelector('.tech-items-wrap');
            if (heading && category.name) heading.textContent = category.name;
            if (role && category.role) role.textContent = category.role;
            if (tags && Array.isArray(category.tags)) tags.innerHTML = category.tags.map((tag) => `<span class="tech-badge">${escapeText(tag)}</span>`).join('');
          });
        }
      }
    }

    if (published.maintenance) {
      const plans = [...(published.maintenance.monthly || []), ...(published.maintenance.hourly || [])];
      const maintenanceSection = document.querySelector('#maintenance');
      if (maintenanceSection && plans.length > 0) {
        maintenanceSection.querySelectorAll('.maintenance-card').forEach((card, index) => {
          const plan = plans[index];
          if (!plan) return;
          const pill = card.querySelector('.plan-pill');
          const sla = card.querySelector('.plan-sla-tag');
          const title = card.querySelector('.plan-title');
          const desc = card.querySelector('.plan-desc');
          const hours = card.querySelector('.hours-val');
          const period = card.querySelector('.hours-period');
          if (pill && plan.pill) pill.textContent = plan.pill;
          if (sla && plan.sla) sla.textContent = plan.sla;
          if (title && plan.title) title.textContent = plan.title;
          if (desc && plan.desc) desc.textContent = plan.desc;
          if (hours && plan.hours) hours.textContent = plan.hours;
          if (period && plan.period) period.textContent = plan.period;
        });
      }
    }

    // 2. European Delivery Trust Principles (Trust Strip)
    const trustBadges = (published.process && Array.isArray(published.process.trustBadges)) 
      ? published.process.trustBadges 
      : null;

    if (trustBadges && trustBadges.length > 0) {
      const container = document.getElementById('trustStripItemsContainer');
      if (container) {
        container.innerHTML = trustBadges.map(b => `
          <div class="trust-principle-card">
            <div class="trust-card-icon-box">
              <span style="font-size: 1.1rem; line-height: 1;">${escapeText(b.icon || '✓')}</span>
            </div>
            <div class="trust-card-content">
              <div class="trust-card-title">${escapeText(b.label)}</div>
              <div class="trust-card-detail">${escapeText(b.detail)}</div>
            </div>
          </div>
        `).join('');
      }
    }

    if (Array.isArray(published.faqs) && published.faqs.length > 0) {
      const faqList = document.querySelector('.faq-list');
      if (faqList) {
        faqList.innerHTML = published.faqs.map((faq, index) => {
          const number = index + 1;
          return `<div class="faq-item reveal">
            <button type="button" class="faq-button" aria-expanded="false" aria-controls="faq-panel-${number}" id="faq-btn-${number}">
              <span>${escapeText(faq.question)}</span>
              <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="faq-panel" id="faq-panel-${number}" role="region" aria-labelledby="faq-btn-${number}">
              <div class="faq-panel-inner">${escapeText(faq.answer)}</div>
            </div>
          </div>`;
        }).join('');
        initFaqAccordion();
      }
    }
  } catch (e) {
    console.warn('Could not apply published admin content', e);
  }
}

function escapeText(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}



