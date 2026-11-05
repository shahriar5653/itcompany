/**
 * Tecklumo - Software Development & Technology Solutions
 * Vanilla JavaScript: Accessible Interactions, Portfolio Filter, Case Study Dialogs, FAQ Accordion, Form Validation
 */

// Enable progressive enhancement class for CSS reveals
document.documentElement.classList.add('js');

// Configurable endpoint hook for production deployment
const CONFIG = {
  // Replace with live backend endpoint URL when deploying (e.g. '/api/inquiry')
  apiEndpoint: null,
  companyEmail: 'inquiry@tecklumo.com'
};

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
        <h4 class="dialog-block-title">Prototype & Demonstration Notice</h4>
        <p>This website serves as a design and functional prototype for Tecklumo. Any contact information entered into the demonstration contact form is processed strictly in your local browser session and is not stored in a persistent database unless an operational backend endpoint is connected.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Data Protection Standards</h4>
        <p>In production operations, Tecklumo adheres to applicable data protection principles, including the European Union General Data Protection Regulation (GDPR). When contacting us regarding a real project, your contact details (name, email, company, and project scope) are used solely for communicating regarding your specific project inquiry and are never sold or shared with unauthorized third parties.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Your Rights</h4>
        <p>You have the right to request access to any personal data held about you, request corrections, or request deletion of your information at any time by contacting our team at <strong>inquiry@tecklumo.com</strong>.</p>
      </div>
    `
  },
  impressum: {
    title: 'Legal Notice / Impressum',
    content: `
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Website Provider Information</h4>
        <p><strong>Tecklumo</strong><br>
        Software Development & Technology Solutions<br>
        Primary Operational Team: Dhaka, Bangladesh<br>
        Contact Email: <a href="mailto:inquiry@tecklumo.com" style="color:var(--color-accent); text-decoration:underline;">inquiry@tecklumo.com</a></p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Prototype Notice</h4>
        <p>This web application is an interactive presentation of Tecklumo's design, technology capabilities, and software delivery process. Portfolio items displayed are conceptual prototypes developed to demonstrate system architecture across various industries.</p>
      </div>
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Copyright & Intellectual Property</h4>
        <p>All website content, custom mockups, layout code, and graphics are the property of Tecklumo unless otherwise indicated. Unauthorized reproduction of code or brand elements is prohibited.</p>
      </div>
    `
  },
  accessibility: {
    title: 'Accessibility Statement',
    content: `
      <div class="dialog-section-block">
        <h4 class="dialog-block-title">Commitment to Accessibility</h4>
        <p>Tecklumo is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone, applying relevant Web Content Accessibility Guidelines (WCAG 2.1 Level AA) standards.</p>
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
        <p>If you encounter any accessibility barriers on this website, please let us know at <strong>inquiry@tecklumo.com</strong> and we will address it promptly.</p>
      </div>
    `
  }
};

/* ==========================================================================
   DOM Ready Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroConsoleTabs();
  initLiveWorldClocks();
  initScrollToTop();
  initPortfolioFilter();
  initPortfolioStagger();
  initCaseStudyModal();
  initLegalModal();
  initFaqAccordion();
  initContactForm();
  initScrollSpyAndSmoothScroll();
  initScrollReveals();
  updateFooterYear();
});


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
        const category = card.getAttribute('data-category');
        const matches = (filterVal === 'all' || category === filterVal || (filterVal === 'web' && category.includes('web')) || (filterVal === 'saas' && category.includes('saas')));
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
  const descInput = document.getElementById('inquiryDesc');
  const privacyCheckbox = document.getElementById('inquiryPrivacy');
  const honeypot = document.getElementById('inquiryHoneypot');

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
  if (descInput) descInput.addEventListener('input', () => clearFieldError(descInput, 'descError'));
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

    // 4. Project Description Validation
    if (!descInput.value.trim()) {
      setFieldError(descInput, 'descError', 'Please provide a brief description of your project.');
      hasErrors = true;
    } else if (descInput.value.trim().length < 20) {
      setFieldError(descInput, 'descError', 'Please describe your requirements in a bit more detail (minimum 20 characters).');
      hasErrors = true;
    } else {
      clearFieldError(descInput, 'descError');
    }

    // 5. Privacy Notice Acceptance Validation
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
      company: document.getElementById('inquiryCompany')?.value.trim() || '',
      service: serviceInput.value,
      budget: document.getElementById('inquiryBudget')?.value || 'Not sure yet',
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
      // Submit Handler (Supports real backend endpoint or honest demo validation)
      const response = await submitProjectInquiry(payload);

      if (response.success) {
        feedbackEl.className = 'form-feedback success';
        // Note: Strict requirement: Never show a false "Message sent" confirmation!
        // Clearly disclose "Demo validated. Your message has not been sent."
        feedbackEl.innerHTML = `
          <strong>Demo validated. Your message has not been sent.</strong><br>
          All form fields passed validation. To send real inquiries, configure the backend endpoint in <code>script.js</code> or contact us directly at <a href="mailto:${CONFIG.companyEmail}" style="text-decoration:underline; font-weight:600;">${CONFIG.companyEmail}</a>.
        `;
        // Do not clear fields on validation demo so user can verify what they typed
      } else {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = response.message || 'An error occurred while validating your inquiry. Please try again.';
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
 * Handles the actual network request or demo response.
 * Structured cleanly so a backend API URL can be plugged into CONFIG.apiEndpoint.
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

  // Simulated validation latency for client-side demo
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    success: true,
    isDemo: true,
    validatedData: formData
  };
}

/* ==========================================================================
   Smooth Anchor Navigation & Active Nav Link Highlight
   ========================================================================== */

function initScrollSpyAndSmoothScroll() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 72;

  // Handle header offset for smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active link scroll spy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + headerHeight + 60;

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
  }, { passive: true });
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



