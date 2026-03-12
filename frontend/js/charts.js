// ============================================================
// Shared Chart Utilities — Chart.js helpers
// ============================================================

const CHART_COLORS = {
  blue: '#3b82f6', green: '#10b981', red: '#ef4444',
  yellow: '#f59e0b', purple: '#8b5cf6', cyan: '#06b6d4',
  orange: '#f97316', pink: '#ec4899',
};

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 }, padding: 16 }
    },
    tooltip: {
      backgroundColor: '#161d2e',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: '#1e2d47',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: ctx => ` Rs. ${Number(ctx.parsed.y||ctx.parsed||0).toLocaleString('en-IN', {minimumFractionDigits:2})}`,
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#4b5563', font: { family: 'Outfit', size: 11 } },
      grid: { color: 'rgba(30,45,71,0.5)' }
    },
    y: {
      ticks: {
        color: '#4b5563', font: { family: 'JetBrains Mono', size: 11 },
        callback: v => 'Rs.' + (v >= 1e6 ? (v/1e6).toFixed(1)+'M' : v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v)
      },
      grid: { color: 'rgba(30,45,71,0.5)' }
    }
  }
};

function makeBarChart(canvasId, labels, datasets, title='') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chart) ctx._chart.destroy();
  const chart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: datasets.map(ds => ({
      ...ds,
      borderRadius: 6,
      borderSkipped: false,
    }))},
    options: {
      ...CHART_DEFAULTS,
      plugins: { ...CHART_DEFAULTS.plugins, title: title ? {display:true,text:title,color:'#f1f5f9',font:{size:13,weight:'bold'}} : {display:false} }
    }
  });
  ctx._chart = chart;
  return chart;
}

function makeLineChart(canvasId, labels, datasets, title='') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chart) ctx._chart.destroy();
  const chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: datasets.map(ds => ({
      ...ds, tension: 0.4, pointRadius: 4, pointHoverRadius: 7, fill: true,
    }))},
    options: { ...CHART_DEFAULTS }
  });
  ctx._chart = chart;
  return chart;
}

function makePieChart(canvasId, labels, data, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chart) ctx._chart.destroy();
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors || Object.values(CHART_COLORS),
        borderColor: '#161d2e',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#94a3b8', font: {family:'Outfit', size:12}, padding: 12 }},
        tooltip: {
          backgroundColor: '#161d2e', titleColor: '#f1f5f9', bodyColor: '#94a3b8',
          borderColor: '#1e2d47', borderWidth: 1, padding: 10,
          callbacks: { label: ctx => ` Rs. ${Number(ctx.parsed||0).toLocaleString('en-IN', {minimumFractionDigits:2})}` }
        }
      },
      cutout: '65%'
    }
  });
  ctx._chart = chart;
  return chart;
}

// Currency formatter
function fmtCurrency(n, symbol='Rs.') {
  const num = parseFloat(n || 0);
  return `${symbol} ${Math.abs(num).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
}

function fmtNum(n) {
  return parseFloat(n || 0).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});
}

// Toast notification
function showToast(msg, type='success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = {success:'✅', error:'❌', warning:'⚠️', info:'ℹ️'};
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(20px)'; toast.style.transition='all 0.3s'; }, 3000);
  setTimeout(() => toast.remove(), 3400);
}

// Auth guard
async function requireAuth() {
  try {
    const res = await fetch('/api/check-auth', {credentials:'include'});
    const data = await res.json();
    if (!data.logged_in) window.location.href = '/login.html';
  } catch {
    window.location.href = '/login.html';
  }
}

// Modal helpers
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Confirm delete
function confirmDelete(msg, onConfirm) {
  if (confirm(msg || 'Are you sure you want to delete this record?')) onConfirm();
}

// Format date for input
function todayDate() {
  return new Date().toISOString().split('T')[0];
}

// Set active nav item
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.page === page) el.classList.add('active');
  });
}

// Logout
async function doLogout() {
  await fetch('/api/logout', {method:'POST', credentials:'include'});
  window.location.href = '/login.html';
}
