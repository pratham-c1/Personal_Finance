async function doLogin() {
  const pwd = document.getElementById('password').value;
  const errEl = document.getElementById('loginError');
  if (!pwd) { showError('Please enter your password'); return; }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({password: pwd})
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = '/dashboard.html';
    } else {
      showError(data.message || 'Invalid password');
    }
  } catch(e) {
    showError('Connection error. Is the server running?');
  }
}

function showError(msg) {
  const el = document.getElementById('loginError');
  el.textContent = msg;
  el.style.display = 'block';
}

document.getElementById('password').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});
