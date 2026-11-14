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
  },
  es: {
    'Services': 'Servicios', 'Work': 'Proyectos', 'Process': 'Proceso', 'About': 'Nosotros', 'FAQ': 'Preguntas frecuentes', 'Client Portal': 'Portal del cliente',
    'Discuss Your Project': 'Hablemos de su proyecto', 'Start Your Project': 'Iniciar proyecto', 'Explore Our Work': 'Ver nuestros proyectos', 'Maintain Your Project': 'Mantenimiento y soporte',
    'Europe & DACH': 'Europa y DACH', 'Senior Product Engineering': 'Ingeniería de producto senior',
    'Build digital products': 'Construimos productos digitales', 'that move your business forward.': 'que impulsan su negocio.',
    'From first idea to production-ready software, we help ambitious businesses launch faster with reliable design, development, and ongoing support.': 'Desde la primera idea hasta un software listo para producción, ayudamos a empresas ambiciosas a lanzar más rápido con diseño, desarrollo y soporte continuo.',
    'Web Platforms': 'Plataformas web', 'Mobile Apps': 'Aplicaciones móviles', 'SaaS Systems': 'Sistemas SaaS', 'AI Solutions': 'Soluciones de IA', 'ERP & Business Systems': 'ERP y sistemas empresariales', 'APIs & Integrations': 'APIs e integraciones', 'Cloud & DevOps': 'Cloud y DevOps', 'ERP & Business': 'ERP y negocio',
    'Built for serious delivery': 'Diseñado para una entrega fiable', 'Senior engineering': 'Ingeniería senior', 'Weekly demos': 'Demos semanales', 'Full code ownership': 'Propiedad total del código', 'European time-zone overlap': 'Coincidencia con horarios europeos',
    'What We Build': 'Lo que construimos', 'Software built around your business': 'Software diseñado para su negocio', '—not the other way around.': '—no al revés.',
    'From ERP systems and SaaS platforms to AI workflows and mobile apps, we design and build technology that makes your business faster, smarter, and easier to scale.': 'Desde sistemas ERP y plataformas SaaS hasta flujos de IA y aplicaciones móviles, diseñamos tecnología que hace su negocio más rápido, inteligente y fácil de escalar.',
    'Portfolio & Prototypes': 'Portfolio y prototipos', 'Real products start with': 'Los productos reales comienzan con', 'real problems.': 'problemas reales.', 'Explore selected product concepts across logistics, healthcare, energy, fintech, and commerce—each shaped around a real operational challenge.': 'Explore conceptos de producto en logística, salud, energía, fintech y comercio, creados para resolver retos operativos reales.',
    'How We Deliver': 'Cómo trabajamos', 'From first conversation to': 'De la primera conversación a un', 'confident launch.': 'lanzamiento seguro.', 'Why RSTechwerk': 'Por qué RSTechwerk', 'Technical Capabilities': 'Capacidades técnicas', 'About RSTechwerk': 'Sobre RSTechwerk', 'Frequently Asked Questions': 'Preguntas frecuentes',
    'Start a Conversation': 'Iniciar una conversación', 'Let’s build something': 'Construyamos algo', 'valuable.': 'valioso.', 'Bring us a clear brief or just a rough idea. We’ll help shape the right product, technology, and next step for your business.': 'Comparta un briefing claro o una idea inicial. Le ayudaremos a definir el producto, la tecnología y el siguiente paso adecuado.',
    'Direct Email': 'Correo directo', 'Response Time': 'Tiempo de respuesta', 'Mutual Non-Disclosure': 'Confidencialidad mutua', 'Submit Project Inquiry': 'Enviar consulta del proyecto', 'Full Name': 'Nombre completo', 'Company Name (Optional)': 'Empresa (opcional)', 'Service Interest': 'Servicio de interés', 'Project Requirements': 'Requisitos del proyecto',
    'Maintenance': 'Mantenimiento y soporte', 'Maintenance & Retainers': 'Mantenimiento y retainers', 'Dedicated Engineering & Retainers': 'Ingeniería dedicada y mantenimiento', 'Hire an expert engineering team': 'Contrate un equipo de ingeniería experto', 'monthly or on demand.': 'mensual o bajo demanda.',
    'Monthly Dedicated Retainers': 'Retainers dedicados mensuales', 'Hourly & Sprint Packs': 'Paquetes por horas y sprints', 'Select Essential Retainer': 'Elegir Essential Retainer', 'Select Growth Retainer': 'Elegir Growth Retainer', 'Hire Dedicated Team': 'Contratar equipo dedicado', 'European Timezone Overlap': 'Coincidencia con horario europeo', '100% Client Code Ownership': '100% de propiedad del código del cliente', 'Direct Senior Developer Access': 'Acceso directo a desarrolladores senior', 'Tested on Staging First': 'Probado primero en staging'
  }
};
Object.assign(LANGUAGE_COPY.de, {
  'NordicLogix Fleet Manager':'NordicLogix Fuhrparkverwaltung','Workspace active':'Arbeitsbereich aktiv','Active RSTechwerk delivery workspace.':'Aktiver Projektbereich von RSTechwerk.','Maintenance Retainer':'Wartungs-Retainer','Client Sign-In Required':'Anmeldung im Kundenportal erforderlich','Staff Account Detected':'Mitarbeiterkonto erkannt','Unable to Load Workspace':'Arbeitsbereich konnte nicht geladen werden','You are signed in with an administrator account that does not have an associated client profile. Open the Admin Console or sign in with a client account.':'Sie sind mit einem Administratorkonto ohne Kundenprofil angemeldet. Öffnen Sie die Admin-Konsole oder melden Sie sich mit einem Kundenkonto an.','Open Admin Console':'Admin-Konsole öffnen','Switch Account':'Konto wechseln','Sign In to Portal':'Im Portal anmelden','Create Client Account':'Kundenkonto erstellen',
  'RSTechwerk – Software Development & Technology Solutions | rstechwerk.com':'RSTechwerk – Softwareentwicklung und Technologielösungen | rstechwerk.com',
  'RSTechwerk turns ideas into reliable digital products—from discovery and UI/UX design to full-stack engineering, cloud deployment, and ongoing maintenance for German and European businesses.':'RSTechwerk entwickelt zuverlässige digitale Produkte – von Discovery und UI/UX-Design über Full-Stack-Entwicklung bis zu Cloud-Deployment und Wartung für Unternehmen in Deutschland und Europa.',
  'RSTechwerk – Software Development & Technology Solutions':'RSTechwerk – Softwareentwicklung und Technologielösungen',
  'Turn ideas into reliable digital products with RSTechwerk. Custom software development, web & mobile apps, SaaS platforms, and AI automation.':'Mit RSTechwerk werden Ideen zu zuverlässigen digitalen Produkten. Individuelle Software, Web- und Mobile-Apps, SaaS-Plattformen und KI-Automatisierung.',
  'System architecture blueprints & domain modeling':'Systemarchitektur und Domänenmodellierung', 'Bespoke business logic & internal administrative tools':'Individuelle Geschäftslogik und interne Verwaltungstools', 'Role-based access control (RBAC) & audit logging':'Rollenbasierte Zugriffskontrolle und Audit-Protokollierung', 'Full source code ownership with modular structure':'Vollständiges Eigentum am modularen Quellcode',
  'Interactive customer-facing portals':'Interaktive Kundenportale', 'Subscription billing & customer self-service':'Abonnementabrechnung und Kunden-Self-Service', 'Responsive UI tested down to 360px':'Responsives UI bis 360 Pixel getestet', 'Unified codebase for iOS and Android':'Gemeinsame Codebasis für iOS und Android', 'Offline data caching & background sync':'Offline-Datenspeicherung und Hintergrundsynchronisierung', 'App Store & Google Play submission prep':'Vorbereitung für App Store und Google Play',
  'Custom LLM pipelines & function-calling agents':'Individuelle LLM-Pipelines und Funktionsaufruf-Agenten', 'Automated invoice & PDF document extraction':'Automatisierte Datenextraktion aus Rechnungen und PDFs', 'Structured JSON output validation':'Validierung strukturierter JSON-Ausgaben', 'Documented REST & GraphQL API endpoints':'Dokumentierte REST- und GraphQL-Schnittstellen', 'Normalized PostgreSQL & MySQL schema design':'Normalisierte PostgreSQL- und MySQL-Datenbankschemata', 'OAuth2, JWT authentication & session security':'OAuth2-, JWT- und Sitzungssicherheit',
  'Comprehensive code audit & security assessment':'Umfassende Code- und Sicherheitsprüfung', 'Performance tuning (database indexes, query caching)':'Leistungsoptimierung für Datenbanken und Caching', 'Regular dependency patches & zero-downtime updates':'Regelmäßige Sicherheitsupdates und unterbrechungsarme Aktualisierungen', 'Dedicated maintenance SLAs & rapid response times':'Vereinbarte Wartungs-SLAs und schnelle Reaktionszeiten',
  'Architecture blueprint, user stories, technical feasibility matrix & sprint roadmap.':'Architekturentwurf, User Stories, technische Machbarkeitsanalyse und Sprintplanung.', 'Collaborative discovery sessions and scope confirmation.':'Gemeinsame Discovery-Termine und Abstimmung des Projektumfangs.', 'Interactive design mockups, responsive component system & clickable user flows.':'Interaktive Designentwürfe, responsives Komponentensystem und klickbare Nutzerabläufe.', 'UX feedback rounds and visual approval sign-off.':'UX-Feedbackrunden und Freigabe des Designs.', 'Weekly deployed test builds, clean Git repositories, and automated CI pipelines.':'Wöchentlich bereitgestellte Testversionen, Git-Repositories und automatisierte CI-Pipelines.', 'Bi-weekly sprint demos and test environment reviews.':'Zweiwöchentliche Sprint-Demos und Prüfung der Testumgebung.', 'Test coverage reports, production infrastructure setup, and launch checklist.':'Testberichte, Einrichtung der Produktionsumgebung und Launch-Checkliste.', 'Final User Acceptance Testing (UAT) and launch authorization.':'Abschließender Abnahmetest und Freigabe des Launches.', 'Uptime telemetry logs, scheduled dependency updates & roadmap iterations.':'Betriebsprotokolle, geplante Abhängigkeitsupdates und Weiterentwicklung der Roadmap.', 'Monthly priority syncs and direct communication access.':'Monatliche Prioritätsabstimmungen und direkte Kommunikation.',
  'A clear five-stage process turns your idea into a reliable product—with visible progress, focused collaboration, and no unnecessary surprises.':'Ein klarer Prozess in fünf Phasen macht aus Ihrer Idee ein zuverlässiges Produkt – mit sichtbarem Fortschritt, enger Zusammenarbeit und ohne unnötige Überraschungen.',
  'The best products come from strong partnerships—clear communication, thoughtful engineering, and a team that stays accountable from day one.':'Die besten Produkte entstehen durch starke Partnerschaften, klare Kommunikation, durchdachte Entwicklung und ein Team, das Verantwortung übernimmt.',
  'We choose proven tools with strong ecosystems—so your product stays fast, maintainable, and ready for what comes next.':'Wir wählen bewährte Technologien mit starken Ökosystemen, damit Ihr Produkt schnell, wartbar und zukunftssicher bleibt.',
  'RSTechwerk is an independent software development team headquartered in Dhaka, Bangladesh. We build high-quality digital products for international businesses, with a particular focus on clients in Germany and broader European markets.':'RSTechwerk ist ein unabhängiges Softwareentwicklungsteam mit Sitz in Dhaka, Bangladesch. Wir entwickeln hochwertige digitale Produkte für internationale Unternehmen, insbesondere für Kunden in Deutschland und Europa.',
  'Whether you need to build a prototype from scratch, modernize an outdated legacy platform, or add specialized full-stack engineers to your existing roadmap, we provide transparent and dependable engineering services.':'Ob Sie einen Prototyp entwickeln, eine bestehende Plattform modernisieren oder Ihr Team um Full-Stack-Entwickler erweitern möchten: Wir bieten transparente und zuverlässige Entwicklungsleistungen.',
  'Everything you need to know about our process, communication, ownership, and delivery timelines.':'Alles, was Sie über unseren Prozess, die Kommunikation, Eigentumsrechte und Lieferzeiten wissen müssen.',
  'We turn ideas into reliable digital products—from initial discovery and UI/UX design to full-stack engineering and ongoing maintenance. German engineering standards with dedicated Dhaka development hub.':'Wir verwandeln Ideen in zuverlässige digitale Produkte – von der Analyse und dem UI/UX-Design über die Full-Stack-Entwicklung bis zur laufenden Wartung.',
  'Select language':'Sprache auswählen', 'Primary Navigation':'Hauptnavigation', 'Toggle navigation menu':'Navigationsmenü öffnen oder schließen', 'Close navigation menu':'Navigationsmenü schließen', 'Country calling code':'Ländervorwahl', 'Budget currency':'Budgetwährung', 'Enter your budget amount':'Geben Sie Ihr Budget ein', 'Briefly summarize your project goals, timeline, and current stage of development...':'Beschreiben Sie kurz Ihre Projektziele, den Zeitplan und den aktuellen Entwicklungsstand...', 'Close case study dialog':'Fallstudie schließen', 'Close legal notice dialog':'Rechtliche Hinweise schließen', 'Scroll to top of page':'Zum Seitenanfang',
  'Industry & Scope':'Branche und Umfang', 'The Challenge':'Die Herausforderung', 'Proposed Solution & Architecture':'Lösungsvorschlag und Architektur', 'Key Implemented Features':'Wichtige Funktionen', 'Technology Stack':'Technologie-Stack',
  'Multi-tenant logistics management orchestrator for European cross-border freight forwarders with automated e-CMR documents and GPS route optimization.': 'Mandantenfähige Logistikplattform für den europäischen grenzüberschreitenden Güterverkehr mit automatisierten e-CMR-Dokumenten und GPS-Routenoptimierung.',
  'Digital pre-appointment intake, encrypted triage records, and clinical scheduling portal engineered for outpatient practices in Germany and the EU.': 'Digitales Patientenaufnahme- und Terminportal mit verschlüsselten Triage-Daten für ambulante Praxen in Deutschland und der EU.',
  'Telemetry and forecasting dashboard for commercial solar-plus-battery operators, predicting day-ahead spot market price peaks and automating dispatch.': 'Telemetrie- und Prognose-Dashboard für gewerbliche Solar- und Batteriespeicher zur Vorhersage von Strompreisspitzen und automatisierten Steuerung.',
  'Cross-platform mobile business wallet enabling European SMEs to reconcile incoming SEPA wire transfers instantly against pending invoices.': 'Plattformübergreifende mobile Geschäftswallet, die europäischen KMU den sofortigen Abgleich eingehender SEPA-Zahlungen mit offenen Rechnungen ermöglicht.',
  'Wholesale marketplace connecting European specialty retailers with verified regional artisanal producers, featuring volume tiering and sample order escrow.': 'Großhandelsmarktplatz für europäische Fachhändler und geprüfte regionale Hersteller mit Mengenstaffeln und Treuhandfunktion für Musterbestellungen.',
  'Offline-first agronomy and soil diagnostic companion app providing field workers with local sensor logging, foliage analysis, and automated irrigation advisories.': 'Offlinefähige App für Agronomie und Bodenanalyse mit lokaler Sensorerfassung, Blattanalysen und automatisierten Bewässerungsempfehlungen.',
  'Concept Project': 'Konzeptprojekt', 'Logistics & Freight': 'Logistik und Fracht',
  'Can you build a product from just an idea?': 'Können Sie ein Produkt aus einer Idee entwickeln?',
  'Can you improve an existing application?': 'Können Sie eine bestehende Anwendung verbessern?',
  'How do you estimate cost and timeline?': 'Wie schätzen Sie Kosten und Zeitrahmen?',
  'How do we communicate during development?': 'Wie kommunizieren wir während der Entwicklung?',
  'Who owns the source code?': 'Wem gehört der Quellcode?',
  'Do you provide support after launch?': 'Bieten Sie nach dem Launch Support an?',
  'Yes. Many of our collaborations begin with an initial concept or problem statement. During our initial Discovery phase, we work with you to analyze target users, outline functional user stories, define a Minimum Viable Product (MVP) scope, and create interactive UI prototypes before writing production code.': 'Ja. Viele Projekte beginnen mit einer Idee oder Problemstellung. In der Discovery-Phase analysieren wir gemeinsam Ihre Zielgruppe, formulieren User Stories, definieren den MVP-Umfang und erstellen interaktive Prototypen, bevor wir mit der Entwicklung beginnen.',
  'Absolutely. We regularly audit and modernize pre-existing codebases. We can refactor legacy components, upgrade deprecated dependencies, optimize database query performance, patch security vulnerabilities, or add new feature modules to your current tech stack.': 'Ja. Wir prüfen und modernisieren bestehende Anwendungen, überarbeiten ältere Komponenten, aktualisieren Abhängigkeiten, optimieren Datenbankabfragen, beheben Sicherheitslücken und ergänzen neue Funktionen.',
  'Following an introductory project discussion, we break your requirements into modular sprint components with explicit deliverables. We provide transparent estimates with milestones rather than arbitrary figures. All financial and schedule agreements are documented and approved in a project scope agreement prior to commencing work.': 'Nach einem ersten Projektgespräch gliedern wir Ihre Anforderungen in Sprints mit klaren Ergebnissen und Meilensteinen. Kosten und Zeitplan werden vor Projektbeginn im Projektumfang dokumentiert und abgestimmt.',
  'All communication is conducted in clear, professional English. We use your preferred collaboration tools (Slack, Microsoft Teams, Google Meet, or email) alongside project boards like GitHub Projects or Linear. You receive structured written weekly progress reports and regular live staging previews.': 'Wir kommunizieren auf professionellem Englisch über Ihre bevorzugten Tools wie Slack, Microsoft Teams, Google Meet oder E-Mail. Sie erhalten wöchentliche Fortschrittsberichte und regelmäßige Vorschauen.',
  'You do. Upon completion of milestone deliverables and payment, 100% of the custom source code, documentation, assets, and repository rights belong exclusively to your business. We never hold your code hostage or restrict your ability to transfer it to an in-house team.': 'Sie. Nach Abschluss und Bezahlung der vereinbarten Meilensteine gehören der individuell entwickelte Quellcode, die Dokumentation, Assets und Repository-Rechte Ihrem Unternehmen.',
  'Yes. We offer flexible post-launch support and maintenance packages. These can include ongoing application monitoring, security patches, library upgrades, bug resolution, and dedicated development hours for iterative feature enhancements as your user base expands.': 'Ja. Unsere flexiblen Support- und Wartungspakete können Monitoring, Sicherheitsupdates, Bibliotheks-Upgrades, Fehlerbehebung und Entwicklungsstunden für neue Funktionen umfassen.',
  'High-converting, responsive web platforms and multi-tenant SaaS products designed for rapid onboarding, low latency, and intuitive customer engagement.': 'Responsive Webplattformen und mandantenfähige SaaS-Produkte für schnelles Onboarding, kurze Ladezeiten und eine intuitive Kundenerfahrung.',
  'Smooth, offline-capable iOS and Android applications built with Flutter or React Native. Designed to deliver native-grade gestures, camera integration, and instant push notifications.': 'Flüssige, offlinefähige iOS- und Android-Apps mit Flutter oder React Native, einschließlich nativer Gesten, Kameraintegration und Push-Benachrichtigungen.',
  'Practical, production-grade AI integrations that eliminate repetitive human overhead: automated document parsing, internal knowledge search, and task workflow automation.': 'Praxistaugliche KI-Integrationen automatisieren wiederkehrende Aufgaben, darunter Dokumentenverarbeitung, interne Wissenssuche und Arbeitsabläufe.',
  'Resilient backends, RESTful and GraphQL APIs, relational database tuning, and message queue architectures built to sustain heavy traffic spikes securely.': 'Zuverlässige Backends, REST- und GraphQL-APIs, Datenbankoptimierung und Nachrichtenwarteschlangen für sichere Systeme auch bei hoher Last.',
  'We align on core business objectives, define user journeys, assess technical constraints, and agree on an unambiguous functional scope.': 'Wir stimmen Geschäftsziele ab, definieren Nutzerabläufe, prüfen technische Rahmenbedingungen und vereinbaren einen klaren Funktionsumfang.',
  'We translate technical requirements into clean, accessible design systems and interactive UI prototypes tested for intuitive flows.': 'Wir übersetzen technische Anforderungen in klare, barrierearme Designsysteme und interaktive UI-Prototypen mit intuitiven Abläufen.',
  'We build your application in bi-weekly iterative sprints using modular, typed, and maintainable frontend and backend architectures.': 'Wir entwickeln Ihre Anwendung in zweiwöchigen Sprints mit modularen, typisierten und wartbaren Frontend- und Backend-Architekturen.',
  'Rigorous end-to-end testing, security audits, mobile viewport validations, and seamless zero-downtime production deployment.': 'Gründliche End-to-End-Tests, Sicherheitsprüfungen, mobile Tests und eine möglichst unterbrechungsfreie Bereitstellung.',
  'Continuous application monitoring, performance optimization, proactive security patches, and incremental feature development.': 'Kontinuierliches Monitoring, Leistungsoptimierung, proaktive Sicherheitsupdates und schrittweise Weiterentwicklung.',
  'Custom Software Development': 'Individuelle Softwareentwicklung', 'Web & SaaS Platforms': 'Web- und SaaS-Plattformen', 'Mobile App Development': 'Mobile App-Entwicklung', 'AI & Automation': 'KI und Automatisierung', 'Backend & API Engineering': 'Backend- und API-Entwicklung', 'Support & Product Improvement': 'Support und Produktverbesserung',
  'All Projects': 'Alle Projekte', 'Web & E-Commerce': 'Web und E-Commerce', 'SaaS Platforms': 'SaaS-Plattformen', 'Key Deliverables': 'Wichtige Ergebnisse', 'KEY DELIVERABLES': 'WICHTIGE ERGEBNISSE', 'Your Involvement': 'Ihre Mitwirkung',
  'Discover': 'Entdecken', 'Design': 'Design', 'Develop': 'Entwickeln', 'Test & Launch': 'Testen und starten', 'Support': 'Support', 'Frontend Engineering': 'Frontend-Entwicklung', 'Mobile Applications': 'Mobile Anwendungen', 'Backend & APIs': 'Backend und APIs', 'Data Storage & Caching': 'Datenspeicherung und Caching', 'DevOps & Delivery': 'DevOps und Bereitstellung',
  'Work Email': 'Geschäftliche E-Mail', 'Estimated Budget Range': 'Geschätztes Budget', 'Select a service category': 'Leistung auswählen', 'Not sure yet / Needs discovery': 'Noch unklar / Beratung erforderlich', 'Custom amount': 'Individueller Betrag', 'Privacy Notice': 'Datenschutzhinweis', 'Navigation': 'Navigation', 'Capabilities': 'Kompetenzen', 'View Case Study': 'Fallstudie ansehen'
});
Object.assign(LANGUAGE_COPY.es, {
  'NordicLogix Fleet Manager':'NordicLogix Gestión de flotas','Workspace active':'Espacio activo','Active RSTechwerk delivery workspace.':'Espacio de proyectos activo de RSTechwerk.','Maintenance Retainer':'Servicio de mantenimiento','Client Sign-In Required':'Se requiere iniciar sesión en el portal','Staff Account Detected':'Se ha detectado una cuenta de equipo','Unable to Load Workspace':'No se pudo cargar el espacio de trabajo','You are signed in with an administrator account that does not have an associated client profile. Open the Admin Console or sign in with a client account.':'Ha iniciado sesión con una cuenta de administrador sin perfil de cliente asociado. Abra la consola de administración o use una cuenta de cliente.','Open Admin Console':'Abrir consola de administración','Switch Account':'Cambiar de cuenta','Sign In to Portal':'Iniciar sesión en el portal','Create Client Account':'Crear cuenta de cliente',
  'RSTechwerk – Software Development & Technology Solutions | rstechwerk.com':'RSTechwerk – Desarrollo de software y soluciones tecnológicas | rstechwerk.com',
  'RSTechwerk turns ideas into reliable digital products—from discovery and UI/UX design to full-stack engineering, cloud deployment, and ongoing maintenance for German and European businesses.':'RSTechwerk convierte ideas en productos digitales fiables: desde el análisis y diseño UI/UX hasta el desarrollo full-stack, el despliegue en la nube y el mantenimiento para empresas de Alemania y Europa.',
  'RSTechwerk – Software Development & Technology Solutions':'RSTechwerk – Desarrollo de software y soluciones tecnológicas',
  'Turn ideas into reliable digital products with RSTechwerk. Custom software development, web & mobile apps, SaaS platforms, and AI automation.':'Convierta sus ideas en productos digitales fiables con RSTechwerk. Software a medida, aplicaciones web y móviles, plataformas SaaS y automatización con IA.',
  'System architecture blueprints & domain modeling':'Diseño de arquitectura y modelado del dominio', 'Bespoke business logic & internal administrative tools':'Lógica de negocio a medida y herramientas administrativas', 'Role-based access control (RBAC) & audit logging':'Control de acceso por roles y registros de auditoría', 'Full source code ownership with modular structure':'Propiedad completa del código fuente modular',
  'Interactive customer-facing portals':'Portales interactivos para clientes', 'Subscription billing & customer self-service':'Facturación de suscripciones y autoservicio', 'Responsive UI tested down to 360px':'Interfaz adaptable probada hasta 360 píxeles', 'Unified codebase for iOS and Android':'Código compartido para iOS y Android', 'Offline data caching & background sync':'Datos sin conexión y sincronización en segundo plano', 'App Store & Google Play submission prep':'Preparación para App Store y Google Play',
  'Custom LLM pipelines & function-calling agents':'Flujos LLM y agentes con llamadas a funciones', 'Automated invoice & PDF document extraction':'Extracción automática de datos de facturas y PDF', 'Structured JSON output validation':'Validación de resultados JSON estructurados', 'Documented REST & GraphQL API endpoints':'API REST y GraphQL documentadas', 'Normalized PostgreSQL & MySQL schema design':'Esquemas normalizados de PostgreSQL y MySQL', 'OAuth2, JWT authentication & session security':'Autenticación OAuth2 y JWT y seguridad de sesión',
  'Comprehensive code audit & security assessment':'Auditoría integral de código y seguridad', 'Performance tuning (database indexes, query caching)':'Optimización de bases de datos y caché', 'Regular dependency patches & zero-downtime updates':'Actualización de dependencias con interrupciones mínimas', 'Dedicated maintenance SLAs & rapid response times':'Acuerdos de mantenimiento y respuesta rápida',
  'Architecture blueprint, user stories, technical feasibility matrix & sprint roadmap.':'Diseño de arquitectura, historias de usuario, viabilidad técnica y planificación de sprints.', 'Collaborative discovery sessions and scope confirmation.':'Sesiones de descubrimiento y confirmación conjunta del alcance.', 'Interactive design mockups, responsive component system & clickable user flows.':'Prototipos interactivos, componentes adaptables y flujos navegables.', 'UX feedback rounds and visual approval sign-off.':'Rondas de comentarios de UX y aprobación visual.', 'Weekly deployed test builds, clean Git repositories, and automated CI pipelines.':'Versiones de prueba semanales, repositorios Git y procesos CI automatizados.', 'Bi-weekly sprint demos and test environment reviews.':'Demostraciones quincenales y revisión del entorno de pruebas.', 'Test coverage reports, production infrastructure setup, and launch checklist.':'Informes de pruebas, infraestructura de producción y lista de lanzamiento.', 'Final User Acceptance Testing (UAT) and launch authorization.':'Pruebas finales de aceptación y autorización de lanzamiento.', 'Uptime telemetry logs, scheduled dependency updates & roadmap iterations.':'Registros de disponibilidad, actualizaciones de dependencias y evolución de la hoja de ruta.', 'Monthly priority syncs and direct communication access.':'Reuniones mensuales de prioridades y comunicación directa.',
  'A clear five-stage process turns your idea into a reliable product—with visible progress, focused collaboration, and no unnecessary surprises.':'Un proceso claro de cinco fases convierte su idea en un producto fiable, con avances visibles, colaboración estrecha y sin sorpresas innecesarias.',
  'The best products come from strong partnerships—clear communication, thoughtful engineering, and a team that stays accountable from day one.':'Los mejores productos nacen de una colaboración sólida, comunicación clara y un equipo de desarrollo responsable desde el primer día.',
  'We choose proven tools with strong ecosystems—so your product stays fast, maintainable, and ready for what comes next.':'Elegimos tecnologías consolidadas para que su producto siga siendo rápido, fácil de mantener y preparado para el futuro.',
  'RSTechwerk is an independent software development team headquartered in Dhaka, Bangladesh. We build high-quality digital products for international businesses, with a particular focus on clients in Germany and broader European markets.':'RSTechwerk es un equipo independiente de desarrollo de software con sede en Daca, Bangladés. Creamos productos digitales para empresas internacionales, especialmente en Alemania y Europa.',
  'Whether you need to build a prototype from scratch, modernize an outdated legacy platform, or add specialized full-stack engineers to your existing roadmap, we provide transparent and dependable engineering services.':'Tanto si necesita crear un prototipo, modernizar una plataforma existente o incorporar desarrolladores full-stack, ofrecemos servicios de ingeniería transparentes y fiables.',
  'Everything you need to know about our process, communication, ownership, and delivery timelines.':'Todo lo que necesita saber sobre nuestro proceso, comunicación, propiedad y plazos de entrega.',
  'We turn ideas into reliable digital products—from initial discovery and UI/UX design to full-stack engineering and ongoing maintenance. German engineering standards with dedicated Dhaka development hub.':'Convertimos ideas en productos digitales fiables: desde el descubrimiento y el diseño UI/UX hasta el desarrollo full-stack y el mantenimiento continuo.',
  'Select language':'Seleccionar idioma', 'Primary Navigation':'Navegación principal', 'Toggle navigation menu':'Abrir o cerrar el menú de navegación', 'Close navigation menu':'Cerrar menú de navegación', 'Country calling code':'Prefijo telefónico del país', 'Budget currency':'Moneda del presupuesto', 'Enter your budget amount':'Introduzca su presupuesto', 'Briefly summarize your project goals, timeline, and current stage of development...':'Resuma los objetivos, el plazo y la fase actual de su proyecto...', 'Close case study dialog':'Cerrar caso de estudio', 'Close legal notice dialog':'Cerrar aviso legal', 'Scroll to top of page':'Volver al inicio',
  'Industry & Scope':'Sector y alcance', 'The Challenge':'El desafío', 'Proposed Solution & Architecture':'Solución y arquitectura propuestas', 'Key Implemented Features':'Funciones principales', 'Technology Stack':'Tecnologías utilizadas',
  'Multi-tenant logistics management orchestrator for European cross-border freight forwarders with automated e-CMR documents and GPS route optimization.': 'Plataforma logística multiempresa para transporte transfronterizo europeo, con documentos e-CMR automatizados y optimización de rutas GPS.',
  'Digital pre-appointment intake, encrypted triage records, and clinical scheduling portal engineered for outpatient practices in Germany and the EU.': 'Portal de admisión digital, historiales de triaje cifrados y gestión de citas para consultas ambulatorias de Alemania y la UE.',
  'Telemetry and forecasting dashboard for commercial solar-plus-battery operators, predicting day-ahead spot market price peaks and automating dispatch.': 'Panel de telemetría y previsión para instalaciones solares con baterías que predice picos de precios y automatiza su operación.',
  'Cross-platform mobile business wallet enabling European SMEs to reconcile incoming SEPA wire transfers instantly against pending invoices.': 'Cartera empresarial móvil multiplataforma que permite a las pymes europeas conciliar transferencias SEPA con facturas pendientes.',
  'Wholesale marketplace connecting European specialty retailers with verified regional artisanal producers, featuring volume tiering and sample order escrow.': 'Mercado mayorista que conecta comercios especializados europeos con productores artesanales verificados, con precios por volumen y custodia de pedidos de muestra.',
  'Offline-first agronomy and soil diagnostic companion app providing field workers with local sensor logging, foliage analysis, and automated irrigation advisories.': 'Aplicación agrícola sin conexión para registrar sensores, analizar el follaje y recibir recomendaciones automáticas de riego.',
  'Concept Project': 'Proyecto conceptual', 'Logistics & Freight': 'Logística y transporte',
  'Can you build a product from just an idea?': '¿Pueden crear un producto a partir de una idea?',
  'Can you improve an existing application?': '¿Pueden mejorar una aplicación existente?',
  'How do you estimate cost and timeline?': '¿Cómo estiman el coste y el plazo?',
  'How do we communicate during development?': '¿Cómo nos comunicamos durante el desarrollo?',
  'Who owns the source code?': '¿A quién pertenece el código fuente?',
  'Do you provide support after launch?': '¿Ofrecen soporte después del lanzamiento?',
  'Yes. Many of our collaborations begin with an initial concept or problem statement. During our initial Discovery phase, we work with you to analyze target users, outline functional user stories, define a Minimum Viable Product (MVP) scope, and create interactive UI prototypes before writing production code.': 'Sí. Muchos proyectos comienzan con una idea o un problema. En la fase de descubrimiento analizamos los usuarios, definimos historias de usuario y el alcance del MVP, y creamos prototipos interactivos antes de desarrollar el producto.',
  'Absolutely. We regularly audit and modernize pre-existing codebases. We can refactor legacy components, upgrade deprecated dependencies, optimize database query performance, patch security vulnerabilities, or add new feature modules to your current tech stack.': 'Sí. Auditamos y modernizamos aplicaciones existentes, actualizamos dependencias, optimizamos bases de datos, corregimos vulnerabilidades y añadimos nuevas funcionalidades.',
  'Following an introductory project discussion, we break your requirements into modular sprint components with explicit deliverables. We provide transparent estimates with milestones rather than arbitrary figures. All financial and schedule agreements are documented and approved in a project scope agreement prior to commencing work.': 'Tras una primera conversación, dividimos los requisitos en sprints con entregables e hitos claros. Documentamos y acordamos el presupuesto y los plazos antes de comenzar.',
  'All communication is conducted in clear, professional English. We use your preferred collaboration tools (Slack, Microsoft Teams, Google Meet, or email) alongside project boards like GitHub Projects or Linear. You receive structured written weekly progress reports and regular live staging previews.': 'Nos comunicamos en inglés profesional mediante sus herramientas preferidas, como Slack, Microsoft Teams, Google Meet o correo electrónico. Recibirá informes semanales y demostraciones periódicas.',
  'You do. Upon completion of milestone deliverables and payment, 100% of the custom source code, documentation, assets, and repository rights belong exclusively to your business. We never hold your code hostage or restrict your ability to transfer it to an in-house team.': 'Su empresa. Tras completar y pagar los hitos acordados, el código personalizado, la documentación, los recursos y los derechos del repositorio le pertenecen.',
  'Yes. We offer flexible post-launch support and maintenance packages. These can include ongoing application monitoring, security patches, library upgrades, bug resolution, and dedicated development hours for iterative feature enhancements as your user base expands.': 'Sí. Ofrecemos paquetes flexibles de soporte y mantenimiento que pueden incluir monitorización, actualizaciones de seguridad, mejora de bibliotecas, corrección de errores y horas de desarrollo.',
  'High-converting, responsive web platforms and multi-tenant SaaS products designed for rapid onboarding, low latency, and intuitive customer engagement.': 'Plataformas web adaptables y productos SaaS multiusuario diseñados para una incorporación rápida, baja latencia y una experiencia intuitiva.',
  'Smooth, offline-capable iOS and Android applications built with Flutter or React Native. Designed to deliver native-grade gestures, camera integration, and instant push notifications.': 'Aplicaciones iOS y Android fluidas y sin conexión, creadas con Flutter o React Native, con gestos nativos, cámara y notificaciones push.',
  'Practical, production-grade AI integrations that eliminate repetitive human overhead: automated document parsing, internal knowledge search, and task workflow automation.': 'Integraciones de IA listas para producción que automatizan el análisis de documentos, la búsqueda de conocimiento y las tareas repetitivas.',
  'Resilient backends, RESTful and GraphQL APIs, relational database tuning, and message queue architectures built to sustain heavy traffic spikes securely.': 'Backends resistentes, API REST y GraphQL, optimización de bases de datos y colas de mensajes para gestionar picos de tráfico de forma segura.',
  'We align on core business objectives, define user journeys, assess technical constraints, and agree on an unambiguous functional scope.': 'Alineamos los objetivos del negocio, definimos los recorridos de usuario, evaluamos las limitaciones técnicas y acordamos un alcance claro.',
  'We translate technical requirements into clean, accessible design systems and interactive UI prototypes tested for intuitive flows.': 'Convertimos los requisitos técnicos en sistemas de diseño accesibles y prototipos interactivos con flujos intuitivos.',
  'We build your application in bi-weekly iterative sprints using modular, typed, and maintainable frontend and backend architectures.': 'Desarrollamos su aplicación en sprints quincenales con arquitecturas frontend y backend modulares, tipadas y fáciles de mantener.',
  'Rigorous end-to-end testing, security audits, mobile viewport validations, and seamless zero-downtime production deployment.': 'Pruebas integrales, auditorías de seguridad, validación móvil y despliegue en producción con interrupciones mínimas.',
  'Continuous application monitoring, performance optimization, proactive security patches, and incremental feature development.': 'Monitorización continua, optimización del rendimiento, actualizaciones de seguridad y desarrollo progresivo de funcionalidades.',
  'Custom Software Development': 'Desarrollo de software a medida', 'Web & SaaS Platforms': 'Plataformas web y SaaS', 'Mobile App Development': 'Desarrollo de aplicaciones móviles', 'AI & Automation': 'IA y automatización', 'Backend & API Engineering': 'Desarrollo backend y de API', 'Support & Product Improvement': 'Soporte y mejora del producto',
  'All Projects': 'Todos los proyectos', 'Web & E-Commerce': 'Web y comercio electrónico', 'SaaS Platforms': 'Plataformas SaaS', 'Key Deliverables': 'Entregables principales', 'KEY DELIVERABLES': 'ENTREGABLES PRINCIPALES', 'Your Involvement': 'Su participación',
  'Discover': 'Descubrir', 'Design': 'Diseñar', 'Develop': 'Desarrollar', 'Test & Launch': 'Probar y lanzar', 'Support': 'Soporte', 'Frontend Engineering': 'Desarrollo frontend', 'Mobile Applications': 'Aplicaciones móviles', 'Backend & APIs': 'Backend y API', 'Data Storage & Caching': 'Almacenamiento y caché', 'DevOps & Delivery': 'DevOps y entrega',
  'Work Email': 'Correo de trabajo', 'Estimated Budget Range': 'Presupuesto estimado', 'Select a service category': 'Seleccione un servicio', 'Not sure yet / Needs discovery': 'Aún no lo sé / Necesito asesoramiento', 'Custom amount': 'Importe personalizado', 'Privacy Notice': 'Aviso de privacidad', 'Navigation': 'Navegación', 'Capabilities': 'Capacidades', 'View Case Study': 'Ver caso de estudio'
});
// Additional editorial, service, FAQ, form and SEO copy used across the full landing page.
Object.assign(LANGUAGE_COPY.de, {
  'GDPR Standards · Encrypted':'DSGVO-Standards · Verschlüsselt','Auto-Scaled · Zero Downtime':'Automatisch skalierbar · Keine Ausfallzeit','Corridor Transit Velocity':'Transportgeschwindigkeit auf der Route','Waybill #8492 · e-CMR Verified':'Frachtbrief Nr. 8492 · e-CMR geprüft','UI/UX Prototype':'UI/UX-Prototyp','Full-Stack Build':'Full-Stack-Entwicklung','Cloud Release':'Cloud-Veröffentlichung','42/42 Passed':'42/42 bestanden','Production Run-Rate (req/sec)':'Produktionsleistung (Anfragen/Sek.)','HTTP/3 & gRPC Enabled':'HTTP/3 und gRPC aktiviert','High-availability cloud setup with automated health checks':'Hochverfügbare Cloud-Umgebung mit automatisierten Zustandsprüfungen','EUROPEAN DATA STANDARDS':'EUROPÄISCHE DATENSTANDARDS','TLS 1.3 transit encryption & ISO-aligned architecture':'TLS-1.3-Verschlüsselung bei der Übertragung und ISO-orientierte Architektur','Scope & Architecture agreement':'Abstimmung von Umfang und Architektur','Weekly demos & direct communication':'Wöchentliche Demos und direkte Kommunikation','European Delivery Trust Principles':'Europäische Standards für zuverlässige Zusammenarbeit','Institutional reliability, GDPR compliance & 100% IP ownership guaranteed':'Verlässliche Prozesse, DSGVO-Konformität und vollständige Rechte am geistigen Eigentum','Strict EU Data Privacy Standards':'Strenge EU-Datenschutzstandards','High-Availability EU Infrastructure':'Hochverfügbare EU-Infrastruktur','Full Source Code & License Ownership':'Volles Eigentum an Quellcode und Lizenzen','Direct Sync in CET & BST Timezones':'Direkte Abstimmung in MEZ und BST',
  '01. Enterprise Core':'01. Individuelle Geschäftssysteme','When off-the-shelf software falls short of your operational requirements, we engineer bespoke digital platforms from the ground up. We structure reliable domain logic, scalable relational data schemas, and high-performance workflows tailored precisely to how your business operates.':'Wenn Standardsoftware Ihre betrieblichen Anforderungen nicht erfüllt, entwickeln wir maßgeschneiderte digitale Plattformen. Wir gestalten zuverlässige Geschäftslogik, skalierbare relationale Datenmodelle und leistungsstarke Abläufe passend zu Ihrem Unternehmen.','Stack highlights: TypeScript, Node.js, Go, PostgreSQL, Docker, Microservices':'Technologien: TypeScript, Node.js, Go, PostgreSQL, Docker und Microservices','// Distributed Architecture Pipeline':'// Verteilte Architektur-Pipeline','02. Web Applications':'02. Webanwendungen','React, Next.js, Tailwind, Stripe':'React, Next.js, Tailwind, Stripe','03. Native & Cross-Platform':'03. Native und plattformübergreifende Apps','Flutter, React Native, SQLite, REST':'Flutter, React Native, SQLite, REST','04. Intelligent Workflows':'04. Intelligente Workflows','Python, LangChain, Node.js, OCR, Vector Search':'Python, LangChain, Node.js, OCR und Vektorsuche','05. Cloud Infrastructure':'05. Cloud-Infrastruktur','Node.js, Express, Laravel, PostgreSQL, Redis':'Node.js, Express, Laravel, PostgreSQL, Redis','06. Long-Term Reliability':'06. Langfristige Zuverlässigkeit','Software longevity requires vigilant care. We take over existing codebases, refactor accumulated technical debt, upgrade dependencies, patch security vulnerabilities, and provide proactive ongoing support agreements to keep your production systems dependable.':'Langlebige Software braucht kontinuierliche Pflege. Wir übernehmen bestehende Codebasen, bauen technische Schulden ab, aktualisieren Abhängigkeiten, schließen Sicherheitslücken und halten Ihre Produktivsysteme mit proaktivem Support zuverlässig am Laufen.','Monitoring tools: Sentry, Datadog, Prometheus, Dockerized staging environments':'Monitoring: Sentry, Datadog, Prometheus und containerisierte Staging-Umgebungen','Healthcare & Clinic':'Gesundheitswesen und Kliniken','24H SPOT DISPATCH · TARIFF PEAK':'24-STUNDEN-SPOTSTEUERUNG · PREISSPITZE','OFFLINE CACHED':'OFFLINE GESPEICHERT',
  'Continuous monitoring, security patches, and emergency triage for live platforms and stable SaaS.':'Kontinuierliches Monitoring, Sicherheitsupdates und schnelle Fehleranalyse für produktive Plattformen und SaaS.','99.9% Production uptime & error tracking (Sentry / Datadog)':'99,9 % Verfügbarkeit und Fehlerüberwachung (Sentry / Datadog)','Monthly security updates & dependency patch management':'Monatliche Sicherheitsupdates und Pflege der Abhängigkeiten','Weekly off-site encrypted database backup verification':'Wöchentliche Prüfung verschlüsselter externer Datenbanksicherungen','Dedicated Senior Engineer primary contact':'Fester Senior Engineer als Hauptansprechpartner','Unused hours rollover (up to 5h into next billing cycle)':'Übertrag ungenutzter Stunden (bis zu 5 Std. in den nächsten Abrechnungszeitraum)','Most Popular · High Impact':'Besonders beliebt · Hohe Wirkung','< 4h Critical SLA':'Kritische SLA: unter 4 Std.','Active sprint velocity, new feature releases, and rapid turnaround for scaling SaaS and web products.':'Aktive Sprints, neue Funktionen und schnelle Umsetzung für wachsende SaaS- und Webprodukte.','Everything in Essential, plus:':'Alle Leistungen von Essential und zusätzlich:','Continuous bi-weekly feature development & UI polish':'Kontinuierliche Funktionsentwicklung in zweiwöchigen Sprints und UI-Optimierung','Direct shared Slack or Microsoft Teams engineering channel':'Gemeinsamer Engineering-Kanal in Slack oder Microsoft Teams','Database query indexing, query caching & latency tuning':'Datenbankindizes, Abfrage-Caching und Latenzoptimierung','2 Senior Developers allocated (Frontend + Backend)':'Zwei Senior Developer für Frontend und Backend','Staging review deployments & weekly sprint video demos':'Staging-Releases zur Prüfung und wöchentliche Sprint-Demos per Video','< 1h Emergency SLA':'Notfall-SLA: unter 1 Std.','An entire senior engineering squad integrated directly into your workflow for complex ERP or SaaS.':'Ein vollständiges Senior-Engineering-Team, direkt in Ihre Abläufe integriert – für komplexe ERP- oder SaaS-Projekte.','Full-stack pod: Lead Architect + Senior Dev + QA Tester':'Full-Stack-Team: Lead-Architekt, Senior Developer und QA-Tester','Full European business hours timezone overlap (CET / BST)':'Überschneidung mit europäischen Geschäftszeiten (MEZ / BST)','Daily async standups, pull request reviews & CI/CD automation':'Tägliche asynchrone Updates, Pull-Request-Prüfungen und CI/CD-Automatisierung','Cloud architecture scaling & server cost optimization (AWS/Hetzner)':'Skalierung der Cloud-Architektur und Optimierung der Serverkosten (AWS/Hetzner)','Zero hiring overhead, local payroll taxes, or equipment fees':'Keine Kosten für Personalbeschaffung, lokale Lohnnebenkosten oder Ausstattung','< 24h Onboarding':'Start innerhalb von 24 Std.','Targeted emergency triage for critical bugs, broken checkouts, API failures, or server issues.':'Gezielte Soforthilfe bei kritischen Fehlern, Checkout-Ausfällen, API-Problemen oder Serverstörungen.','Rapid repository onboarding & local environment reproduction':'Schnelle Einarbeitung in das Repository und Einrichtung der Entwicklungsumgebung','Immediate git hotfix branches with staging verification':'Sofortige Git-Hotfixes mit Prüfung in der Staging-Umgebung','Transparent minute-by-minute time tracking and task report':'Transparente minutengenaue Zeiterfassung und Aufgabenberichte','Post-mortem root cause analysis to prevent recurrence':'Ursachenanalyse, damit Fehler nicht erneut auftreten','Popular Sprint · Modernization':'Beliebter Sprint · Modernisierung','Framework upgrades, security debt remediation, Core Web Vitals optimization, and code audits.':'Framework-Upgrades, Behebung von Sicherheitsrisiken, Optimierung der Core Web Vitals und Codeprüfungen.','Major framework upgrades (React 19, Next.js 15, Node, Laravel)':'Größere Framework-Upgrades (React 19, Next.js 15, Node, Laravel)','Deprecated package replacement & TypeScript strict typing':'Austausch veralteter Pakete und strenge TypeScript-Typisierung','Lighthouse Core Web Vitals audit & asset compression':'Lighthouse-Prüfung der Core Web Vitals und Komprimierung von Assets','Detailed before/after performance and security report':'Detaillierter Vorher-Nachher-Bericht zu Leistung und Sicherheit','Draw hours flexibly across Frontend, Backend, Mobile, or DevOps':'Flexible Stunden für Frontend, Backend, Mobile oder DevOps einsetzen','Async ticket assignment via Jira, GitHub Issues, or Linear':'Asynchrone Aufgabenverwaltung mit Jira, GitHub Issues oder Linear','Weekly burndown tracking and transparent hours burn reports':'Wöchentliche Fortschrittsübersichten und transparente Stundenberichte','Top-up or pause anytime with zero penalty fees':'Jederzeit aufstocken oder pausieren – ohne Strafgebühren','Our core hours synchronize directly with Berlin (CET), Zurich, and London for immediate Slack responses and live video syncs.':'Unsere Kernarbeitszeiten überschneiden sich mit Berlin (MEZ), Zürich und London – für schnelle Slack-Antworten und direkte Videoabstimmungen.','All code, git branches, and documentation are committed directly to your company repositories. Never proprietary locks.':'Der gesamte Code, alle Git-Branches und die Dokumentation liegen direkt in Ihren Unternehmens-Repositories. Keine proprietären Abhängigkeiten.','Work with the actual senior engineers writing your code. Zero bureaucratic account manager layers or delayed handoffs.':'Sie arbeiten direkt mit den Senior Engineers, die Ihren Code entwickeln – ohne unnötige Managementebenen oder verzögerte Übergaben.','Zero-downtime updates: every hotfix, migration, and dependency bump is verified on an isolated staging mirror before production.':'Updates ohne Ausfallzeit: Wir prüfen Hotfixes, Migrationen und Abhängigkeitsupdates in einer separaten Staging-Umgebung, bevor sie live gehen.',
  'Transparent Communication':'Transparente Kommunikation','Speak directly with the software engineers building your product. You receive structured written updates, working demo links, and predictable sprint summaries every week.':'Sie sprechen direkt mit den Softwareentwicklern Ihres Produkts und erhalten strukturierte Updates, funktionierende Demo-Links und wöchentliche Sprint-Zusammenfassungen.','Clear Scope & Milestones':'Klarer Umfang und Meilensteine','We define measurable acceptance criteria before code is written. By locking scope into transparent sprint milestones, we avoid surprises and keep delivery on track.':'Vor der Entwicklung legen wir messbare Abnahmekriterien fest. Transparente Sprint-Meilensteine schaffen Klarheit und halten die Umsetzung auf Kurs.','Maintainable, Clean Code':'Wartbarer, sauberer Code','We write strictly-typed TypeScript and modular architectures that any qualified developer can read, test, and expand. No proprietary frameworks or vendor lock-in.':'Wir entwickeln mit streng typisiertem TypeScript und modularen Architekturen, die qualifizierte Entwickler verstehen, testen und erweitern können. Keine proprietären Frameworks oder Anbieterbindung.','Responsive & Accessible':'Responsiv und barrierearm','Every interface is built to function gracefully from 360px mobile screens to multi-monitor setups, tested against WCAG contrast guidelines and keyboard navigation.':'Jede Oberfläche funktioniert auf Mobilgeräten ab 360 px ebenso wie auf mehreren Monitoren. Wir prüfen WCAG-Kontraste und Tastaturbedienbarkeit.','Automated regression tests, input validation, edge-case testing, and cross-browser checks ensure that features perform reliably before reaching production users.':'Automatisierte Regressionstests, Eingabevalidierung, Grenzfallprüfungen und Browser-Tests sichern die Zuverlässigkeit vor dem Produktivstart.','Ongoing Support & Handoff':'Laufender Support und Übergabe','You retain complete intellectual property ownership. We provide full setup documentation, deployment scripts, and optional ongoing maintenance agreements.':'Sie behalten sämtliche Rechte am geistigen Eigentum. Wir liefern vollständige Einrichtungsdokumentation, Deployment-Skripte und optional laufende Wartung.','Responsive web apps, administrative consoles & design systems.':'Responsive Webanwendungen, Administrationsoberflächen und Designsysteme.','Cross-platform iOS and Android apps with native device integration.':'Plattformübergreifende iOS- und Android-Apps mit nativer Geräteintegration.','High-throughput RESTful endpoints, worker queues & service layers.':'Leistungsstarke REST-Endpunkte, Worker-Warteschlangen und Service-Schichten.','Reliable relational data models, transactions & low-latency caches.':'Zuverlässige relationale Datenmodelle, Transaktionen und Caches mit geringer Latenz.','Database Migrations':'Datenbankmigrationen','Containerized workflows, automated testing & cloud deployments.':'Containerisierte Abläufe, automatisierte Tests und Cloud-Deployments.','Monitoring & Observability':'Monitoring und Observability','Operational automation pipelines and structured LLM tool calling.':'Automatisierte Betriebsabläufe und strukturierte LLM-Tool-Aufrufe.','Custom LLM Workflows':'Individuelle LLM-Workflows','We don’t use generic agency buzzwords or inflated claims. Our strength lies in technical competence, meticulous attention to detail, fluent professional English communication, and a disciplined approach to building software that works as specified.':'Wir verzichten auf leere Agenturversprechen. Unsere Stärken sind technische Kompetenz, Sorgfalt, professionelle Kommunikation und eine disziplinierte Umsetzung nach Ihren Anforderungen.','Time Zone Collaboration':'Zusammenarbeit über Zeitzonen hinweg','Bangladesh Standard Time (UTC+6) is 4 to 5 hours ahead of Central European Time (CET/CEST), giving us a large daily window for real-time collaboration during your primary business hours.':'Die Bangladesh Standard Time (UTC+6) liegt je nach Jahreszeit vier bis fünf Stunden vor der Mitteleuropäischen Zeit (MEZ/MESZ). So bleibt täglich viel Zeit für die Zusammenarbeit während Ihrer Geschäftszeiten.','Dhaka (Engineering)':'Dhaka (Entwicklung)','Daily standups, live Slack/Teams communication, and rapid turnaround on European morning and afternoon inquiries.':'Tägliche Updates, direkte Kommunikation über Slack oder Teams und schnelle Antworten am europäischen Vormittag und Nachmittag.','Secure Inquiry Form:':'Sicheres Anfrageformular:','Your project details are sent securely to our backend for review. We use your contact information only to respond to this inquiry.':'Ihre Projektdaten werden sicher an unser Team übermittelt. Ihre Kontaktdaten verwenden wir ausschließlich zur Beantwortung dieser Anfrage.','Select your country code and enter your phone number.':'Wählen Sie Ihre Ländervorwahl und geben Sie Ihre Telefonnummer ein.','I agree to the secure processing of the details I submit in accordance with the':'Ich stimme der sicheren Verarbeitung meiner Angaben gemäß dem','All Service Details':'Alle Leistungsdetails','Development Process':'Entwicklungsprozess','Mobile Apps (iOS & Android)':'Mobile Apps (iOS und Android)','AI & Automation Pipelines':'KI- und Automatisierungsabläufe','Backend Architecture & APIs':'Backend-Architektur und APIs','Dedicated Maintenance & SLAs':'Dedizierte Wartung und SLAs','Legal Notice / Impressum':'Rechtliche Hinweise / Impressum','RSTechwerk. All rights reserved. •':'RSTechwerk. Alle Rechte vorbehalten. •'
});
Object.assign(LANGUAGE_COPY.es, {
  'GDPR Standards · Encrypted':'Estándares RGPD · Cifrado','Auto-Scaled · Zero Downtime':'Escalado automático · Sin interrupciones','Corridor Transit Velocity':'Velocidad de tránsito en ruta','Waybill #8492 · e-CMR Verified':'Albarán n.º 8492 · e-CMR verificado','UI/UX Prototype':'Prototipo UI/UX','Full-Stack Build':'Desarrollo full-stack','Cloud Release':'Despliegue en la nube','42/42 Passed':'42/42 superadas','Production Run-Rate (req/sec)':'Rendimiento en producción (solicitudes/s)','HTTP/3 & gRPC Enabled':'HTTP/3 y gRPC habilitados','High-availability cloud setup with automated health checks':'Infraestructura en la nube de alta disponibilidad con comprobaciones automáticas','EUROPEAN DATA STANDARDS':'ESTÁNDARES EUROPEOS DE DATOS','TLS 1.3 transit encryption & ISO-aligned architecture':'Cifrado TLS 1.3 en tránsito y arquitectura alineada con ISO','Scope & Architecture agreement':'Alineación del alcance y la arquitectura','Weekly demos & direct communication':'Demos semanales y comunicación directa','European Delivery Trust Principles':'Principios europeos de entrega fiable','Institutional reliability, GDPR compliance & 100% IP ownership guaranteed':'Procesos fiables, cumplimiento del RGPD y plena propiedad intelectual','Strict EU Data Privacy Standards':'Estrictos estándares de privacidad de la UE','High-Availability EU Infrastructure':'Infraestructura de alta disponibilidad en la UE','Full Source Code & License Ownership':'Propiedad total del código y las licencias','Direct Sync in CET & BST Timezones':'Coordinación directa en CET y BST',
  '01. Enterprise Core':'01. Sistemas empresariales a medida','When off-the-shelf software falls short of your operational requirements, we engineer bespoke digital platforms from the ground up. We structure reliable domain logic, scalable relational data schemas, and high-performance workflows tailored precisely to how your business operates.':'Cuando el software estándar no cubre sus necesidades, desarrollamos plataformas digitales a medida. Creamos lógica de negocio fiable, modelos de datos relacionales escalables y flujos de trabajo de alto rendimiento adaptados a su empresa.','Stack highlights: TypeScript, Node.js, Go, PostgreSQL, Docker, Microservices':'Tecnologías: TypeScript, Node.js, Go, PostgreSQL, Docker y microservicios','// Distributed Architecture Pipeline':'// Canalización de arquitectura distribuida','02. Web Applications':'02. Aplicaciones web','React, Next.js, Tailwind, Stripe':'React, Next.js, Tailwind, Stripe','03. Native & Cross-Platform':'03. Aplicaciones nativas y multiplataforma','Flutter, React Native, SQLite, REST':'Flutter, React Native, SQLite, REST','04. Intelligent Workflows':'04. Flujos de trabajo inteligentes','Python, LangChain, Node.js, OCR, Vector Search':'Python, LangChain, Node.js, OCR y búsqueda vectorial','05. Cloud Infrastructure':'05. Infraestructura en la nube','Node.js, Express, Laravel, PostgreSQL, Redis':'Node.js, Express, Laravel, PostgreSQL, Redis','06. Long-Term Reliability':'06. Fiabilidad a largo plazo','Software longevity requires vigilant care. We take over existing codebases, refactor accumulated technical debt, upgrade dependencies, patch security vulnerabilities, and provide proactive ongoing support agreements to keep your production systems dependable.':'El software necesita cuidados continuos para seguir siendo fiable. Asumimos código existente, reducimos la deuda técnica, actualizamos dependencias, corregimos vulnerabilidades y ofrecemos mantenimiento proactivo para sus sistemas en producción.','Monitoring tools: Sentry, Datadog, Prometheus, Dockerized staging environments':'Monitorización: Sentry, Datadog, Prometheus y entornos de pruebas en contenedores','Healthcare & Clinic':'Salud y clínicas','24H SPOT DISPATCH · TARIFF PEAK':'GESTIÓN SPOT 24 H · PICO DE TARIFA','OFFLINE CACHED':'GUARDADO SIN CONEXIÓN',
  'Continuous monitoring, security patches, and emergency triage for live platforms and stable SaaS.':'Monitorización continua, parches de seguridad y respuesta urgente para plataformas activas y productos SaaS.','99.9% Production uptime & error tracking (Sentry / Datadog)':'99,9 % de disponibilidad y seguimiento de errores (Sentry / Datadog)','Monthly security updates & dependency patch management':'Actualizaciones mensuales de seguridad y dependencias','Weekly off-site encrypted database backup verification':'Verificación semanal de copias cifradas externas de la base de datos','Dedicated Senior Engineer primary contact':'Ingeniero senior dedicado como contacto principal','Unused hours rollover (up to 5h into next billing cycle)':'Transferencia de hasta 5 horas no usadas al siguiente ciclo','Most Popular · High Impact':'Más popular · Alto impacto','< 4h Critical SLA':'SLA crítico: menos de 4 h','Active sprint velocity, new feature releases, and rapid turnaround for scaling SaaS and web products.':'Sprints activos, nuevas funcionalidades y entregas rápidas para productos web y SaaS en crecimiento.','Everything in Essential, plus:':'Todo lo incluido en Essential y, además:','Continuous bi-weekly feature development & UI polish':'Desarrollo continuo de funcionalidades en sprints quincenales y mejora de la interfaz','Direct shared Slack or Microsoft Teams engineering channel':'Canal de ingeniería compartido en Slack o Microsoft Teams','Database query indexing, query caching & latency tuning':'Índices de base de datos, caché de consultas y optimización de latencia','2 Senior Developers allocated (Frontend + Backend)':'Dos desarrolladores senior asignados a frontend y backend','Staging review deployments & weekly sprint video demos':'Despliegues de revisión en pruebas y demos semanales por vídeo','< 1h Emergency SLA':'SLA de emergencia: menos de 1 h','An entire senior engineering squad integrated directly into your workflow for complex ERP or SaaS.':'Un equipo completo de ingeniería senior integrado en su flujo de trabajo para proyectos ERP o SaaS complejos.','Full-stack pod: Lead Architect + Senior Dev + QA Tester':'Equipo full-stack: arquitecto principal, desarrollador senior y especialista QA','Full European business hours timezone overlap (CET / BST)':'Coincidencia total con el horario laboral europeo (CET/BST)','Daily async standups, pull request reviews & CI/CD automation':'Actualizaciones diarias asíncronas, revisión de pull requests y automatización CI/CD','Cloud architecture scaling & server cost optimization (AWS/Hetzner)':'Escalado de arquitectura cloud y optimización de costes de servidor (AWS/Hetzner)','Zero hiring overhead, local payroll taxes, or equipment fees':'Sin costes de contratación, cargas sociales locales ni equipamiento','< 24h Onboarding':'Incorporación en menos de 24 h','Targeted emergency triage for critical bugs, broken checkouts, API failures, or server issues.':'Respuesta específica ante errores críticos, fallos de pago, problemas de API o incidencias del servidor.','Rapid repository onboarding & local environment reproduction':'Incorporación rápida al repositorio y configuración del entorno local','Immediate git hotfix branches with staging verification':'Ramas Git de corrección inmediata verificadas en pruebas','Transparent minute-by-minute time tracking and task report':'Seguimiento transparente del tiempo y de las tareas','Post-mortem root cause analysis to prevent recurrence':'Análisis de causa raíz para evitar que vuelva a ocurrir','Popular Sprint · Modernization':'Sprint popular · Modernización','Framework upgrades, security debt remediation, Core Web Vitals optimization, and code audits.':'Actualización de frameworks, corrección de riesgos de seguridad, optimización de Core Web Vitals y auditorías de código.','Major framework upgrades (React 19, Next.js 15, Node, Laravel)':'Actualizaciones importantes (React 19, Next.js 15, Node y Laravel)','Deprecated package replacement & TypeScript strict typing':'Sustitución de paquetes obsoletos y tipado estricto con TypeScript','Lighthouse Core Web Vitals audit & asset compression':'Auditoría Lighthouse de Core Web Vitals y compresión de recursos','Detailed before/after performance and security report':'Informe detallado de rendimiento y seguridad antes y después','Draw hours flexibly across Frontend, Backend, Mobile, or DevOps':'Use las horas en frontend, backend, móvil o DevOps con flexibilidad','Async ticket assignment via Jira, GitHub Issues, or Linear':'Asignación asíncrona de tareas en Jira, GitHub Issues o Linear','Weekly burndown tracking and transparent hours burn reports':'Seguimiento semanal del progreso e informes transparentes de horas','Top-up or pause anytime with zero penalty fees':'Añada horas o pause el servicio cuando quiera, sin penalización','Our core hours synchronize directly with Berlin (CET), Zurich, and London for immediate Slack responses and live video syncs.':'Nuestro horario coincide con Berlín (CET), Zúrich y Londres para responder rápidamente por Slack y reunirse por vídeo.','All code, git branches, and documentation are committed directly to your company repositories. Never proprietary locks.':'Todo el código, las ramas Git y la documentación se guardan en los repositorios de su empresa. Sin dependencias propietarias.','Work with the actual senior engineers writing your code. Zero bureaucratic account manager layers or delayed handoffs.':'Trabaje directamente con los ingenieros senior que desarrollan su producto, sin capas burocráticas ni traspasos lentos.','Zero-downtime updates: every hotfix, migration, and dependency bump is verified on an isolated staging mirror before production.':'Actualizaciones sin interrupciones: verificamos cada corrección, migración y dependencia en un entorno aislado antes de producción.',
  'Transparent Communication':'Comunicación transparente','Speak directly with the software engineers building your product. You receive structured written updates, working demo links, and predictable sprint summaries every week.':'Hable directamente con los ingenieros de su producto y reciba actualizaciones estructuradas, demos funcionales y resúmenes semanales de sprint.','Clear Scope & Milestones':'Alcance e hitos claros','We define measurable acceptance criteria before code is written. By locking scope into transparent sprint milestones, we avoid surprises and keep delivery on track.':'Definimos criterios de aceptación medibles antes de programar. Los hitos transparentes evitan sorpresas y mantienen el proyecto en curso.','Maintainable, Clean Code':'Código limpio y mantenible','We write strictly-typed TypeScript and modular architectures that any qualified developer can read, test, and expand. No proprietary frameworks or vendor lock-in.':'Usamos TypeScript con tipado estricto y arquitecturas modulares que cualquier profesional cualificado puede comprender, probar y ampliar. Sin frameworks propietarios ni dependencia de proveedor.','Responsive & Accessible':'Adaptable y accesible','Every interface is built to function gracefully from 360px mobile screens to multi-monitor setups, tested against WCAG contrast guidelines and keyboard navigation.':'Cada interfaz funciona desde móviles de 360 px hasta configuraciones con varios monitores y se prueba según las pautas WCAG de contraste y navegación por teclado.','Automated regression tests, input validation, edge-case testing, and cross-browser checks ensure that features perform reliably before reaching production users.':'Las pruebas de regresión, validación de datos, casos límite y compatibilidad entre navegadores verifican cada función antes de producción.','Ongoing Support & Handoff':'Soporte continuo y entrega','You retain complete intellectual property ownership. We provide full setup documentation, deployment scripts, and optional ongoing maintenance agreements.':'Conserva todos los derechos de propiedad intelectual. Entregamos documentación, scripts de despliegue y opciones de mantenimiento continuo.','Responsive web apps, administrative consoles & design systems.':'Aplicaciones web adaptables, consolas administrativas y sistemas de diseño.','Cross-platform iOS and Android apps with native device integration.':'Aplicaciones iOS y Android multiplataforma con integración nativa del dispositivo.','High-throughput RESTful endpoints, worker queues & service layers.':'Endpoints REST de alto rendimiento, colas de tareas y capas de servicio.','Reliable relational data models, transactions & low-latency caches.':'Modelos relacionales fiables, transacciones y cachés de baja latencia.','Database Migrations':'Migraciones de bases de datos','Containerized workflows, automated testing & cloud deployments.':'Flujos en contenedores, pruebas automatizadas y despliegues en la nube.','Monitoring & Observability':'Monitorización y observabilidad','Operational automation pipelines and structured LLM tool calling.':'Flujos de automatización operativa y llamadas estructuradas a herramientas LLM.','Custom LLM Workflows':'Flujos LLM personalizados','We don’t use generic agency buzzwords or inflated claims. Our strength lies in technical competence, meticulous attention to detail, fluent professional English communication, and a disciplined approach to building software that works as specified.':'No usamos promesas vacías. Nos distinguen la competencia técnica, la atención al detalle, la comunicación profesional y el compromiso de desarrollar software según lo acordado.','Time Zone Collaboration':'Colaboración entre zonas horarias','Bangladesh Standard Time (UTC+6) is 4 to 5 hours ahead of Central European Time (CET/CEST), giving us a large daily window for real-time collaboration during your primary business hours.':'La hora de Bangladés (UTC+6) está entre cuatro y cinco horas por delante de la hora centroeuropea (CET/CEST), lo que permite colaborar en tiempo real durante gran parte de su jornada.','Dhaka (Engineering)':'Daca (Ingeniería)','Daily standups, live Slack/Teams communication, and rapid turnaround on European morning and afternoon inquiries.':'Actualizaciones diarias, comunicación directa por Slack o Teams y respuesta rápida durante las mañanas y tardes europeas.','Secure Inquiry Form:':'Formulario de consulta seguro:','Your project details are sent securely to our backend for review. We use your contact information only to respond to this inquiry.':'Los datos del proyecto se envían de forma segura a nuestro equipo. Usamos sus datos de contacto únicamente para responder a esta consulta.','Select your country code and enter your phone number.':'Seleccione el prefijo del país e introduzca su número de teléfono.','I agree to the secure processing of the details I submit in accordance with the':'Acepto el tratamiento seguro de los datos que envío de acuerdo con el','All Service Details':'Todos los detalles del servicio','Development Process':'Proceso de desarrollo','Mobile Apps (iOS & Android)':'Aplicaciones móviles (iOS y Android)','AI & Automation Pipelines':'Flujos de IA y automatización','Backend Architecture & APIs':'Arquitectura backend y API','Dedicated Maintenance & SLAs':'Mantenimiento dedicado y SLA','Legal Notice / Impressum':'Aviso legal / Impressum','RSTechwerk. All rights reserved. •':'RSTechwerk. Todos los derechos reservados. •'
});
Object.assign(LANGUAGE_COPY.de, {
  'Skip to main content':'Zum Hauptinhalt springen','Berlin → Munich':'Berlin → München','✓ UI/UX Prototype':'✓ UI/UX-Prototyp','✓ Full-Stack Build':'✓ Full-Stack-Entwicklung','✓ Cloud Release':'✓ Cloud-Deployment','✓ 42/42 Passed':'✓ 42/42 bestanden','✓ OFFLINE CACHED':'✓ OFFLINE GESPEICHERT',
  'Keep your production software reliable, secure, and continuously evolving. Hire our senior engineering squad for monthly maintenance retainers or book flexible hourly sprint packs—with guaranteed SLAs, direct developer communication, and complete code ownership.':'Halten Sie Ihre Produktivsoftware zuverlässig, sicher und aktuell. Buchen Sie unser Senior-Engineering-Team als monatlichen Retainer oder flexible Stundenpakete – mit garantierten SLAs, direktem Entwicklerkontakt und vollem Code-Eigentum.','per month dedicated':'pro Monat (dediziert)','< 4h Critical SLA':'Kritische SLA: unter 4 Std.','< 1h Emergency SLA':'Notfall-SLA: unter 1 Std.','< 24h Onboarding':'Start innerhalb von 24 Std.','valid for 60 calendar days':'60 Kalendertage gültig','valid for 90 calendar days':'90 Kalendertage gültig','Major framework upgrades (React 19, Next.js, Node, Laravel)':'Größere Framework-Upgrades (React 19, Next.js, Node, Laravel)','Book 25h Modernization':'25 Std. Modernisierung buchen','Flexible Engineering Bucket':'Flexibles Engineering-Stundenpaket','An on-demand hours pool for companies with fluctuating backlogs or seasonal feature releases.':'Flexibles Stundenkontingent für Unternehmen mit wechselndem Arbeitsaufkommen oder saisonalen Releases.','valid for 180 calendar days':'180 Kalendertage gültig','Book 50h Flexible Bucket':'50 Std. flexibles Paket buchen','A better way to build software':'Software besser gemeinsam entwickeln','The right technology for':'Die passende Technologie für','A dedicated team for':'Ein engagiertes Team für','ambitious digital products.':'ambitionierte digitale Produkte.','Clear answers for a':'Klare Antworten für einen','We reply to every business inquiry within 24 business hours.':'Wir beantworten geschäftliche Anfragen innerhalb von 24 Werktagsstunden.','We gladly sign standard mutual NDAs prior to detailed technical discussions.':'Vor detaillierten technischen Gesprächen unterzeichnen wir gern eine übliche gegenseitige Vertraulichkeitsvereinbarung.','Custom Software & Enterprise ERP':'Individuelle Software und Enterprise-ERP','Mobile App Development (iOS & Android)':'Entwicklung mobiler Apps (iOS und Android)','AI & Intelligent Automation':'KI und intelligente Automatisierung','Backend, APIs & Integrations':'Backend, APIs und Integrationen','Cloud Infrastructure & DevOps SLA':'Cloud-Infrastruktur und DevOps-SLAs','Maintenance: Essential Care (20h/mo)':'Wartung: Essential Care (20 Std./Monat)','Maintenance: Growth & Scale Pod (40h/mo)':'Wartung: Growth & Scale Pod (40 Std./Monat)','Maintenance: Dedicated Team Pod (160h/mo)':'Wartung: Dediziertes Team-Pod (160 Std./Monat)','Hourly Sprint: 10h Quick-Fix Pack':'Stunden-Sprint: 10-Std.-Quick-Fix-Paket','Hourly Sprint: 25h Modernization Pack':'Stunden-Sprint: 25-Std.-Modernisierungspaket','Hourly Sprint: 50h Flexible Bucket':'Stunden-Sprint: 50-Std.-Flexpaket','Other Support & Maintenance':'Sonstiger Support und Wartung','RSTechwerk. All rights reserved. &bull;':'RSTechwerk. Alle Rechte vorbehalten. •',
  'Thanks — your inquiry has been received.':'Vielen Dank – Ihre Anfrage ist eingegangen.','Our team will review your project and respond within one business day.':'Unser Team prüft Ihr Projekt und antwortet innerhalb eines Werktags.','We could not process your inquiry. Please try again.':'Ihre Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.','Network error or connection failed. Entered data has been preserved; please try again.':'Netzwerkfehler oder Verbindungsabbruch. Ihre Angaben wurden gespeichert; bitte versuchen Sie es erneut.'
});
Object.assign(LANGUAGE_COPY.es, {
  'Skip to main content':'Saltar al contenido principal','Berlin → Munich':'Berlín → Múnich','✓ UI/UX Prototype':'✓ Prototipo UI/UX','✓ Full-Stack Build':'✓ Desarrollo full-stack','✓ Cloud Release':'✓ Despliegue en la nube','✓ 42/42 Passed':'✓ 42/42 superadas','✓ OFFLINE CACHED':'✓ GUARDADO SIN CONEXIÓN',
  'Keep your production software reliable, secure, and continuously evolving. Hire our senior engineering squad for monthly maintenance retainers or book flexible hourly sprint packs—with guaranteed SLAs, direct developer communication, and complete code ownership.':'Mantenga su software de producción seguro, fiable y actualizado. Contrate nuestro equipo senior mediante un servicio mensual o paquetes flexibles por horas, con SLA garantizados, comunicación directa y plena propiedad del código.','per month dedicated':'por mes (dedicado)','< 4h Critical SLA':'SLA crítico: menos de 4 h','< 1h Emergency SLA':'SLA de emergencia: menos de 1 h','< 24h Onboarding':'Incorporación en menos de 24 h','valid for 60 calendar days':'válido durante 60 días naturales','valid for 90 calendar days':'válido durante 90 días naturales','Major framework upgrades (React 19, Next.js, Node, Laravel)':'Actualizaciones importantes (React 19, Next.js, Node y Laravel)','Book 25h Modernization':'Contratar modernización de 25 h','Flexible Engineering Bucket':'Paquete flexible de ingeniería','An on-demand hours pool for companies with fluctuating backlogs or seasonal feature releases.':'Bolsa de horas bajo demanda para empresas con cargas variables o lanzamientos estacionales.','valid for 180 calendar days':'válido durante 180 días naturales','Book 50h Flexible Bucket':'Contratar paquete flexible de 50 h','A better way to build software':'Una mejor forma de desarrollar software','The right technology for':'La tecnología adecuada para','A dedicated team for':'Un equipo dedicado para','ambitious digital products.':'productos digitales ambiciosos.','Clear answers for a':'Respuestas claras para','We reply to every business inquiry within 24 business hours.':'Respondemos a las consultas comerciales en un plazo de 24 horas laborables.','We gladly sign standard mutual NDAs prior to detailed technical discussions.':'Firmamos acuerdos de confidencialidad mutua antes de las conversaciones técnicas detalladas.','Custom Software & Enterprise ERP':'Software a medida y ERP empresarial','Mobile App Development (iOS & Android)':'Desarrollo de aplicaciones móviles (iOS y Android)','AI & Intelligent Automation':'IA y automatización inteligente','Backend, APIs & Integrations':'Backend, API e integraciones','Cloud Infrastructure & DevOps SLA':'Infraestructura cloud y SLA de DevOps','Maintenance: Essential Care (20h/mo)':'Mantenimiento: Essential Care (20 h/mes)','Maintenance: Growth & Scale Pod (40h/mo)':'Mantenimiento: Growth & Scale Pod (40 h/mes)','Maintenance: Dedicated Team Pod (160h/mo)':'Mantenimiento: equipo dedicado (160 h/mes)','Hourly Sprint: 10h Quick-Fix Pack':'Sprint por horas: paquete Quick-Fix de 10 h','Hourly Sprint: 25h Modernization Pack':'Sprint por horas: paquete de modernización de 25 h','Hourly Sprint: 50h Flexible Bucket':'Sprint por horas: paquete flexible de 50 h','Other Support & Maintenance':'Otro soporte y mantenimiento','RSTechwerk. All rights reserved. &bull;':'RSTechwerk. Todos los derechos reservados. •',
  'Thanks — your inquiry has been received.':'Gracias: hemos recibido su consulta.','Our team will review your project and respond within one business day.':'Nuestro equipo revisará su proyecto y responderá en un día laborable.','We could not process your inquiry. Please try again.':'No se pudo procesar su consulta. Inténtelo de nuevo.','Network error or connection failed. Entered data has been preserved; please try again.':'Error de red o conexión. Se conservaron sus datos; inténtelo de nuevo.'
});
// Seed the shared translation editor with the client portal's complete static interface copy.
Object.assign(LANGUAGE_COPY.de, {
  "Client Portal": "Kundenportal",
  "Overview": "Übersicht",
  "Projects & Milestones": "Projekte & Meilensteine",
  "Quotes & Offers": "Angebote",
  "Maintenance & Retainers": "Wartung & Retainer",
  "Billing & Invoices": "Abrechnung & Rechnungen",
  "Delivery Updates": "Projektupdates",
  "Documents": "Dokumente",
  "Profile & Security": "Profil & Sicherheit",
  "Workspace": "Arbeitsbereich",
  "Contact Team": "Team kontaktieren",
  "My Profile": "Mein Profil",
  "CLIENT WORKSPACE": "KUNDENARBEITSBEREICH",
  "Open quotes": "Offene Angebote",
  "Running projects": "Laufende Projekte",
  "Average progress": "Durchschnittlicher Fortschritt",
  "Need something from the team?": "Sie brauchen Unterstützung vom Team?",
  "Company & contact details": "Unternehmens- und Kontaktdaten",
  "Save profile": "Profil speichern",
  "Security": "Sicherheit",
  "Change password": "Passwort ändern",
  "Preferred language": "Bevorzugte Sprache",
  "English": "Englisch",
  "Deutsch": "Deutsch",
  "Ongoing care for your software": "Laufende Betreuung Ihrer Software",
  "Maintenance invoices": "Wartungsrechnungen",
  "Accept offer": "Angebot annehmen",
  "Reject": "Ablehnen",
  "No projects yet": "Noch keine Projekte",
  "No maintenance services are currently assigned to this account.": "Diesem Konto sind derzeit keine Wartungsleistungen zugewiesen.",
  "Select language": "Sprache auswählen",
  "Open navigation menu": "Navigationsmenü öffnen",
  "Close navigation menu": "Navigationsmenü schließen",
  "Client workspace navigation": "Navigation im Kundenbereich",
  "Select project": "Projekt auswählen",
  "Filter offers": "Angebote filtern",
  "Filter billing ledger": "Abrechnung filtern",
  "Search files or projects…": "Dateien oder Projekte suchen…",
  "Engineering sprint updates and release notes will appear here as work progresses.": "Sprint-Updates und Release-Hinweise erscheinen hier im Projektverlauf.",
  "Detailed delivery progress, milestone approvals, and project files.": "Detaillierter Projektfortschritt, Meilensteinfreigaben und Projektdateien.",
  "Custom engineering proposals and project scopes prepared for your organization will appear here.": "Individuelle Angebote und Projektumfänge für Ihr Unternehmen erscheinen hier.",
  "Active retainer agreements and post-launch SLA coverage will appear here.": "Aktive Retainer und Supportvereinbarungen nach dem Launch erscheinen hier.",
  "Recurring and on-demand retainer invoices will appear here once billed.": "Wiederkehrende und bedarfsbezogene Retainer-Rechnungen erscheinen nach der Abrechnung.",
  "Monitor active SLA plans, recurring engineering retainers, and maintenance billing.": "Verwalten Sie aktive SLAs, Engineering-Retainer und Wartungsabrechnungen.",
  "Project milestone charges, invoices, and maintenance bills will appear here.": "Projektmeilensteine, Rechnungen und Wartungsgebühren erscheinen hier.",
  "Consolidated ledger of project milestones, invoices, and maintenance payments.": "Übersicht über Projektmeilensteine, Rechnungen und Wartungszahlungen.",
  "Weekly sprint summaries and engineering release notes will appear here.": "Wöchentliche Sprint-Zusammenfassungen und Release-Hinweise erscheinen hier.",
  "Chronological sprint progress and engineering notes across your projects.": "Chronologischer Fortschritt und technische Notizen zu Ihren Projekten.",
  "Secure access to specifications, technical deliverables, and project documentation.": "Sicherer Zugriff auf Spezifikationen, technische Ergebnisse und Projektdokumentation.",
  "Manage your organization details, contact preferences, and account password.": "Verwalten Sie Unternehmensdaten, Kontaktpräferenzen und Ihr Passwort.",
  "No Matching Documents": "Keine passenden Dokumente",
  "Active": "Aktiv",
  "In Progress": "In Bearbeitung",
  "On Hold": "Pausiert",
  "Client Review": "Kundenprüfung",
  "Testing": "Im Test",
  "Completed": "Abgeschlossen",
  "Cancelled": "Storniert",
  "Draft": "Entwurf",
  "Sent": "Gesendet",
  "Rejected": "Abgelehnt",
  "Expired": "Abgelaufen",
  "Pending": "Ausstehend",
  "Paid": "Bezahlt",
  "Overdue": "Überfällig",
  "Approved": "Freigegeben",
  "Submitted": "Eingereicht",
  "Revision Requested": "Änderung angefragt",
  "Payment Pending": "Zahlung ausstehend",
  "Failed": "Fehlgeschlagen",
  "Track active builds, review submitted deliverables, and manage milestone payments.": "Verfolgen Sie laufende Projekte, prüfen Sie Lieferungen und verwalten Sie Meilensteinzahlungen.",
  "Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.": "Sobald Sie ein Angebot annehmen und die Entwicklung beginnt, erscheint hier Ihr vollständiger Projektbereich.",
  "Deliverable milestones will appear here once scheduled by your project lead.": "Die vereinbarten Meilensteine erscheinen hier, sobald sie geplant wurden.",
  "Invoices linked to this project will appear here when issued.": "Rechnungen zu diesem Projekt erscheinen hier nach der Ausstellung.",
  "Sprint progress reports and deployment notices for this project will appear here.": "Sprintberichte und Deployment-Mitteilungen erscheinen hier im Projektverlauf.",
  "Architecture diagrams, specifications, and release bundles shared by your team will appear here.": "Hier erscheinen Architekturdiagramme, Spezifikationen und Release-Dateien Ihres Teams.",
  "Review project proposals, commercial scope, and authorize engagement kickoff.": "Prüfen Sie Projektangebote und Leistungsumfang und geben Sie den Projektstart frei.",
  "No Billing Records Found": "Keine Abrechnungsdaten gefunden",
  "No Shared Documents Yet": "Noch keine Dokumente geteilt",
  "Accept Offer": "Angebot annehmen",
  "Decline": "Ablehnen",
  "Approve": "Freigeben",
  "Request Revision": "Änderung anfordern",
  "Pay with Stripe": "Mit Stripe bezahlen",
  "Dismiss": "Schließen",
  "No Active Projects Yet": "Noch keine aktiven Projekte",
  "No Delivery Updates Yet": "Noch keine Projektupdates",
  "Review Open Offers": "Offene Angebote ansehen",
  "View Projects": "Projekte ansehen",
  "View Offers": "Angebote ansehen",
  "Active Projects": "Aktive Projekte",
  "Open Offers": "Offene Angebote",
  "Average Progress": "Durchschnittlicher Fortschritt",
  "Balance Due": "Offener Betrag",
  "Across running projects": "Über laufende Projekte",
  "Project Workspaces": "Projektübersicht",
  "Current delivery progress and milestone status": "Aktueller Fortschritt und Status der Meilensteine",
  "Recent Delivery Updates": "Neueste Projektupdates",
  "Latest notes from your engineering team": "Aktuelle Nachrichten Ihres Entwicklungsteams",
  "All Projects →": "Alle Projekte →",
  "Full Timeline →": "Gesamten Verlauf →",
  "No Projects Assigned Yet": "Noch keine Projekte zugewiesen",
  "Check Quotes & Offers": "Angebote ansehen",
  "Milestone": "Meilenstein",
  "Due Date": "Fälligkeitsdatum",
  "Actions": "Aktionen",
  "No Milestones Configured": "Noch keine Meilensteine eingerichtet",
  "Invoice #": "Rechnungsnummer",
  "Description": "Beschreibung",
  "No Project Invoices": "Keine Projektrechnungen",
  "No Updates Posted": "Noch keine Updates veröffentlicht",
  "Download": "Herunterladen",
  "No Shared Files": "Noch keine Dateien geteilt",
  "No Offers in This View": "Keine Angebote in dieser Ansicht",
  "Open": "Offen",
  "Accepted": "Angenommen",
  "Closed": "Abgeschlossen",
  "Plan / Service": "Plan / Leistung",
  "Linked Project": "Zugehöriges Projekt",
  "Cadence": "Intervall",
  "Next Billing": "Nächste Abrechnung",
  "Rate": "Preis",
  "No Maintenance Contracts": "Keine Wartungsverträge",
  "Contract": "Vertrag",
  "Payment": "Zahlung",
  "No Maintenance Invoices": "Keine Wartungsrechnungen",
  "Active Care Plans": "Aktive Wartungspläne",
  "Monthly Retainer Rate": "Monatlicher Retainer-Preis",
  "Active monthly commitments": "Aktive monatliche Vereinbarungen",
  "Open Maintenance Invoices": "Offene Wartungsrechnungen",
  "Active Maintenance Contracts": "Aktive Wartungsverträge",
  "Maintenance Invoices": "Wartungsrechnungen",
  "Company name": "Unternehmensname",
  "Contact name": "Kontaktperson",
  "Email": "E-Mail",
  "Phone": "Telefon",
  "Country": "Land",
  "Company website": "Unternehmenswebsite",
  "Timezone": "Zeitzone",
  "Address": "Adresse",
  "City / postal code": "Stadt / Postleitzahl",
  "Current password": "Aktuelles Passwort",
  "New password": "Neues Passwort",
  "Profile": "Profil",
  "Account": "Konto",
  "Sign out": "Abmelden",
  "Back to website": "Zur Website",
  "Projects": "Projekte",
  "Offers": "Angebote",
  "Invoices": "Rechnungen",
  "Updates": "Aktualisierungen",
  "Status": "Status",
  "Amount": "Betrag",
  "Due date": "Fälligkeitsdatum",
  "No invoices yet.": "Noch keine Rechnungen.",
  "No updates yet.": "Noch keine Aktualisierungen.",
  "No documents yet.": "Noch keine Dokumente.",
  "Loading…": "Wird geladen…",
  "Client Workspace | RSTechwerk": "Kundenbereich | RSTechwerk",
  "Techwerk": "Techwerk",
  "Maintenance": "Wartung",
  "Delivery & Files": "Lieferung & Dateien",
  "Client Account": "Kundenkonto",
  "Back to Website": "Zur Website",
  "Sign Out": "Abmelden",
  "Welcome back,": "Willkommen zurück,",
  "Client Delivery Workspace": "Kunden-Projektbereich",
  "total projects": "Projekte insgesamt",
  "total project": "Projekt insgesamt",
  "proposal on file": "Angebot hinterlegt",
  "proposals on file": "Angebote hinterlegt",
  "active care plan": "aktiver Betreuungsplan",
  "active care plans": "aktive Betreuungspläne",
  "Action Required": "Aktion erforderlich",
  "Review Offer:": "Angebot prüfen:",
  "Offered amount": "Angebotssumme",
  "Awaiting your decision": "Wartet auf Ihre Entscheidung",
  "Approve Deliverable:": "Lieferung freigeben:",
  "Submitted for your review": "Zur Prüfung eingereicht",
  "Milestone Payment:": "Meilensteinzahlung:",
  "Maintenance Invoice": "Wartungsrechnung",
  "Start": "Start",
  "Target Due": "Geplantes Ende",
  "complete": "abgeschlossen",
  "Milestones": "Meilensteine",
  "Shared Documents": "Geteilte Dokumente",
  "Created": "Erstellt",
  "Valid until": "Gültig bis",
  "Account-wide": "Gesamtes Kundenkonto",
  "Ongoing software maintenance and SLA coverage": "Laufende Softwarewartung und SLA-Abdeckung",
  "Reference": "Referenz",
  "Item & Project": "Position & Projekt",
  "Action": "Aktion",
  "All": "Alle",
  "Unpaid": "Offen",
  "Due": "Fällig",
  "All Projects": "Alle Projekte",
  "Document Name": "Dokumentname",
  "Project": "Projekt",
  "Type": "Typ",
  "Size": "Größe",
  "Shared On": "Geteilt am",
  "Try clearing your search filter to inspect all project files.": "Entfernen Sie den Suchfilter, um alle Projektdateien zu sehen.",
  "Contracts, technical specifications, and delivery packages shared with you will appear here.": "Verträge, technische Spezifikationen und bereitgestellte Dateien erscheinen hier.",
  "Saving…": "Wird gespeichert …",
  "Updating…": "Wird aktualisiert …",
  "Profile saved successfully.": "Profil erfolgreich gespeichert.",
  "Password updated. Use it on your next sign-in.": "Passwort aktualisiert. Verwenden Sie es bei der nächsten Anmeldung.",
  "% complete": "% abgeschlossen",
  "Download failed.": "Download fehlgeschlagen.",
  "Unable to download file.": "Datei konnte nicht heruntergeladen werden.",
  "Payment checkout URL was not returned.": "Es wurde keine Zahlungs-URL zurückgegeben.",
  "Please sign in to access your client workspace.": "Bitte melden Sie sich an, um auf den Kundenbereich zuzugreifen.",
  "Unable to load portal data.": "Die Portaldaten konnten nicht geladen werden.",
  "PayPal maintenance payment confirmed and recorded.": "PayPal-Zahlung für die Wartung wurde bestätigt und verbucht.",
  "PayPal capture is pending verification.": "Die PayPal-Zahlung wird noch überprüft.",
  "Payment completed. Invoice status updates automatically once confirmed.": "Zahlung abgeschlossen. Der Rechnungsstatus wird nach Bestätigung automatisch aktualisiert.",
  "Checkout was cancelled. No charge was made.": "Der Zahlungsvorgang wurde abgebrochen. Es wurde nichts berechnet.",
  "Unknown": "Unbekannt",
  "PayPal": "PayPal",
  "Stripe": "Stripe",
  "Your project workspace will appear automatically once you accept an open offer.": "Ihr Projektbereich wird freigeschaltet, sobald Sie ein Angebot annehmen.",
  "Projects assigned to your company account will appear here.": "Hier erscheinen Projekte, die Ihrem Unternehmenskonto zugewiesen sind."
});
Object.assign(LANGUAGE_COPY.es, {
  "Client Portal": "Portal del cliente",
  "Overview": "Resumen",
  "Projects & Milestones": "Proyectos e hitos",
  "Quotes & Offers": "Presupuestos y ofertas",
  "Maintenance & Retainers": "Mantenimiento y retainers",
  "Billing & Invoices": "Facturación y facturas",
  "Delivery Updates": "Actualizaciones",
  "Documents": "Documentos",
  "Profile & Security": "Perfil y seguridad",
  "Workspace": "Espacio de trabajo",
  "Contact Team": "Contactar al equipo",
  "My Profile": "Mi perfil",
  "CLIENT WORKSPACE": "ESPACIO DEL CLIENTE",
  "Open quotes": "Cotizaciones abiertas",
  "Running projects": "Proyectos activos",
  "Average progress": "Progreso medio",
  "Need something from the team?": "¿Necesita ayuda del equipo?",
  "Company & contact details": "Datos de empresa y contacto",
  "Save profile": "Guardar perfil",
  "Security": "Seguridad",
  "Change password": "Cambiar contraseña",
  "Preferred language": "Idioma preferido",
  "English": "Inglés",
  "Deutsch": "Alemán",
  "Ongoing care for your software": "Soporte continuo para su software",
  "Maintenance invoices": "Facturas de mantenimiento",
  "Accept offer": "Aceptar oferta",
  "Reject": "Rechazar",
  "No projects yet": "Aún no hay proyectos",
  "No maintenance services are currently assigned to this account.": "No hay servicios de mantenimiento asignados a esta cuenta.",
  "Select language": "Seleccionar idioma",
  "Open navigation menu": "Abrir menú de navegación",
  "Close navigation menu": "Cerrar menú de navegación",
  "Client workspace navigation": "Navegación del espacio del cliente",
  "Select project": "Seleccionar proyecto",
  "Filter offers": "Filtrar ofertas",
  "Filter billing ledger": "Filtrar facturación",
  "Search files or projects…": "Buscar archivos o proyectos…",
  "Engineering sprint updates and release notes will appear here as work progresses.": "Las novedades de los sprints y las versiones aparecerán aquí conforme avance el trabajo.",
  "Detailed delivery progress, milestone approvals, and project files.": "Progreso detallado, aprobación de hitos y archivos del proyecto.",
  "Custom engineering proposals and project scopes prepared for your organization will appear here.": "Las propuestas y los alcances preparados para su organización aparecerán aquí.",
  "Active retainer agreements and post-launch SLA coverage will appear here.": "Aquí aparecerán los contratos activos y la cobertura posterior al lanzamiento.",
  "Recurring and on-demand retainer invoices will appear here once billed.": "Aquí aparecerán las facturas recurrentes y bajo demanda cuando se emitan.",
  "Monitor active SLA plans, recurring engineering retainers, and maintenance billing.": "Consulte los acuerdos SLA, los servicios recurrentes y la facturación del mantenimiento.",
  "Project milestone charges, invoices, and maintenance bills will appear here.": "Aquí aparecerán los hitos, facturas y cargos de mantenimiento.",
  "Consolidated ledger of project milestones, invoices, and maintenance payments.": "Resumen de hitos, facturas y pagos de mantenimiento.",
  "Weekly sprint summaries and engineering release notes will appear here.": "Aquí aparecerán resúmenes semanales de sprint y notas de versiones.",
  "Chronological sprint progress and engineering notes across your projects.": "Progreso cronológico de los sprints y notas técnicas de sus proyectos.",
  "Secure access to specifications, technical deliverables, and project documentation.": "Acceso seguro a especificaciones, entregas técnicas y documentación del proyecto.",
  "Manage your organization details, contact preferences, and account password.": "Gestione los datos de su empresa, sus preferencias de contacto y su contraseña.",
  "No Matching Documents": "No hay documentos coincidentes",
  "Active": "Activo",
  "In Progress": "En curso",
  "On Hold": "En pausa",
  "Client Review": "Revisión del cliente",
  "Testing": "En pruebas",
  "Completed": "Completado",
  "Cancelled": "Cancelado",
  "Draft": "Borrador",
  "Sent": "Enviada",
  "Rejected": "Rechazada",
  "Expired": "Vencida",
  "Pending": "Pendiente",
  "Paid": "Pagadas",
  "Overdue": "Vencida",
  "Approved": "Aprobado",
  "Submitted": "Enviado",
  "Revision Requested": "Cambios solicitados",
  "Payment Pending": "Pago pendiente",
  "Failed": "Fallido",
  "Track active builds, review submitted deliverables, and manage milestone payments.": "Siga los proyectos activos, revise las entregas y gestione los pagos por hitos.",
  "Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.": "Cuando acepte una propuesta y comience el desarrollo, aquí aparecerá su espacio de proyecto.",
  "Deliverable milestones will appear here once scheduled by your project lead.": "Los hitos aparecerán aquí cuando su responsable de proyecto los programe.",
  "Invoices linked to this project will appear here when issued.": "Las facturas del proyecto aparecerán aquí cuando se emitan.",
  "Sprint progress reports and deployment notices for this project will appear here.": "Aquí aparecerán los informes de sprint y avisos de despliegue del proyecto.",
  "Architecture diagrams, specifications, and release bundles shared by your team will appear here.": "Aquí aparecerán los diagramas de arquitectura, especificaciones y entregas compartidas por su equipo.",
  "Review project proposals, commercial scope, and authorize engagement kickoff.": "Revise las propuestas y el alcance comercial y autorice el inicio del proyecto.",
  "No Billing Records Found": "No hay registros de facturación",
  "No Shared Documents Yet": "Aún no hay documentos compartidos",
  "Accept Offer": "Aceptar oferta",
  "Decline": "Rechazar",
  "Approve": "Aprobar",
  "Request Revision": "Solicitar cambios",
  "Pay with Stripe": "Pagar con Stripe",
  "Dismiss": "Cerrar",
  "No Active Projects Yet": "Aún no hay proyectos activos",
  "No Delivery Updates Yet": "Aún no hay novedades",
  "Review Open Offers": "Revisar ofertas abiertas",
  "View Projects": "Ver proyectos",
  "View Offers": "Ver ofertas",
  "Active Projects": "Proyectos activos",
  "Open Offers": "Ofertas abiertas",
  "Average Progress": "Progreso medio",
  "Balance Due": "Saldo pendiente",
  "Across running projects": "En los proyectos activos",
  "Project Workspaces": "Espacios de proyectos",
  "Current delivery progress and milestone status": "Progreso actual y estado de los hitos",
  "Recent Delivery Updates": "Últimas novedades de entrega",
  "Latest notes from your engineering team": "Últimas notas de su equipo de desarrollo",
  "All Projects →": "Todos los proyectos →",
  "Full Timeline →": "Ver historial completo →",
  "No Projects Assigned Yet": "Aún no hay proyectos asignados",
  "Check Quotes & Offers": "Consultar ofertas",
  "Milestone": "Hito",
  "Due Date": "Fecha de vencimiento",
  "Actions": "Acciones",
  "No Milestones Configured": "Aún no hay hitos configurados",
  "Invoice #": "Número de factura",
  "Description": "Descripción",
  "No Project Invoices": "No hay facturas del proyecto",
  "No Updates Posted": "Aún no hay actualizaciones",
  "Download": "Descargar",
  "No Shared Files": "Aún no hay archivos compartidos",
  "No Offers in This View": "No hay ofertas en esta vista",
  "Open": "Abiertas",
  "Accepted": "Aceptadas",
  "Closed": "Cerradas",
  "Plan / Service": "Plan / servicio",
  "Linked Project": "Proyecto asociado",
  "Cadence": "Frecuencia",
  "Next Billing": "Próxima facturación",
  "Rate": "Tarifa",
  "No Maintenance Contracts": "No hay contratos de mantenimiento",
  "Contract": "Contrato",
  "Payment": "Pago",
  "No Maintenance Invoices": "No hay facturas de mantenimiento",
  "Active Care Plans": "Planes de soporte activos",
  "Monthly Retainer Rate": "Tarifa mensual del retainer",
  "Active monthly commitments": "Servicios mensuales activos",
  "Open Maintenance Invoices": "Facturas de mantenimiento pendientes",
  "Active Maintenance Contracts": "Contratos de mantenimiento activos",
  "Maintenance Invoices": "Facturas de mantenimiento",
  "Company name": "Nombre de la empresa",
  "Contact name": "Persona de contacto",
  "Email": "Correo electrónico",
  "Phone": "Teléfono",
  "Country": "País",
  "Company website": "Sitio web de la empresa",
  "Timezone": "Zona horaria",
  "Address": "Dirección",
  "City / postal code": "Ciudad / código postal",
  "Current password": "Contraseña actual",
  "New password": "Nueva contraseña",
  "Profile": "Perfil",
  "Account": "Cuenta",
  "Sign out": "Cerrar sesión",
  "Back to website": "Volver al sitio web",
  "Projects": "Proyectos",
  "Offers": "Ofertas",
  "Invoices": "Facturas",
  "Updates": "Actualizaciones",
  "Status": "Estado",
  "Amount": "Importe",
  "Due date": "Fecha de vencimiento",
  "No invoices yet.": "Aún no hay facturas.",
  "No updates yet.": "Aún no hay actualizaciones.",
  "No documents yet.": "Aún no hay documentos.",
  "Loading…": "Cargando…",
  "Client Workspace | RSTechwerk": "Área de cliente | RSTechwerk",
  "Techwerk": "Techwerk",
  "Maintenance": "Mantenimiento",
  "Delivery & Files": "Entregas y archivos",
  "Client Account": "Cuenta de cliente",
  "Back to Website": "Volver al sitio web",
  "Sign Out": "Cerrar sesión",
  "Welcome back,": "Le damos la bienvenida,",
  "Client Delivery Workspace": "Espacio de proyectos del cliente",
  "total projects": "proyectos en total",
  "total project": "proyecto en total",
  "proposal on file": "propuesta disponible",
  "proposals on file": "propuestas disponibles",
  "active care plan": "plan de soporte activo",
  "active care plans": "planes de soporte activos",
  "Action Required": "Acción necesaria",
  "Review Offer:": "Revisar oferta:",
  "Offered amount": "Importe ofertado",
  "Awaiting your decision": "Pendiente de su decisión",
  "Approve Deliverable:": "Aprobar entrega:",
  "Submitted for your review": "Enviado para su revisión",
  "Milestone Payment:": "Pago del hito:",
  "Maintenance Invoice": "Factura de mantenimiento",
  "Start": "Inicio",
  "Target Due": "Fecha prevista",
  "complete": "completado",
  "Milestones": "Hitos",
  "Shared Documents": "Documentos compartidos",
  "Created": "Creada",
  "Valid until": "Válida hasta",
  "Account-wide": "Toda la cuenta",
  "Ongoing software maintenance and SLA coverage": "Mantenimiento continuo del software y cobertura SLA",
  "Reference": "Referencia",
  "Item & Project": "Concepto y proyecto",
  "Action": "Acción",
  "All": "Todas",
  "Unpaid": "Pendientes",
  "Due": "Vence",
  "All Projects": "Todos los proyectos",
  "Document Name": "Nombre del documento",
  "Project": "Proyecto",
  "Type": "Tipo",
  "Size": "Tamaño",
  "Shared On": "Compartido el",
  "Try clearing your search filter to inspect all project files.": "Quite el filtro de búsqueda para ver todos los archivos del proyecto.",
  "Contracts, technical specifications, and delivery packages shared with you will appear here.": "Aquí aparecerán contratos, especificaciones técnicas y entregas compartidas.",
  "Saving…": "Guardando…",
  "Updating…": "Actualizando…",
  "Profile saved successfully.": "Perfil guardado correctamente.",
  "Password updated. Use it on your next sign-in.": "Contraseña actualizada. Úsela en su próximo inicio de sesión.",
  "% complete": "% completado",
  "Download failed.": "No se pudo descargar el archivo.",
  "Unable to download file.": "No se pudo descargar el archivo.",
  "Payment checkout URL was not returned.": "No se recibió la URL de pago.",
  "Please sign in to access your client workspace.": "Inicie sesión para acceder al espacio de cliente.",
  "Unable to load portal data.": "No se pudieron cargar los datos del portal.",
  "PayPal maintenance payment confirmed and recorded.": "El pago de mantenimiento con PayPal se confirmó y registró.",
  "PayPal capture is pending verification.": "El pago de PayPal está pendiente de verificación.",
  "Payment completed. Invoice status updates automatically once confirmed.": "Pago completado. La factura se actualizará automáticamente al confirmarse.",
  "Checkout was cancelled. No charge was made.": "Se canceló el pago. No se realizó ningún cargo.",
  "Unknown": "Desconocido",
  "PayPal": "PayPal",
  "Stripe": "Stripe",
  "Your project workspace will appear automatically once you accept an open offer.": "Su espacio de proyecto aparecerá al aceptar una oferta.",
  "Projects assigned to your company account will appear here.": "Aquí aparecerán los proyectos asignados a su empresa."
});
const ORIGINAL_TEXT = new WeakMap();
const ORIGINAL_ATTRIBUTES = new WeakMap();
window.RSTechwerkLanguageCopy = LANGUAGE_COPY;

function applyLanguage(language) {
  const translations = LANGUAGE_COPY[language] || {};
  document.documentElement.lang = ['de', 'es'].includes(language) ? language : 'en';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, node.nodeValue);
    const source = ORIGINAL_TEXT.get(node);
    const original = source.trim();
    if (!original) return;
    node.nodeValue = translateLandingText(source, translations);
  });
  document.querySelectorAll('[placeholder], [aria-label], [title]').forEach((element) => {
    if (!ORIGINAL_ATTRIBUTES.has(element)) ORIGINAL_ATTRIBUTES.set(element, {});
    const originals = ORIGINAL_ATTRIBUTES.get(element);
    for (const attribute of ['placeholder', 'aria-label', 'title']) {
      if (!element.hasAttribute(attribute)) continue;
      if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
      const original = originals[attribute];
      if (translations[original] || (LANGUAGE_COPY.de[original] || LANGUAGE_COPY.es[original])) element.setAttribute(attribute, translateLandingText(original, translations));
    }
  });
}

function translateLandingText(source, translations) {
  const trimmed = source.trim();
  if (translations[trimmed]) return source.replace(trimmed, translations[trimmed]);
  let translated = source;
  const keys = Object.keys(translations).filter((key) => key.length > 2).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (!translated.includes(key)) continue;
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    translated = translated.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu'), translations[key]);
  }
  return translated;
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
  if (!document.getElementById('main-content')) return;
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
  if (savedLanguage !== 'en') applyLanguage(savedLanguage);
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
let localizedPortfolio = [];
const CASE_STUDY_COPY = {
  de: {
    nordiclogix: { industry:'Fracht- und Logistikmanagement', problem:'Europäische Speditionen arbeiten mit fragmentierten Telematiksystemen und papierbasierten Frachtbriefen; Grenzverzögerungen erschweren die Ankunftsprognose.', solution:'Ein gemeinsames Logistik-Dashboard verarbeitet GPS-Daten, erstellt digitale Frachtbriefe und berechnet Routenänderungen.', features:['GPS-Fahrzeugverfolgung mit Geofence-Benachrichtigungen','Digitale e-CMR-Frachtbriefe','Routenoptimierung und Mautkostenschätzung','Portal für Subunternehmer mit Zustellnachweisen'] },
    klinikflow: { industry:'Ambulante Gesundheitsversorgung', problem:'Manuelle Patientenaufnahme und Terminänderungen belasten Praxisteams und führen zu Verzögerungen.', solution:'Eine barrierearme Webanwendung ermöglicht digitale Aufnahmefragebögen, Wartezeitinformationen und verschlüsselten Datenaustausch.', features:['Mobile Patientenaufnahme ohne Installation','Automatische Terminerinnerungen','Rollenbasiertes Praxis-Dashboard','Strukturierter Datenexport'] },
    voltgrid: { industry:'Erneuerbare Energien und Speicher', problem:'Manuelle Steuerung kann mit schwankenden Strompreisen nicht immer Schritt halten.', solution:'Ein Prognosesystem kombiniert Wetterdaten und Zeitreihenmodelle für Lade- und Entladeempfehlungen.', features:['Darstellung europäischer Stromtarife','Empfehlungen zur Reduzierung von Lastspitzen','Wechselrichter-Telemetrie und Warnungen','Berichte über Effizienz und Alterung'] },
    aurapay: { industry:'Fintech und Rechnungsstellung', problem:'Grenzüberschreitend tätige Unternehmen müssen eingehende Überweisungen oft manuell mit Rechnungen abgleichen.', solution:'Eine mobile Wallet informiert über SEPA-Zahlungen und gleicht diese mit offenen Rechnungen ab.', features:['SEPA-Benachrichtigungen mit Kundenzuordnung','Übersicht mehrerer Währungen','PDF-Rechnungen mit EPC-QR-Code','Buchhaltungsexport'] },
    craftbourse: { industry:'B2B-Großhandelsmarktplatz', problem:'Kleine Hersteller und Händler haben Schwierigkeiten bei Kundengewinnung und Großhandelsverhandlungen.', solution:'Eine responsive B2B-Plattform bietet Staffelpreise, Musteranfragen und automatisierte Bestellungen.', features:['Verifizierte Herstellerprofile','Staffelpreise und Mengenrabatte','Musteranfragen und Freigabe','Automatische PDF-Bestellungen'] },
    sensora: { industry:'Präzisionslandwirtschaft', problem:'Auf abgelegenen Feldern verhindern fehlende Netzwerkverbindungen den Einsatz reiner Cloud-Werkzeuge.', solution:'Eine mobile App speichert Sensordaten lokal, analysiert Bilder auf dem Gerät und synchronisiert bei Verbindung.', features:['Offline-Sensordaten mit Synchronisierung','Bildanalyse für Pflanzenzustand','Bodenfeuchte und Bewässerungsempfehlungen','Feldverwaltung mit GPS-Grenzen'] }
  },
  es: {
    nordiclogix: { industry:'Gestión de transporte y logística', problem:'Los transportistas europeos utilizan sistemas telemáticos fragmentados y documentos en papel; los retrasos fronterizos dificultan las previsiones.', solution:'Un panel logístico unificado procesa datos GPS, genera documentos digitales y recalcula rutas.', features:['Seguimiento GPS con alertas de geocercas','Documentos e-CMR digitales','Optimización de rutas y cálculo de peajes','Portal para subcontratistas con comprobantes de entrega'] },
    klinikflow: { industry:'Atención sanitaria ambulatoria', problem:'La admisión manual y los cambios de cita consumen tiempo del personal y pueden causar retrasos.', solution:'Una aplicación web accesible permite completar formularios, consultar esperas e intercambiar información cifrada.', features:['Admisión móvil sin instalación','Recordatorios automáticos de citas','Panel clínico con acceso por roles','Exportación estructurada de datos'] },
    voltgrid: { industry:'Energía renovable y almacenamiento', problem:'La gestión manual no siempre puede seguir las fluctuaciones del precio de la electricidad.', solution:'Un sistema de previsión combina datos meteorológicos y modelos temporales para recomendar ciclos de batería.', features:['Visualización de tarifas eléctricas europeas','Recomendaciones para reducir picos de demanda','Telemetría y alertas de inversores','Informes de eficiencia y degradación'] },
    aurapay: { industry:'Fintech y facturación para pymes', problem:'Las empresas que venden internacionalmente deben conciliar transferencias y facturas pendientes de forma manual.', solution:'Una cartera móvil notifica pagos SEPA y los concilia con facturas pendientes.', features:['Notificaciones SEPA con identificación de clientes','Resumen de saldos multidivisa','Facturas PDF con códigos EPC-QR','Exportación contable'] },
    craftbourse: { industry:'Mercado mayorista B2B', problem:'Los pequeños fabricantes y comercios afrontan dificultades para encontrar clientes y negociar pedidos.', solution:'Una plataforma B2B adaptable ofrece precios escalonados, solicitudes de muestras y pedidos automatizados.', features:['Perfiles de fabricantes verificados','Precios por volumen','Solicitud y aprobación de muestras','Pedidos en PDF automatizados'] },
    sensora: { industry:'Agricultura de precisión', problem:'La falta de conexión en zonas remotas limita las herramientas agrícolas basadas únicamente en la nube.', solution:'Una aplicación móvil guarda datos de sensores, analiza imágenes en el dispositivo y sincroniza al recuperar la conexión.', features:['Captura de sensores sin conexión','Análisis de imágenes de cultivos','Humedad del suelo y recomendaciones de riego','Gestión de parcelas con límites GPS'] }
  }
};

function initCaseStudyModal() {
  const modalBackdrop = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('caseStudyCloseBtn');
  const footerCloseBtn = document.getElementById('caseStudyFooterCloseBtn');
  const openBtns = document.querySelectorAll('[data-case-study]');

  if (!modalBackdrop) return;

  function openCaseStudy(projectId, triggerBtn) {
    lastActiveElement = triggerBtn;
    const project = localizedPortfolio.find((item) => item.key === projectId);
    const fallback = CASE_STUDIES[projectId];
    const language = localStorage.getItem('tecklumo-language') || 'en';
    const translatedFallback = CASE_STUDY_COPY[language]?.[projectId];
    const data = project ? { ...fallback, ...project, techStack: project.tech || fallback?.techStack } : (fallback ? { ...fallback } : null);
    if (!data) return;
    // Only substitute built-in translations when the displayed English still
    // matches the original concept. Custom admin copy must never be replaced.
    if (translatedFallback && fallback) {
      for (const field of ['industry', 'problem', 'solution']) {
        if (data[field] === fallback[field] && translatedFallback[field]) data[field] = translatedFallback[field];
      }
      if (JSON.stringify(data.features) === JSON.stringify(fallback.features)) data.features = translatedFallback.features;
    }

    document.getElementById('csModalTitle').textContent = data.title;
    document.getElementById('csModalBadge').textContent = data.badge;
    document.getElementById('csModalIndustry').textContent = data.industry;
    document.getElementById('csModalProblem').textContent = data.problem;
    document.getElementById('csModalSolution').textContent = data.solution;
    document.getElementById('csModalTech').textContent = data.techStack;

    const featuresList = document.getElementById('csModalFeatures');
    featuresList.innerHTML = '';
    (data.features || []).forEach(feat => {
      const li = document.createElement('li');
      li.className = 'dialog-feature-item';
      li.innerHTML = `<span style="color:var(--color-accent); font-weight:bold;">·</span> <span>${escapeText(feat)}</span>`;
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

let publishedContentRequestId = 0;
async function applyPublishedAdminContent() {
  const requestId = ++publishedContentRequestId;
  const selectedLanguage = localStorage.getItem('tecklumo-language') || 'en';
  try {
    const raw = localStorage.getItem('tecklumo_published_content');
    let published = raw ? JSON.parse(raw) : null;
    try {
      const response = await fetch('/api/content');
      const result = await response.json();
      if (requestId !== publishedContentRequestId) return;
      if (result.success && result.content?.site) {
        published = result.content.site;
        localStorage.setItem('tecklumo_published_content', JSON.stringify(published));
      }
      if (result.success && result.content?.i18n) {
        Object.entries(result.content.i18n).forEach(([language, dictionary]) => {
          if (LANGUAGE_COPY[language] && dictionary && typeof dictionary === 'object') Object.assign(LANGUAGE_COPY[language], dictionary);
        });
        if (selectedLanguage !== 'en') applyLanguage(selectedLanguage);
      }
    } catch (apiError) {
      console.warn('Live content API unavailable; using local published cache.', apiError.message);
    }
    if (requestId !== publishedContentRequestId) return;
    if (!published) return;

    const localized = published.translations?.[selectedLanguage];
    if (selectedLanguage !== 'en') {
      const merge = (base, translated) => {
        if (Array.isArray(base)) return base.map((item, index) => {
          const id = item && typeof item === 'object' && (item.id || item.key);
          return merge(item, id ? translated?.[id] : translated?.[index]);
        });
        if (base && typeof base === 'object') return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, merge(value, translated?.[key])]));
        return typeof translated === 'string' && translated.trim() ? translated : (typeof base === 'string' ? (LANGUAGE_COPY[selectedLanguage]?.[base] || base) : base);
      };
      published = merge(published, localized);
    }

    if (published.settings) {
      const metaTranslations = LANGUAGE_COPY[selectedLanguage] || {};
      const metaTitle = metaTranslations[published.settings.metaTitle] || published.settings.metaTitle;
      const metaDescription = metaTranslations[published.settings.metaDescription] || published.settings.metaDescription;
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
      if (ogTitle && metaTitle) ogTitle.setAttribute('content', metaTranslations[ogTitle.getAttribute('content')] || metaTitle);
      if (ogDescription && metaDescription) ogDescription.setAttribute('content', metaTranslations[ogDescription.getAttribute('content')] || metaDescription);
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
      localizedPortfolio = published.portfolio;
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

document.addEventListener('languagechange', () => { applyPublishedAdminContent(); });

function escapeText(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}



