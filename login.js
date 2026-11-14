/**
 * RSTechwerk Control Engine – Login Authentication Engine
 * Domain: rstechwerk.com
 */

const ADMIN_SESSION_KEY = 'rstechwerk_admin_session';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  checkExistingSession();
  initLoginForm();
  initPasswordToggle();
  initDemoAutofill();
  initForgotPasswordModal();
});

// 1. Theme Management
function initTheme() {
  const toggleBtn = document.getElementById('loginThemeToggle');
  const icon = document.getElementById('loginThemeIcon');
  const savedTheme = localStorage.getItem('tecklumo_admin_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  if (icon) icon.textContent = savedTheme === 'dark' ? '☀' : '☾';

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tecklumo_admin_theme', next);
      if (icon) icon.textContent = next === 'dark' ? '☀' : '☾';
    });
  }
}

// 2. Check if already logged in
async function checkExistingSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      if (session && session.token) {
        const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${session.token}` } });
        if (response.ok) {
          const params = new URLSearchParams(window.location.search);
          const redirectUrl = params.get('redirect') ? `/${params.get('redirect')}.html` : '/admin.html';
          window.location.href = session.role === 'client' ? '/portal.html' : redirectUrl;
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

// 3. Password Show / Hide Toggle
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

// 4. Quick Demo Fill
function initDemoAutofill() {
  const demoBtn = document.getElementById('fillDemoBtn');
  const emailInput = document.getElementById('loginEmail');

  if (!demoBtn) return;

  demoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (emailInput) emailInput.focus();
    hideAlert();
    showToast('Enter the administrator credentials configured on the backend.', 'success');
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = (emailInput?.value || '').trim();
    const password = passwordInput?.value || '';
    const remember = rememberCheckbox?.checked || false;

    if (!email || !password) {
      showAlert('Please enter both your admin email and password.');
      triggerShake(card);
      return;
    }

    // Set Loading State
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
      storage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
      if (btnText) {
        btnText.textContent = 'Authorized! Launching Console...';
        btnText.style.display = 'inline-block';
      }
      if (btnSpinner) btnSpinner.style.display = 'none';
      showToast('Authentication confirmed. Welcome back!', 'success');
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        window.location.href = result.user.role === 'client' ? '/portal.html' : (redirect ? `/${redirect}.html` : '/admin.html');
      }, 350);
    } catch (error) {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline-block';
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
  void element.offsetWidth; // trigger reflow
  element.classList.add('shake');
}

// 6. Forgot Password Dialog
function initForgotPasswordModal() {
  const forgotBtn = document.getElementById('forgotPasswordBtn');
  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value?.trim();
    if (!email) { showAlert('Enter your email first, then click Forgot Passkey again.'); return; }
    fetch('/api/auth/forgot-password', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) }).then((response) => response.json()).then((result) => showToast(result.message || 'Check your email for a reset link.', 'success')).catch(() => showAlert('Unable to request a password reset right now.'));
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
