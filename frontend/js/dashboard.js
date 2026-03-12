requireAuth();

// Update date display
function updateDate() {
  const now = new Date();
  document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {weekday:'short',year:'numeric',month:'short',day:'numeric'});
}
updateDate();

async function loadDashboard() {
  try {
    const res = await fetch('/api/dashboard', {credentials:'include'});
    if (res.status === 401) { window.location.href='/login.html'; return; }
    const d = await res.json();

    document.getElementById('totalIncome').textContent = fmtCurrency(d.total_income);
    document.getElementById('totalExpense').textContent = fmtCurrency(d.total_expense);
    document.getElementById('savings').textContent = fmtCurrency(d.savings);
    document.getElementById('netWorth').textContent = fmtCurrency(d.net_worth);
    document.getElementById('loanGiven').textContent = fmtCurrency(d.loan_given);
    document.getElementById('sharePortfolio').textContent = fmtCurrency(d.share_portfolio_value);

    // Income vs Expense Chart
    const allMonths = [...new Set([...(d.monthly_income||[]).map(r=>r.label), ...(d.monthly_expense||[]).map(r=>r.label)])].reverse().slice(-12);
    const incMap = Object.fromEntries((d.monthly_income||[]).map(r=>[r.label,r.value]));
    const expMap = Object.fromEntries((d.monthly_expense||[]).map(r=>[r.label,r.value]));

    makeBarChart('incomeExpenseChart', allMonths, [
      { label:'Income', data: allMonths.map(m=>incMap[m]||0), backgroundColor:'rgba(16,185,129,0.7)', borderColor:'#10b981', borderWidth:2 },
      { label:'Expense', data: allMonths.map(m=>expMap[m]||0), backgroundColor:'rgba(239,68,68,0.7)', borderColor:'#ef4444', borderWidth:2 },
    ]);

    // Expense pie chart
    const cats = d.expense_by_category || [];
    if (cats.length > 0) {
      makePieChart('expensePieChart', cats.map(c=>c.category), cats.map(c=>c.total));
    }

    // Net worth trend
    const nwData = (d.nw_trend||[]).reverse();
    if (nwData.length > 0) {
      makeLineChart('nwTrendChart',
        nwData.map(r => r.date),
        [{
          label: 'Net Worth',
          data: nwData.map(r => r.value),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.1)',
          borderWidth: 2,
        }]
      );
    }

    // Net worth breakdown
    const nwd = d.net_worth_detail || {};
    const breakdown = [
      ['🏦 Bank Balance', nwd.bank_balance||0],
      ['💵 Cash', nwd.cash||0],
      ['📉 Share Value', nwd.share_value||0],
      ['🏛️ SSF', nwd.ssf||0],
      ['🤝 Loan Given', nwd.loan_given||0],
      ['🏠 Property Value', nwd.property_value||0],
    ];
    const container = document.getElementById('nwBreakdown');
    if (breakdown.some(b=>b[1]>0)) {
      container.innerHTML = breakdown.map(([label, val]) => `
        <div class="nw-row">
          <span class="nw-row-label">${label}</span>
          <span class="nw-row-value">${fmtCurrency(val)}</span>
        </div>
      `).join('') + `
        <div class="nw-row" style="background:rgba(59,130,246,0.1);border-color:var(--accent-blue)">
          <span class="nw-row-label" style="font-weight:700;color:var(--text-primary)">📊 TOTAL NET WORTH</span>
          <span class="nw-row-value" style="color:var(--accent-blue);font-size:16px">${fmtCurrency(d.net_worth)}</span>
        </div>`;
    } else {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><p>Add net worth entries to see breakdown</p></div>';
    }

  } catch(e) {
    showToast('Failed to load dashboard data', 'error');
  }
}

loadDashboard();
