(() => {
  const article = document.querySelector('[data-legal-document]');
  if (!article) return;

  const key = article.dataset.legalDocument;
  const templates = window.RSTECHWERK_LEGAL_TEMPLATES || {};
  const supported = ['en', 'de', 'es'];
  const backNode = article.querySelector('.legal-back');
  const toolbar = document.createElement('div');
  const languageSelect = document.createElement('select');
  toolbar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem;';
  languageSelect.setAttribute('aria-label', 'Select language');
  languageSelect.style.cssText = 'font:inherit;color:#0f172a;background:#fff;border:1px solid #cbd5e1;border-radius:.65rem;padding:.55rem .75rem;';
  [['en', 'English'], ['de', 'Deutsch'], ['es', 'Español']].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    languageSelect.append(option);
  });
  if (backNode) toolbar.append(backNode);
  toolbar.append(languageSelect);
  article.insertBefore(toolbar, article.firstChild);
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || ''];

  function detectLanguage() {
    const query = new URLSearchParams(window.location.search).get('lang');
    if (supported.includes(query)) return query;
    try {
      const saved = localStorage.getItem('tecklumo-language');
      if (supported.includes(saved)) return saved;
    } catch {}
    const browserLanguage = browserLanguages.map((locale) => locale.split('-')[0].toLowerCase()).find((lang) => supported.includes(lang));
    if (browserLanguage) return browserLanguage;
    const regions = browserLanguages.map((locale) => {
      try { return new Intl.Locale(locale).region || ''; }
      catch { return ''; }
    });
    if (regions.some((region) => ['DE', 'AT', 'CH', 'LI', 'LU'].includes(region))) return 'de';
    if (regions.some((region) => ['ES', 'MX', 'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'GT', 'HN', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE'].includes(region))) return 'es';
    return 'en';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  const language = detectLanguage();
  document.documentElement.lang = language;
  const titleNode = document.getElementById('legalPageTitle');
  const contentNode = document.getElementById('legalPageContent');
  const warningNode = document.getElementById('legalDraftWarning');
  const updatedNode = document.getElementById('legalPageUpdated');
  const kickerNode = article.querySelector('.section-kicker');
  const languageLabels = {
    en: { kicker: 'LEGAL INFORMATION', back: 'Back to RSTechwerk' },
    de: { kicker: 'RECHTLICHE INFORMATIONEN', back: 'Zurück zu RSTechwerk' },
    es: { kicker: 'INFORMACIÓN LEGAL', back: 'Volver a RSTechwerk' }
  };
  const defaultCopy = templates[key]?.[language] || templates[key]?.en || { title: 'Legal information', body: '', reviewed: false };

  function render(documentCopy, fromDatabase = false) {
    const copy = documentCopy && typeof documentCopy === 'object' ? { ...defaultCopy, ...documentCopy } : defaultCopy;
    titleNode.textContent = copy.title || defaultCopy.title;
    document.title = `${copy.title || defaultCopy.title} | RSTechwerk`;
    if (kickerNode) kickerNode.textContent = languageLabels[language].kicker;
    if (backNode) backNode.textContent = `← ${languageLabels[language].back}`;
    languageSelect.value = language;
    const paragraphs = String(copy.body || defaultCopy.body).split(/\n\s*\n/).filter(Boolean);
    contentNode.innerHTML = paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`).join('');
    const containsPlaceholders = /\[[^\]]+\]/.test(String(copy.body || ''));
    const mustWarn = !copy.reviewed || containsPlaceholders;
    warningNode.hidden = !mustWarn;
    warningNode.textContent = language === 'de'
      ? 'ENTWURF: Diese Angaben sind noch nicht als geprüft markiert oder enthalten Platzhalter. Bitte nicht als verbindliche Rechtsinformation verwenden.'
      : language === 'es'
        ? 'BORRADOR: El texto no está marcado como revisado o aún contiene campos pendientes. No lo use como información jurídica definitiva.'
        : 'DRAFT: This document is not marked reviewed or still contains placeholders. Do not rely on it as final legal information.';
    updatedNode.textContent = fromDatabase
      ? (language === 'de' ? 'Zuletzt aus dem veröffentlichten Inhalt geladen.' : language === 'es' ? 'Cargado desde el contenido publicado.' : 'Loaded from published site content.')
      : '';
  }

  render(defaultCopy);
  languageSelect.addEventListener('change', () => {
    try { localStorage.setItem('tecklumo-language', languageSelect.value); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set('lang', languageSelect.value);
    window.location.assign(url.toString());
  });
  fetch('/api/content')
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Content API unavailable')))
    .then((result) => {
      const liveDocument = result.content?.site?.settings?.legalDocuments?.[key]?.[language];
      if (liveDocument) render(liveDocument, true);
    })
    .catch(() => {});
})();
