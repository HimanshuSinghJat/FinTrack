import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TransactionModal from '../components/TransactionModal';
import BudgetModal from '../components/BudgetModal';
import AnalyticsCharts from '../components/AnalyticsCharts';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchBudget,
  saveBudget,
} from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Salary',
  'Other',
];

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({ amount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter local states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Fetch initial dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [txData, budgetData] = await Promise.all([
        fetchTransactions(),
        fetchBudget(),
      ]);
      setTransactions(txData);
      setBudget(budgetData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute stats
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const currentBalance = totalIncome - totalExpense;
  const budgetAmount = budget?.amount || 0;
  const remainingBudget = budgetAmount - totalExpense;
  const isOverBudget = budgetAmount > 0 && totalExpense > budgetAmount;

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesCategory =
          categoryFilter === 'All' || t.category === categoryFilter;
        const matchesSearch =
          !search ||
          (t.description &&
            t.description.toLowerCase().includes(search.toLowerCase())) ||
          (t.category &&
            t.category.toLowerCase().includes(search.toLowerCase()));
        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, typeFilter, categoryFilter, search, sortBy]);

  // Transaction Actions
  const handleOpenAddModal = () => {
    setTransactionToEdit(null);
    setIsTransactionModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setTransactionToEdit(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = async (formData, id) => {
    if (id) {
      const updated = await updateTransaction(id, formData);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } else {
      const created = await createTransaction(formData);
      setTransactions((prev) => [created, ...prev]);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete transaction');
      }
    }
  };

  // Budget Actions
  const handleSaveBudget = async (newAmount) => {
    const currentDate = new Date();
    const updatedBudget = await saveBudget({
      amount: newAmount,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    });
    setBudget(updatedBudget);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-container">
        {/* Top Header & Quick Actions */}
        <div className="dashboard-header">
          <div>
            <h1>Financial Dashboard</h1>
            <p>Overview of your incomes, expenses, and budget progress</p>
          </div>
          <div className="dashboard-header-actions">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="btn btn-outline"
            >
              <Target size={18} />
              <span>Set Budget</span>
            </button>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button onClick={loadDashboardData} className="btn btn-sm btn-outline">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Budget Exceeded Warning Banner */}
        {isOverBudget && (
          <div className="alert alert-warning overbudget-banner">
            <div className="alert-content">
              <AlertTriangle size={22} className="alert-icon" />
              <div>
                <strong>Budget Warning!</strong> You have spent ₹
                {totalExpense.toFixed(2)}, which exceeds your monthly budget of ₹
                {budgetAmount.toFixed(2)} by ₹
                {Math.abs(remainingBudget).toFixed(2)}.
              </div>
            </div>
          </div>
        )}

        {/* Summary Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            color="success"
            subtitle="Total earnings recorded"
          />
          <StatCard
            title="Total Expenses"
            amount={totalExpense}
            icon={TrendingDown}
            color="danger"
            subtitle="Total spending recorded"
          />
          <StatCard
            title="Current Balance"
            amount={currentBalance}
            icon={Wallet}
            color={currentBalance >= 0 ? 'primary' : 'danger'}
            subtitle="Net savings available"
          />
          <StatCard
            title="Monthly Budget"
            amount={budgetAmount}
            icon={Target}
            color={budgetAmount > 0 ? 'info' : 'warning'}
            subtitle={
              budgetAmount > 0
                ? `Remaining: ₹${remainingBudget.toFixed(2)}`
                : 'No budget set for this month'
            }
            actionButton={
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="btn-text"
              >
                {budgetAmount > 0 ? 'Edit' : 'Set Now'}
              </button>
            }
          />
        </div>

        {/* Analytics Section */}
        <AnalyticsCharts transactions={transactions} />

        {/* Transaction Management Section */}
        <section className="transactions-section card">
          <div className="section-header-flex">
            <h2>Recent Transactions</h2>
            <span className="badge-pill">
              {filteredTransactions.length} of {transactions.length} items
            </span>
          </div>

          {/* Search & Filter Control Bar */}
          <div className="filter-bar">
            {/* Search Input */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by description or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <Filter size={16} className="filter-icon" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="filter-group">
              <ArrowUpDown size={16} className="filter-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Transactions Data Table */}
          {loading ? (
            <div className="table-loading">
              <div className="spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No transactions found</p>
              <p className="empty-desc">
                {transactions.length === 0
                  ? 'Start by adding your first income or expense transaction above.'
                  : 'Try adjusting your search query or filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>
                        <span
                          className={`type-badge ${
                            tx.type === 'income'
                              ? 'badge-income'
                              : 'badge-expense'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <span className="category-tag">{tx.category}</span>
                      </td>
                      <td>{tx.description || '-'}</td>
                      <td>
                        {new Date(tx.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td
                        className={`text-right amount-cell ${
                          tx.type === 'income' ? 'text-income' : 'text-expense'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}₹
                        {Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="text-center">
                        <div className="action-buttons">
                          <button
                            onClick={() => handleOpenEditModal(tx)}
                            className="btn-icon btn-icon-edit"
                            title="Edit Transaction"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(tx._id)}
                            className="btn-icon btn-icon-delete"
                            title="Delete Transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Transaction Add/Edit Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
      />

      {/* Set Monthly Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudget={budget}
      />
    </div>
  );
};

export default DashboardPage;
