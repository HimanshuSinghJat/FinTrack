import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Salary',
  'Other',
];

const TransactionModal = ({ isOpen, onClose, onSave, transactionToEdit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        type: transactionToEdit.type || 'expense',
        amount: transactionToEdit.amount || '',
        category: transactionToEdit.category || 'Food',
        description: transactionToEdit.description || '',
        date: transactionToEdit.date
          ? new Date(transactionToEdit.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData, transactionToEdit?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Transaction Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'expense' })}
              >
                Expense
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'income' })}
              >
                Income
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              placeholder="e.g. 250.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="e.g. Groceries at D-Mart"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                'Saving...'
              ) : (
                <>
                  {transactionToEdit ? <Save size={18} /> : <PlusCircle size={18} />}
                  <span>{transactionToEdit ? 'Update' : 'Add'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
