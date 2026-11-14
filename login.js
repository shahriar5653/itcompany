/**
 * RSTechwerk Authentication Shell – Client Workspace & Operations Console
 * Domain: rstechwerk.com
 */

const ADMIN_SESSION_KEY = 'rstechwerk_admin_session';
const STAFF_ROLES = new Set(['Administrator', 'admin', 'sub_admin', 'manager', 'developer']);

function isAdminLoginMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect') === 'admin' || window.location.pathname.startsWith('/admin');
}

document.addEventListener('DOMContentLoaded', () => {
  applyAuthContext();
  initTheme();
  checkExistingSession();
  initLoginForm();
  initPasswordToggle();
  initForgotPasswordModal();
});

// 1. Differentiate Admin & Team Console vs Client Workspace
function applyAuthContext() {
  const isAdmin = isAdminLoginMode();
  document.documentElement.setAttribute('data-auth-mode', isAdmin ? 'admin' : 'client');

  const switcher = document.getElementById('clientAuthSwitcher');
  const registerPrompt = document.getElementById('loginRegisterPrompt');
  const badgeText = document.getElementById('loginBadgeText');
  const heading = document.getElementById('loginHeading');
  const subtitle = document.getElementById('loginSubtitle');
  const emailInput = document.getElementById('loginEmail');
  const btnText = document.getElementById('loginBtnText');
  const securityNote = document.getElementById('loginSecurityNote');
  const footerCopy = document.getElementById('loginFooterCopy');

  if (isAdmin) {
    document.title = 'Team & Admin Sign In – RSTechwerk Console | rstechwerk.com';
    if (switcher) switcher.style.display = 'none';
    if (registerPrompt) registerPrompt.style.display = 'none';
    if (badgeText) badgeText.textContent = 'Operations & Engineering Console';
    if (heading) heading.textContent = 'Team & Admin Sign In';
    if (subtitle) subtitle.textContent = 'Sign in with your administrator, sub-admin, or developer account.';
    if (emailInput) emailInput.placeholder = 'team@rstechwerk.com';
    if (btnText) btnText.innerHTML = 'Sign In to Console &rarr;';
    if (securityNote) securityNote.textContent = 'Role-Based Console Access · Staff Only';
    if (footerCopy) footerCopy.textContent = 'RSTechwerk Control Engine © 2026 · Internal Operations';
  } else {
    document.title = 'Client Portal Sign In – RSTechwerk | rstechwerk.com';
    if (switcher) switcher.style.display = 'grid';
    if (registerPrompt) registerPrompt.style.display = 'block';
    if (badgeText) badgeText.textContent = 'Client Workspace';
    if (heading) heading.textContent = 'Sign in to your workspace';
    if (subtitle) subtitle.textContent = 'Access proposals, project milestones, invoices, and shared delivery files.';
    if (emailInput) emailInput.placeholder = 'name@company.com';
    if (btnText) btnText.innerHTML = 'Open Client Portal &rarr;';
    if (securityNote) securityNote.textContent = 'TLS Encrypted · Client Workspace';
    if (footerCopy) footerCopy.textContent = 'RSTechwerk Client Workspace © 2026 · European Product Engineering';
  }
}

// 2. Theme Management
function initTheme() {
  const toggleBtn = document.getElementById('loginThemeToggle');
  const icon = document.getElementById('loginThemeIcon');
  const isAdmin = isAdminLoginMode();
  const storageKey = isAdmin ? 'tecklumo_admin_theme' : 'rstechwerk_client_theme';
  const savedTheme = localStorage.getItem(storageKey) || (isAdmin ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  if (icon) icon.textContent = savedTheme === 'dark' ? '☀' : '☾';

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(storageKey, next);
      if (icon) icon.textContent = next === 'dark' ? '☀' : '☾';
    });
  }
}

// 3. Check if already logged in
async function checkExistingSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      if (session && session.token) {
        const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${session.token}` } });
        if (response.ok) {
          const result = await response.json();
          const role = result.user?.role || session.role;
          if (role === 'client') {
            window.location.href = '/portal.html';
          } else if (STAFF_ROLES.has(role)) {
            window.location.href = '/admin.html';
          }
          return;
        }
        localStorage.removeItem(ADMIN_SESSION_KEY);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
  } catch (e) {
    console.error('Session check failed', e);
  }
}

// 4. Password Show / Hide Toggle
function initPasswordToggle() {
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('loginPassword');
  const eyeIcon = document.getElementById('passwordEyeIcon');

  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    if (eyeIcon) {
      eyeIcon.innerHTML = isPassword
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
    }
  });
}

// 5. Login Form Submission
function initLoginForm() {
  const form = document.getElementById('adminLoginForm');
  const card = document.getElementById('loginCard');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const rememberCheckbox = document.getElementById('rememberMeCheckbox');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.getElementById('loginBtnText');
  const btnSpinner = document.getElementById('loginBtnSpinner');

  if (!form) return;
  const defaultBtnHtml = isAdminLoginMode() ? 'Sign In to Console &rarr;' : 'Open Client Portal &rarr;';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = (emailInput?.value || '').trim();
    const password = passwordInput?.value || '';
    const remember = rememberCheckbox?.checked || false;

    if (!email || !password) {
      showAlert('Please enter both your email address and password.');
      triggerShake(card);
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.message || 'Authentication failed.');
      }

      const sessionPayload = {
        ...result.user,
        token: result.token,
        timestamp: Date.now()
      };
      const storage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem(ADMIN_SESSION_KEY);
      storage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));

      if (btnText) {
        btnText.textContent = result.user.role === 'client' ? 'Opening Client Portal…' : 'Launching Console…';
        btnText.style.display = 'inline-block';
      }
      if (btnSpinner) btnSpinner.style.display = 'none';
      showToast('Authentication confirmed. Welcome back!', 'success');

      setTimeout(() => {
        if (result.user.role === 'client') {
          window.location.href = '/portal.html';
        } else {
          window.location.href = '/admin.html';
        }
      }, 300);
    } catch (error) {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) {
        btnText.innerHTML = defaultBtnHtml;
        btnText.style.display = 'inline-block';
      }
      if (btnSpinner) btnSpinner.style.display = 'none';
      showAlert(error.message || 'Unable to reach the authentication server.');
      triggerShake(card);
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  });
}

function showAlert(message) {
  const alertEl = document.getElementById('loginAlert');
  const alertMsg = document.getElementById('loginAlertMsg');
  if (alertEl && alertMsg) {
    alertMsg.textContent = message;
    alertEl.classList.add('show');
  }
}

function hideAlert() {
  const alertEl = document.getElementById('loginAlert');
  if (alertEl) alertEl.classList.remove('show');
}

function triggerShake(element) {
  if (!element) return;
  element.classList.remove('shake');
  void element.offsetWidth;
  element.classList.add('shake');
}

// 6. Forgot Password Dialog
function initForgotPasswordModal() {
  const forgotBtn = document.getElementById('forgotPasswordBtn');
  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value?.trim();
    if (!email) {
      showAlert('Enter your email address first, then click Forgot password.');
      return;
    }
    fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then((response) => response.json())
      .then((result) => showToast(result.message || 'Check your email for a reset link.', 'success'))
      .catch(() => showAlert('Unable to request a password reset right now.'));
  });
}

// Toast notification utility
function showToast(message, type = 'success') {
  let container = document.getElementById('loginToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'loginToastContainer';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

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
  }, 2800);
}
