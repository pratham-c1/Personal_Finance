# 💰 Personal Finance Management System

A full-stack personal finance tracker built with **Python Flask + MySQL + HTML/CSS/JS**.

---

## 🚀 Quick Setup

### 1. Database Setup
```sql
-- Open MySQL and run:
source database/schema.sql
```
Or from command line:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure Database
Edit `backend/config.py`:
```python
DB_HOST = 'localhost'
DB_PORT = 3306
DB_USER = 'root'
DB_PASSWORD = 'your_password'   # ← change this
DB_NAME = 'personal_finance'
```

### 3. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Run the Server
```bash
cd backend
python app.py
```

### 5. Open in Browser
```
http://localhost:5000
```

**Default password:** `admin123`

---

## 📁 Project Structure

```
Personal_Finance_Mgmt_Sys/
├── frontend/
│   ├── login.html          # Login page
│   ├── dashboard.html      # Main dashboard with charts
│   ├── income.html         # Income CRUD
│   ├── expense.html        # Expenditure CRUD + charts
│   ├── networth.html       # Net worth tracker
│   ├── loan.html           # Loan records
│   ├── share.html          # NEPSE share portfolio
│   ├── bike.html           # Bike registration + maintenance
│   ├── petrol.html         # Petrol & mileage tracker
│   ├── baby.html           # Baby expenses + gifts
│   ├── reports.html        # Reports + Excel/PDF export
│   ├── settings.html       # Password change + system info
│   ├── css/style.css       # Complete dark UI stylesheet
│   └── js/common.js        # Shared utilities
│
├── backend/
│   ├── app.py              # Flask app entry point
│   ├── config.py           # DB & app config
│   ├── database.py         # MySQL connection pool
│   ├── requirements.txt    # Python dependencies
│   ├── routes/
│   │   ├── auth.py         # Login/logout/change password
│   │   ├── dashboard.py    # Dashboard summary API
│   │   ├── income.py       # Income CRUD API
│   │   ├── expense.py      # Expense CRUD API
│   │   ├── networth.py     # Net worth CRUD API
│   │   ├── loan.py         # Loan CRUD API
│   │   ├── share.py        # Share portfolio CRUD API
│   │   ├── bike.py         # Bike + maintenance CRUD API
│   │   ├── petrol.py       # Petrol CRUD API
│   │   ├── baby.py         # Baby expense/gift CRUD API
│   │   └── reports.py      # Excel + PDF export API
│   └── utils/
│       ├── nepali_date.py  # BS date conversion
│       ├── calculations.py # Financial formulas
│       └── nepse_api.py    # NEPSE stock list
│
└── database/
    └── schema.sql          # Full database schema
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 Auth | Password-protected login |
| 💵 Income | 6 categories with BS date |
| 💳 Expenses | 14 categories, qty × rate calc |
| 📈 Net Worth | 6 component tracker + trend chart |
| 🤝 Loans | Simple interest auto-calculation |
| 📉 Shares | NEPSE stock dropdown, P/L tracking |
| 🏍️ Bike | Registration + maintenance log |
| ⛽ Petrol | Mileage auto-calculation |
| 👶 Baby | Expenses + gift money tracker |
| 📋 Reports | Excel + PDF export |
| 📊 Charts | Chart.js — bar, pie, doughnut, line |
| 🗑️ CRUD | Full Create / Read / Update / Delete |

---

## 🔑 Default Credentials
- **Password:** `admin123`
- Change it from **Settings → Change Password**

