import React, { useState, useEffect } from 'react';
import { X, Target, Save } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, onSave, currentBudget }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentBudget) {
      setAmount(currentBudget.amount || '');
    } else {
      setAmount('');
    }
    setError('');
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (amount === '' || Number(amount) < 0) {
      setError('Please enter a valid non-negative budget amount');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(Number(amount));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update budget');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Target size={20} className="text-primary" />
            <h2>Set Monthly Budget</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-description">
            Set your target spending limit for the current month. FinTrack will alert you if your expenses exceed this limit.
          </p>

          <div className="form-group">
            <label htmlFor="budget-amount">Monthly Budget Amount (₹)</label>
            <input
              type="number"
              id="budget-amount"
              step="0.01"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
                  <Save size={18} />
                  <span>Set Budget</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
