import React from 'react';

const StatCard = ({ title, amount, icon: Icon, color, subtitle, actionButton }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div>
          <h3 className="stat-card-title">{title}</h3>
          <p className="stat-card-amount">₹{Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        {Icon && (
          <div className={`stat-card-icon icon-${color}`}>
            <Icon size={24} />
          </div>
        )}
      </div>

      <div className="stat-card-footer">
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        {actionButton && <div className="stat-card-action">{actionButton}</div>}
      </div>
    </div>
  );
};

export default StatCard;
