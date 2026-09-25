import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Wallet, PieChart, ShieldCheck, Target, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-layout">
      <Navbar />

      <main className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Personal Finance & Expense Analytics Platform
          </div>

          <h1 className="hero-title">
            Take Full Control of Your <span className="gradient-text">Personal Finances</span>
          </h1>

          <p className="hero-description">
            FinTrack is a simple, modern, and beginner-friendly web platform that helps you track daily income, manage monthly budgets, and analyze spending habits effortlessly.
          </p>

          <div className="hero-cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Get Started Free</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              <span>Login to Account</span>
            </Link>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Everything You Need for Smart Money Management</h2>
            <p>Built with simplicity and clarity in mind.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-income">
                <Wallet size={28} />
              </div>
              <h3>Income & Expense Tracking</h3>
              <p>Easily log incomes and expenses with categories, descriptions, and custom dates.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-budget">
                <Target size={28} />
              </div>
              <h3>Monthly Budget Alerts</h3>
              <p>Set a spending budget for the month and get real-time warnings when you spend too much.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-analytics">
                <PieChart size={28} />
              </div>
              <h3>Visual Analytics</h3>
              <p>Understand where your money goes with clear category breakdowns and income vs expense charts.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-secure">
                <ShieldCheck size={28} />
              </div>
              <h3>Secure JWT Authentication</h3>
              <p>Your financial data is encrypted and protected with password hashing and JWT token security.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 FinTrack — Built for College Portfolio & Full-Stack MERN Demonstration</p>
      </footer>
    </div>
  );
};

export default LandingPage;
