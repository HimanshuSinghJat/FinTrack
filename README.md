# FinTrack — Personal Finance & Expense Analytics Platform

A beginner-friendly, production-style full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) application built for college students to present confidently in web development interviews.

---

## 🌟 Key Features

1. **Landing Page**: Clean presentation with logo, description, feature cards, and quick navigation.
2. **User Authentication**:
   - User Registration & Login
   - Password Hashing using `bcryptjs`
   - Secure JWT Authentication token stored in `localStorage`
   - Protected Dashboard routes
3. **Dashboard & Financial Summary**:
   - Total Income, Total Expenses, and Current Balance calculations
   - Monthly Budget tracking with remaining budget calculation
   - Automatic **Budget Warning Banner** when expenses exceed monthly limit
4. **Transaction Management (CRUD)**:
   - Add, Edit, and Delete Income or Expense transactions
   - Categories: *Food, Transport, Shopping, Bills, Entertainment, Education, Salary, Other*
   - Strict data isolation: Users can only see and manage their own data
5. **Analytics & Charts**:
   - Income vs. Expenses Bar Chart (via Recharts)
   - Category Breakdown Pie Chart
6. **Search, Filter & Sorting**:
   - Live search by transaction description/category
   - Filter by type (*Income/Expense*) or category
   - Sort by date (*Newest/Oldest*) or amount (*Highest/Lowest*)
7. **Responsive UI**:
   - Modern dark theme styling with vanilla CSS
   - Mobile, tablet, and desktop friendly layout

---

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, React Router, Recharts, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`

---

## 📁 Project Structure

```text
Project/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Get Profile
│   │   ├── transactionController.js # CRUD for transactions
│   │   └── budgetController.js      # Get & Set monthly budget
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT protection middleware
│   ├── models/
│   │   ├── User.js          # Mongoose schema for User
│   │   ├── Transaction.js   # Mongoose schema for Transaction
│   │   └── Budget.js        # Mongoose schema for Budget
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── budgetRoutes.js
│   ├── .env                 # Environment variables
│   ├── .env.example
│   ├── server.js            # Express server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, StatCard, Modals, Charts, ProtectedRoute
    │   ├── context/         # AuthContext (JWT & User state)
    │   ├── pages/           # LandingPage, LoginPage, RegisterPage, DashboardPage
    │   ├── services/        # api.js (REST API fetch helper)
    │   ├── App.jsx          # Route definitions
    │   ├── main.jsx         # React root entry point
    │   └── index.css        # Global CSS design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 💻 How to Run the Application

### 1. Prerequisites
- **Node.js** (v18+ installed)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 2. Start the Backend Server
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### 3. Start the Frontend App
Open a new terminal window:
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

---

## 🎓 College Interview Explanation Guide

When explaining this project to an interviewer:

1. **Architecture**:
   *"FinTrack uses a standard MERN stack architecture with a clear separation of concerns. The backend is built with Express.js using the MVC pattern (Models, Controllers, Routes), while the frontend is a React Single-Page Application created with Vite."*

2. **Authentication Flow**:
   *"Authentication is handled via JWT. When a user logs in, the backend verifies credentials using `bcrypt.compare` and signs a JWT containing the user ID. The frontend saves this token in `localStorage` and attaches it as a `Bearer` token in the `Authorization` header for protected API calls."*

3. **Data Security**:
   *"Passwords are hashed with `bcryptjs` before saving to MongoDB, and password fields are explicitly excluded (`select('-password')`) from API responses. Every transaction and budget record is linked to a `userId` field to ensure strict data privacy."*

4. **State Management**:
   *"Rather than adding unnecessary complexity like Redux, I used React Context (`AuthContext`) for global authentication state, and local component state (`useState`, `useMemo`) for filtered transaction lists and analytics."*
