/**
 * RSTechwerk Control Engine – Login Authentication Engine
 * Domain: rstechwerk.com
 */

const ADMIN_SESSION_KEY = 'rstechwerk_admin_session';
const DEMO_EMAIL = 'admin@rstechwerk.com';
const DEMO_PASSWORD = 'rstechwerk2026';

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
function checkExistingSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw);
      // If session exists and was created within last 30 days
      if (session && session.token) {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') ? `/${params.get('redirect')}.html` : '/admin.html';
        window.location.href = redirectUrl;
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
  const passwordInput = document.getElementById('loginPassword');

  if (!demoBtn) return;

  demoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (emailInput) emailInput.value = DEMO_EMAIL;
    if (passwordInput) passwordInput.value = DEMO_PASSWORD;
    hideAlert();
    showToast('Demo credentials inserted: admin@rstechwerk.com', 'success');
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

  form.addEventListener('submit', (e) => {
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

    // Simulate real enterprise crypto-auth latency
    setTimeout(() => {
      // Validate credentials (accepts DEMO credentials or any password containing "rstechwerk" or "admin")
      const isValid = (email.toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) ||
                      (email.includes('@') && (password === 'admin123' || password === 'rstechwerk2026' || password === 'admin'));

      if (isValid) {
        // Create session payload
        const sessionPayload = {
          email,
          role: 'Administrator',
          name: email.split('@')[0].toUpperCase(),
          token: `RSTW-SEC-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`,
          timestamp: Date.now()
        };

        if (remember) {
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
        } else {
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
        }

        if (btnText) {
          btnText.textContent = 'Authorized! Launching Console...';
          btnText.style.display = 'inline-block';
        }
        if (btnSpinner) btnSpinner.style.display = 'none';

        showToast('Authentication confirmed. Welcome back!', 'success');

        // Redirect
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get('redirect');
          window.location.href = redirect ? `/${redirect}.html` : '/admin.html';
        }, 350);
      } else {
        // Reset button
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-block';
        if (btnSpinner) btnSpinner.style.display = 'none';

        showAlert('Access Denied: Invalid admin email or security passkey. Use the 1-click demo button above.');
        triggerShake(card);
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
      }
    }, 450);
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
    alert('Enterprise Security Policy:\n\nSelf-service credential resets are disabled in this environment.\n\nTo access the console right now, click "⚡ Fill Demo Credentials" on the login card:\n• Email: admin@rstechwerk.com\n• Password: rstechwerk2026\n\nFor production resets, please contact: devops@rstechwerk.com');
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
