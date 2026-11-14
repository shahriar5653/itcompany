const SESSION_KEY = 'rstechwerk_admin_session';
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget; const message = document.getElementById('registerMessage'); const data = Object.fromEntries(new FormData(form).entries());
  if (data.password !== data.confirmPassword) { message.textContent = 'Passwords do not match.'; return; }
  delete data.confirmPassword; delete data.terms;
  try {
    const response = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    const result = await response.json(); if (!response.ok || !result.token) throw new Error(result.message || 'Registration failed.');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({...result.user, token:result.token, timestamp:Date.now()})); window.location.href = '/portal.html';
  } catch (error) { message.textContent = error.message; }
});
