const PORTAL_SESSION_KEY = 'rstechwerk_admin_session';
const session = JSON.parse(localStorage.getItem(PORTAL_SESSION_KEY) || sessionStorage.getItem(PORTAL_SESSION_KEY) || 'null');
const content = document.getElementById('portalContent');

function escapeHtml(value) { const div = document.createElement('div'); div.textContent = value == null ? '' : String(value); return div.innerHTML; }
function renderDashboard(body) {
  content.innerHTML = `<div class="portal-dashboard"><aside class="portal-sidebar" aria-label="Client account navigation"><button class="active" data-portal-nav="overview">Overview</button><button data-portal-nav="profile">Profile & security</button><button data-portal-nav="orders">Quotes & projects</button><button data-portal-nav="maintenance">Maintenance</button><button data-portal-nav="payments">Payments & invoices</button><button data-portal-nav="updates">Delivery updates</button><button data-portal-nav="documents">Documents</button></aside><div class="portal-main">${body}</div></div>`;
  const main = content.querySelector('.portal-main');
  const profile = main.querySelector('#profileForm')?.closest('.portal-card');
  if (profile) profile.dataset.portalSection = 'profile';
  const cards = [...main.querySelectorAll('.portal-card')];
  cards.filter((card) => !card.dataset.portalSection).forEach((card, index) => {
    const text = card.textContent.toLowerCase();
    card.dataset.portalSection = text.includes('offer') ? 'orders' : text.includes('invoice') || text.includes('pay') ? 'payments' : text.includes('document') || text.includes('shared') ? 'documents' : index % 2 ? 'updates' : 'orders';
  });
  content.querySelectorAll('[data-portal-nav]').forEach((button) => button.addEventListener('click', () => {
    const section = button.dataset.portalNav;
    content.querySelectorAll('[data-portal-nav]').forEach((item) => item.classList.toggle('active', item === button));
    const target = main.querySelector(`[data-portal-section="${section}"]`);
    if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
  }));
  if (window.location.hash === '#profileForm') setTimeout(() => main.querySelector('#profileForm')?.scrollIntoView({ block:'start' }), 50);
}
async function portalFetch(path, options = {}) {
  if (!session?.token) throw new Error('Please sign in to access the client portal.');
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}`, ...(options.headers || {}) } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Unable to load portal data.');
  return result;
}

async function loadPortal() {
  try {
    const [profileResult, result, proposalResult, maintenanceResult, maintenanceInvoiceResult] = await Promise.all([portalFetch('/api/client/profile'), portalFetch('/api/projects'), portalFetch('/api/proposals'), portalFetch('/api/maintenance'), portalFetch('/api/maintenance/invoices')]);
    const profile = profileResult.profile;
    const profileCard = `<article class="portal-card" style="grid-column:1/-1"><span class="portal-status">ACCOUNT PROFILE</span><h2>Company & contact details</h2><form id="profileForm" class="profile-form"><label>Company name<input name="companyName" required value="${escapeHtml(profile.companyName)}"></label><label>Contact name<input name="contactName" required value="${escapeHtml(profile.contactName)}"></label><label>Email<input disabled value="${escapeHtml(profile.email)}"></label><label>Phone<input name="phone" value="${escapeHtml(profile.phone || '')}"></label><label>Country<input name="country" value="${escapeHtml(profile.country || '')}"></label><label>Preferred language<select name="preferredLanguage"><option value="en" ${profile.preferredLanguage === 'en' ? 'selected' : ''}>English</option><option value="de" ${profile.preferredLanguage === 'de' ? 'selected' : ''}>Deutsch</option></select></label><label>Website<input name="website" type="url" value="${escapeHtml(profile.website || '')}" placeholder="https://company.com"></label><label>Timezone<input name="timezone" value="${escapeHtml(profile.timezone || '')}"></label><label>Address<input name="address" value="${escapeHtml(profile.address || '')}"></label><label>City / postal code<input name="city" value="${escapeHtml(profile.city || '')}" placeholder="City, postal code"></label><div class="full"><button class="btn btn-primary" type="submit">Save profile</button><span id="profileMessage" class="portal-muted" style="margin-left:.75rem"></span></div></form><hr style="margin:1.5rem 0;border:0;border-top:1px solid #e2e8f0"><h3>Security</h3><form id="passwordForm" class="profile-form"><label>Current password<input name="currentPassword" type="password" required autocomplete="current-password"></label><label>New password<input name="newPassword" type="password" minlength="10" required autocomplete="new-password"></label><div class="full"><button class="btn btn-secondary" type="submit">Change password</button><span id="passwordMessage" class="portal-muted" style="margin-left:.75rem"></span></div></form></article>`;
    const proposals = proposalResult.proposals || [];
    const maintenance = maintenanceResult.maintenance || [];
    const maintenanceInvoices = maintenanceInvoiceResult.invoices || [];
    const maintenanceRows = maintenance.map((item) => `<div class="portal-row"><span><strong>${escapeHtml(item.title)}</strong><br><small class="portal-muted">${escapeHtml(item.projectName || 'Account service')} · ${escapeHtml(item.description || 'Ongoing software maintenance and support')}</small></span><strong>${escapeHtml(item.currency)} ${Number(item.amount || 0).toFixed(2)}<br><small>${escapeHtml(item.billingType.replaceAll('_', ' '))} · ${escapeHtml(item.status)}</small></strong></div>`).join('') || '<p class="portal-muted">No maintenance services are currently assigned to this account.</p>';
    const maintenanceInvoiceRows = maintenanceInvoices.map((item) => `<div class="portal-row"><span><strong>${escapeHtml(item.invoiceNumber)}</strong><br><small class="portal-muted">${escapeHtml(item.title)} · due ${escapeHtml(item.dueDate || 'not set')}</small></span><span><strong>${escapeHtml(item.currency)} ${Number(item.amount || 0).toFixed(2)}</strong><br><small>${escapeHtml(item.status)}</small>${item.status !== 'paid' ? `<br><button class="btn btn-secondary btn-sm maintenance-pay" data-provider="stripe" data-invoice="${escapeHtml(item.id)}">Stripe</button><button class="btn btn-secondary btn-sm maintenance-pay" data-provider="paypal" data-invoice="${escapeHtml(item.id)}">PayPal</button>` : ''}</span></div>`).join('') || '<p class="portal-muted">No maintenance invoices yet.</p>';
    const maintenanceCard = `<article class="portal-card" data-portal-section="maintenance"><span class="portal-status">MAINTENANCE & RETAINERS</span><h2>Ongoing care for your software</h2><p class="portal-muted">Review the projects and services we maintain for your business, including recurring and one-time charges.</p><div class="portal-list">${maintenanceRows}</div><h3>Maintenance invoices</h3><div class="portal-list">${maintenanceInvoiceRows}</div></article>`;
    const activeProjects = (result.projects || []).filter((project) => !['completed', 'cancelled'].includes(project.status));
    const quoteCount = proposals.filter((proposal) => ['draft', 'sent'].includes(proposal.status)).length;
    const averageProgress = activeProjects.length ? Math.round(activeProjects.reduce((sum, item) => sum + Number(item.progress || 0), 0) / activeProjects.length) : 0;
    const overviewCard = `<article class="portal-card portal-overview-card" data-portal-section="overview"><span class="portal-status">CLIENT WORKSPACE</span><h2>Welcome back, ${escapeHtml(profile.contactName)}</h2><p class="portal-muted">Everything important about your software engagement, in one place.</p><div class="portal-stats"><div class="portal-stat-quotes"><strong>${quoteCount}</strong><span>Open quotes</span></div><div class="portal-stat-projects"><strong>${activeProjects.length}</strong><span>Running projects</span></div><div class="portal-stat-progress"><strong>${averageProgress}%</strong><span>Average progress</span></div></div><div class="portal-overview-note"><strong>Need something from the team?</strong><br><span class="portal-muted">Use your project updates, shared documents, or contact us from the website.</span></div></article>`;
    const proposalCards = proposals.map((proposal) => `<article class="portal-card"><span class="portal-status">OFFER · ${escapeHtml(proposal.status)}</span><h2>${escapeHtml(proposal.title)}</h2><p class="portal-muted">${escapeHtml(proposal.scope)}</p><p><strong>${escapeHtml(proposal.currency)} ${Number(proposal.totalAmount || 0).toFixed(2)}</strong></p>${proposal.status === 'draft' || proposal.status === 'sent' ? `<button class="btn btn-primary proposal-decision" data-id="${escapeHtml(proposal.id)}" data-status="accepted">Accept offer</button><button class="btn btn-secondary proposal-decision" data-id="${escapeHtml(proposal.id)}" data-status="rejected">Reject</button>` : ''}</article>`).join('');
    if (!result.projects?.length) { renderDashboard(`${overviewCard}${maintenanceCard}<div class="portal-grid">${profileCard}${proposalCards ? proposalCards : ''}</div><div class="portal-empty">${proposalCards ? 'Your project workspace will appear here after the offer is accepted and a project is started.' : 'No active projects or offers have been assigned to this account yet.'}</div>`); bindProfile(); return; }
    const cards = await Promise.all(result.projects.map(async (project) => {
      const [milestones, updates, files, invoices] = await Promise.all([
        portalFetch(`/api/projects/${encodeURIComponent(project.id)}/milestones`),
        portalFetch(`/api/projects/${encodeURIComponent(project.id)}/updates`),
        portalFetch(`/api/projects/${encodeURIComponent(project.id)}/files`),
        portalFetch(`/api/projects/${encodeURIComponent(project.id)}/invoices`)
      ]);
      const milestoneRows = (milestones.milestones || []).map((item) => `<div class="portal-row"><span>${escapeHtml(item.title)}<br><small class="portal-muted">${escapeHtml(item.currency)} ${Number(item.amount || 0).toFixed(2)}</small></span><span><strong>${escapeHtml(item.status.replaceAll('_', ' '))}</strong>${item.status !== 'paid' ? `<br><button class="btn btn-secondary btn-sm portal-pay" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(item.id)}" data-provider="stripe">Pay with Stripe</button><button class="btn btn-secondary btn-sm portal-pay" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(item.id)}" data-provider="paypal">PayPal</button>` : ''}${item.status === 'submitted' ? `<br><button class="btn btn-primary btn-sm milestone-decision" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(item.id)}" data-status="approved">Approve</button><button class="btn btn-secondary btn-sm milestone-decision" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(item.id)}" data-status="revision_requested">Request revision</button>` : ''}</span></div>`).join('') || '<p class="portal-muted">Milestones will appear here after your proposal is approved.</p>';
      const updateRows = (updates.updates || []).slice(0, 3).map((item) => `<div class="portal-row"><span><strong>${escapeHtml(item.title)}</strong><br><small class="portal-muted">${escapeHtml(item.body)}</small></span><time class="portal-muted">${new Date(item.createdAt).toLocaleDateString()}</time></div>`).join('') || '<p class="portal-muted">No delivery updates yet.</p>';
      const fileRows = (files.files || []).map((file) => `<div class="portal-row"><span>${escapeHtml(file.originalName)}<br><small class="portal-muted">${Math.ceil(Number(file.fileSize || 0) / 1024)} KB</small></span><a class="btn btn-secondary btn-sm" href="/api/projects/${encodeURIComponent(project.id)}/files/${encodeURIComponent(file.id)}/download" data-download-file>Download</a></div>`).join('') || '<p class="portal-muted">No shared documents yet.</p>';
      const invoiceRows = (invoices.invoices || []).map((invoice) => `<div class="portal-row"><span><strong>${escapeHtml(invoice.invoiceNumber)}</strong><br><small class="portal-muted">${escapeHtml(invoice.description)} · due ${escapeHtml(invoice.dueDate || 'not set')}</small></span><strong>${escapeHtml(invoice.currency)} ${Number(invoice.amount || 0).toFixed(2)}<br><small>${escapeHtml(invoice.status)}</small></strong></div>`).join('') || '<p class="portal-muted">No invoices yet.</p>';
      return `<article class="portal-card"><span class="portal-status">${escapeHtml(project.status)}</span><h2>${escapeHtml(project.name)}</h2><p class="portal-muted">${escapeHtml(project.description || 'Your RSTechwerk project workspace.')}</p><div class="portal-progress" aria-label="${project.progress}% complete"><span style="width:${Math.min(100, Math.max(0, Number(project.progress) || 0))}%"></span></div><strong>${Number(project.progress) || 0}% complete</strong><h3>Milestones</h3><div class="portal-list">${milestoneRows}</div><h3>Invoices</h3><div class="portal-list">${invoiceRows}</div><h3>Latest updates</h3><div class="portal-list">${updateRows}</div><h3>Shared documents</h3><div class="portal-list">${fileRows}</div></article>`;
    }));
    renderDashboard(`${overviewCard}${maintenanceCard}${profileCard}${proposalCards ? `<div class="portal-grid" style="margin-bottom:1.25rem">${proposalCards}</div>` : ''}<div class="portal-grid">${cards.join('')}</div>`);
    bindProfile();
  } catch (error) { content.innerHTML = `<div class="portal-error">${escapeHtml(error.message)}</div>`; }
}

function bindProfile() {
  document.getElementById('profileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries());
    const message = document.getElementById('profileMessage');
    try { await portalFetch('/api/client/profile', { method: 'PATCH', body: JSON.stringify(data) }); message.textContent = 'Saved successfully.'; } catch (error) { message.textContent = error.message; }
  });
  document.getElementById('passwordForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries()); const message = document.getElementById('passwordMessage');
    try { await portalFetch('/api/client/password', { method: 'POST', body: JSON.stringify(data) }); message.textContent = 'Password changed. Sign in again next time.'; form.reset(); } catch (error) { message.textContent = error.message; }
  });
}

document.getElementById('portalLogout')?.addEventListener('click', () => { localStorage.removeItem(PORTAL_SESSION_KEY); sessionStorage.removeItem(PORTAL_SESSION_KEY); window.location.href = '/login.html'; });
document.addEventListener('click', async (event) => {
  const download = event.target.closest('[data-download-file]');
  if (download) {
    event.preventDefault();
    try { const response = await fetch(download.href, { headers: { Authorization: `Bearer ${session.token}` } }); if (!response.ok) throw new Error('Download failed.'); const blobUrl = URL.createObjectURL(await response.blob()); const link = document.createElement('a'); link.href = blobUrl; link.download = ''; link.click(); URL.revokeObjectURL(blobUrl); } catch (error) { alert(error.message); }
    return;
  }
  const milestoneDecision = event.target.closest('.milestone-decision');
  if (milestoneDecision) {
    milestoneDecision.disabled = true;
    try { await portalFetch(`/api/projects/${encodeURIComponent(milestoneDecision.dataset.project)}/milestones/${encodeURIComponent(milestoneDecision.dataset.milestone)}/status`, { method: 'PATCH', body: JSON.stringify({ status: milestoneDecision.dataset.status }) }); await loadPortal(); }
    catch (error) { alert(error.message); milestoneDecision.disabled = false; }
    return;
  }
  const decision = event.target.closest('.proposal-decision');
  if (decision) {
    decision.disabled = true;
    try { await portalFetch(`/api/proposals/${encodeURIComponent(decision.dataset.id)}/status`, { method: 'PATCH', body: JSON.stringify({ status: decision.dataset.status }) }); await loadPortal(); }
    catch (error) { alert(error.message); decision.disabled = false; }
    return;
  }
  const button = event.target.closest('.portal-pay');
  const maintenanceButton = event.target.closest('.maintenance-pay');
  if (maintenanceButton) {
    maintenanceButton.disabled = true;
    try { const result = await portalFetch(`/api/maintenance/invoices/${encodeURIComponent(maintenanceButton.dataset.invoice)}/checkout`, { method:'POST', body:JSON.stringify({ provider:maintenanceButton.dataset.provider }) }); if (result.checkoutUrl || result.approvalUrl) window.location.href = result.checkoutUrl || result.approvalUrl; else throw new Error('Payment checkout URL was not returned.'); } catch (error) { alert(error.message); maintenanceButton.disabled = false; }
    return;
  }
  if (!button) return;
  button.disabled = true;
  try {
    const result = await portalFetch(`/api/projects/${encodeURIComponent(button.dataset.project)}/milestones/${encodeURIComponent(button.dataset.milestone)}/checkout`, { method: 'POST', body: JSON.stringify({ provider: button.dataset.provider }) });
    if (result.checkoutUrl || result.approvalUrl) window.location.href = result.checkoutUrl || result.approvalUrl;
    else throw new Error('Payment checkout URL was not returned.');
  } catch (error) { alert(error.message); button.disabled = false; }
});
loadPortal();
