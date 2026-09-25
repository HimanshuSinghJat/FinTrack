import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const CATEGORY_COLORS = {
  Food: '#EF4444',
  Transport: '#F59E0B',
  Shopping: '#EC4899',
  Bills: '#8B5CF6',
  Entertainment: '#06B6D4',
  Education: '#3B82F6',
  Salary: '#10B981',
  Other: '#6B7280',
};

const customTooltipStyle = {
  backgroundColor: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  color: 'var(--text-main)',
  boxShadow: 'var(--shadow-md)',
};

const customItemStyle = {
  color: 'var(--text-main)',
};

const customLabelStyle = {
  color: 'var(--text-main)',
  fontWeight: '600',
};

const AnalyticsCharts = ({ transactions }) => {
  // 1. Calculate Total Income vs Total Expense
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const comparisonData = [
    { name: 'Income vs Expenses', Income: totalIncome, Expense: totalExpense },
  ];

  // 2. Group Expenses by Category
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map((cat) => ({
    name: cat,
    value: expenseByCategory[cat],
  }));

  if (transactions.length === 0) {
    return (
      <div className="analytics-grid">
        <div className="card chart-card empty-chart-card">
          <h3>Income vs Expenses</h3>
          <p className="empty-message">No transaction data available yet.</p>
        </div>
        <div className="card chart-card empty-chart-card">
          <h3>Expenses by Category</h3>
          <p className="empty-message">No expense data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-grid">
      {/* Income vs Expenses Bar Chart */}
      <div className="card chart-card">
        <div className="chart-header">
          <h3>Income vs Expenses</h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                contentStyle={customTooltipStyle}
                itemStyle={customItemStyle}
                labelStyle={customLabelStyle}
                formatter={(value) => [`₹${Number(value).toFixed(2)}`, '']}
              />
              <Legend wrapperStyle={{ color: 'var(--text-main)' }} />
              <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category Pie Chart */}
      <div className="card chart-card">
        <div className="chart-header">
          <h3>Expenses by Category</h3>
        </div>
        <div className="chart-container">
          {pieData.length === 0 ? (
            <div className="empty-chart-fallback">
              <p className="empty-message">No expense transactions recorded yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={CATEGORY_COLORS[entry.name] || '#6B7280'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={customTooltipStyle}
                  itemStyle={customItemStyle}
                  labelStyle={customLabelStyle}
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
