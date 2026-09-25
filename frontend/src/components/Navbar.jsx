import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Wallet, LogOut, LayoutDashboard, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDark = theme === 'dark';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Wallet size={24} />
          </div>
          <span className="brand-name">FinTrack</span>
        </Link>

        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <div className="user-profile-chip">
                <User size={16} />
                <span>{user.name}</span>
              </div>

              <button
                onClick={toggleTheme}
                className="btn-icon theme-toggle-btn"
                aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                type="button"
              >
                {isDark ? <Sun size={19} className="theme-icon sun" /> : <Moon size={19} className="theme-icon moon" />}
              </button>

              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <button
                onClick={toggleTheme}
                className="btn-icon theme-toggle-btn"
                aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                type="button"
              >
                {isDark ? <Sun size={19} className="theme-icon sun" /> : <Moon size={19} className="theme-icon moon" />}
              </button>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

