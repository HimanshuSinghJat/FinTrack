# FinTrack — Personal Finance & Expense Analytics Platform

FinTrack is a full-stack personal finance management web application built using the MERN stack. It allows users to manage income and expenses, set monthly budgets, track financial activity, and visualize spending through interactive charts.

## ✨ Features

- User registration and login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected user dashboard
- Add, edit, and delete transactions
- Manage income and expense records
- Transaction categories
- Monthly budget management
- Budget warning when expenses exceed the limit
- Income, expense, and balance summary
- Search transactions
- Filter transactions by type and category
- Sort transactions by date and amount
- Interactive financial charts
- Responsive design for desktop, tablet, and mobile
- User-specific data isolation

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Recharts
- Lucide React
- CSS

### Backend
- Node.js
- Express.js
- Mongoose
- JWT
- bcryptjs

### Database
- MongoDB
- MongoDB Atlas

## 📂 Project Structure

```text
FinTrack/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   └── transactionController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsCharts.jsx
│   │   │   ├── BudgetModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── TransactionModal.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
