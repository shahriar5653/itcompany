const ADMIN_SESSION_KEY = 'rstechwerk_admin_session';
const ADMIN_THEME_KEY = 'tecklumo_admin_theme';

const session = JSON.parse(
  localStorage.getItem(ADMIN_SESSION_KEY) ||
    sessionStorage.getItem(ADMIN_SESSION_KEY) ||
    'null'
);

const searchParams = new URLSearchParams(location.search);
const clientId = searchParams.get('id');
const isEmbedded = searchParams.get('embedded') === '1';
const content = document.getElementById('clientEditContent');

if (isEmbedded) {
  document.body.classList.add('is-embedded');
}

function syncTheme() {
  try {
    const savedTheme = localStorage.getItem(ADMIN_THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  } catch {
    // Ignore storage errors
  }
}

syncTheme();
window.addEventListener('storage', (event) => {
  if (event.key === ADMIN_THEME_KEY) {
    syncTheme();
  }
});

const escapeHtml = (value) => {
  const el = document.createElement('div');
  el.textContent = value ?? '';
  return el.innerHTML;
};

function generateTempPassword(length = 14) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const bytes = new Uint8Array(length);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => charset[b % charset.length]).join('');
}

function getStatusTagClass(status) {
  const normalized = String(status || 'active').toLowerCase();
  if (normalized === 'active') return 'success';
  if (normalized === 'suspended') return 'danger';
  return 'warn';
}

async function api(path, options = {}) {
  if (!session?.token) {
    const target = isEmbedded ? '/login.html?redirect=admin' : `/login.html?redirect=admin`;
    location.href = target;
    throw new Error('Admin authentication required.');
  }

  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
      ...(options.headers || {})
    }
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || 'Request failed.');
  }
  return result;
}

function setFeedback(el, message, type = '') {
  if (!el) return;
  el.textContent = message || '';
  el.classList.remove('is-success', 'is-error');
  if (type === 'success') el.classList.add('is-success');
  if (type === 'error') el.classList.add('is-error');
}

async function load() {
  try {
    if (!clientId) {
      throw new Error('Missing client identifier.');
    }

    const result = await api('/api/clients');
    const client = (result.clients || []).find((item) => item.id === clientId);
    if (!client) {
      throw new Error('Client account not found.');
    }

    const totalProjects = Number(client.projectCount || 0);
    const activeProjects = Number(client.activeProjectCount || 0);
    const statusLabel = client.status || 'active';

    content.innerHTML = `
      <div class="client-edit-card">
        <div class="client-edit-section">
          <div class="client-edit-kpi-strip">
            <div class="client-edit-kpi-cell">
              <span class="client-edit-kpi-label">Account Email</span>
              <span class="client-edit-kpi-value" title="${escapeHtml(client.email)}">${escapeHtml(client.email)}</span>
            </div>
            <div class="client-edit-kpi-cell">
              <span class="client-edit-kpi-label">Delivery Scope</span>
              <span class="client-edit-kpi-value ops-tabular">${totalProjects} projects · ${activeProjects} active</span>
            </div>
            <div class="client-edit-kpi-cell">
              <span class="client-edit-kpi-label">Portal Status</span>
              <span class="client-edit-kpi-value">
                <span class="ops-status-tag ${getStatusTagClass(statusLabel)}">${escapeHtml(statusLabel)}</span>
              </span>
            </div>
          </div>

          <h2 class="client-edit-section-title">Company &amp; Contact Information</h2>
          <p class="client-edit-section-sub">Changes reflect immediately in the client's portal workspace and invoice headers.</p>

          <form id="clientEditForm" class="client-edit-form">
            <div class="form-group">
              <label class="form-label" for="editCompanyName">Company Name</label>
              <input id="editCompanyName" class="form-input" name="companyName" required value="${escapeHtml(client.companyName)}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="editContactName">Primary Contact Name</label>
              <input id="editContactName" class="form-input" name="contactName" required value="${escapeHtml(client.contactName)}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="editEmail">Login Email</label>
              <input id="editEmail" class="form-input" disabled value="${escapeHtml(client.email)}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="editPhone">Phone</label>
              <input id="editPhone" class="form-input" name="phone" value="${escapeHtml(client.phone || '')}" placeholder="+49 ..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="editCountry">Country</label>
              <input id="editCountry" class="form-input" name="country" value="${escapeHtml(client.country || '')}" placeholder="Germany" />
            </div>
            <div class="form-group">
              <label class="form-label" for="editStatus">Account Access Status</label>
              <select id="editStatus" class="form-select" name="status">
                <option value="active" ${client.status === 'active' ? 'selected' : ''}>Active (Full Portal Access)</option>
                <option value="suspended" ${client.status === 'suspended' ? 'selected' : ''}>Suspended (Login Blocked)</option>
                <option value="inactive" ${client.status === 'inactive' ? 'selected' : ''}>Inactive (Archived)</option>
              </select>
            </div>
            <div class="full client-edit-actions">
              <button class="btn btn-primary" type="submit">Save Client Profile</button>
              <span id="clientEditMessage" class="client-feedback" role="status"></span>
            </div>
          </form>
        </div>

        <div class="client-edit-section">
          <h2 class="client-edit-section-title">Account Recovery &amp; Temporary Password</h2>
          <p class="client-edit-section-sub">Assign a temporary password (minimum 10 characters). The client can change it anytime from their portal security settings.</p>

          <form id="clientResetPasswordForm">
            <div class="client-recovery-row">
              <div class="form-group client-recovery-field" style="margin-bottom:0;">
                <label class="form-label" for="resetTempPasswordInput">Temporary Password</label>
                <div class="password-field">
                  <input
                    id="resetTempPasswordInput"
                    name="password"
                    type="text"
                    class="form-input ops-tabular"
                    minlength="10"
                    required
                    placeholder="Enter at least 10 characters or generate"
                  />
                  <button type="button" class="password-action" id="generateTempPasswordBtn" style="right:0.75rem;">Generate</button>
                </div>
              </div>
              <button class="btn btn-secondary" id="resetClientPasswordSubmit" type="submit">Reset Password</button>
            </div>
            <div style="margin-top:0.65rem;">
              <span id="passwordMessage" class="client-feedback" role="status"></span>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('clientEditForm')?.addEventListener('submit', saveProfile);
    document.getElementById('clientResetPasswordForm')?.addEventListener('submit', resetPassword);
    document.getElementById('generateTempPasswordBtn')?.addEventListener('click', () => {
      const input = document.getElementById('resetTempPasswordInput');
      if (input) {
        input.value = generateTempPassword();
        input.focus();
      }
    });
  } catch (error) {
    content.innerHTML = `<div class="client-edit-error-box">${escapeHtml(error.message)}</div>`;
  }
}

async function saveProfile(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const message = document.getElementById('clientEditMessage');
  button.disabled = true;
  button.textContent = 'Saving…';
  setFeedback(message, '');

  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    await api(`/api/clients/${encodeURIComponent(clientId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    setFeedback(message, 'Client profile saved successfully.', 'success');

    // Sync KPI portal status pill immediately
    const statusSelect = form.querySelector('select[name="status"]');
    const statusPill = content.querySelector('.client-edit-kpi-cell:last-child .ops-status-tag');
    if (statusSelect && statusPill) {
      const nextStatus = statusSelect.value;
      statusPill.textContent = nextStatus;
      statusPill.className = `ops-status-tag ${getStatusTagClass(nextStatus)}`;
    }
  } catch (error) {
    setFeedback(message, error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Save Client Profile';
  }
}

async function resetPassword(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const passwordInput = document.getElementById('resetTempPasswordInput');
  const submitBtn = document.getElementById('resetClientPasswordSubmit');
  const message = document.getElementById('passwordMessage');
  const password = String(passwordInput?.value || '').trim();

  if (password.length < 10) {
    setFeedback(message, 'Password must be at least 10 characters.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Resetting…';
  setFeedback(message, '');

  try {
    await api(`/api/clients/${encodeURIComponent(clientId)}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    setFeedback(message, 'Temporary password assigned successfully.', 'success');
    form.reset();
  } catch (error) {
    setFeedback(message, error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Reset Password';
  }
}

document.getElementById('clientEditLogout')?.addEventListener('click', () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  location.href = '/login.html?redirect=admin';
});

load();
