const SESSION_KEY = 'rstechwerk_admin_session';

document.addEventListener('DOMContentLoaded', () => {
  initRegisterTheme();
  initPasswordVisibilityToggles();
  initRegisterForm();
});

function initRegisterTheme() {
  const toggleBtn = document.getElementById('registerThemeToggle');
  const icon = document.getElementById('registerThemeIcon');
  const savedTheme = localStorage.getItem('rstechwerk_client_theme') || 'light';

  document.documentElement.setAttribute('data-auth-mode', 'client');
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (icon) icon.textContent = savedTheme === 'dark' ? '☀' : '☾';

  toggleBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rstechwerk_client_theme', next);
    if (icon) icon.textContent = next === 'dark' ? '☀' : '☾';
  });
}

function initPasswordVisibilityToggles() {
  document.querySelectorAll('[data-toggle-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.toggleTarget);
      if (!target) return;
      const isPwd = target.getAttribute('type') === 'password';
      target.setAttribute('type', isPwd ? 'text' : 'password');
      button.innerHTML = isPwd
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  });
}

function showRegisterError(message) {
  const alertEl = document.getElementById('registerAlert');
  const msgEl = document.getElementById('registerMessage');
  const card = document.getElementById('registerCard');
  if (msgEl) msgEl.textContent = message;
  if (alertEl) alertEl.classList.add('show');
  if (card) {
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  }
}

function hideRegisterError() {
  document.getElementById('registerAlert')?.classList.remove('show');
}

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('registerSubmitBtn');
  const btnText = document.getElementById('registerBtnText');
  const btnSpinner = document.getElementById('registerBtnSpinner');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideRegisterError();

    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.companyName?.trim() || !data.contactName?.trim() || !data.email?.trim()) {
      showRegisterError('Please fill in company name, full name, and work email.');
      return;
    }
    if ((data.password || '').length < 10) {
      showRegisterError('Password must be at least 10 characters long.');
      return;
    }
    if (data.password !== data.confirmPassword) {
      showRegisterError('Passwords do not match.');
      return;
    }
    if (!form.querySelector('input[name="terms"]')?.checked) {
      showRegisterError('Please accept the portal terms before continuing.');
      return;
    }

    delete data.confirmPassword;
    delete data.terms;

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok || !result.token) {
        throw new Error(result.message || 'Registration failed.');
      }

      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ ...result.user, token: result.token, timestamp: Date.now() })
      );
      window.location.href = '/portal.html';
    } catch (error) {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline-block';
      if (btnSpinner) btnSpinner.style.display = 'none';
      showRegisterError(error.message || 'Unable to create account right now.');
    }
  });
}
