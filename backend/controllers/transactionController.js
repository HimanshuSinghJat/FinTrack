const Transaction = require('../models/Transaction');

// @desc    Get user transactions with optional search/filter
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, category, search, sortBy } = req.query;

    // Filter object strictly bound to the authenticated user
    const filter = { userId: req.user._id };

    // Optional Type filter
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    // Optional Category filter
    if (category) {
      filter.category = category;
    }

    // Optional Search in description
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    // Sorting logic (default to newest date first)
    let sortOption = { date: -1, createdAt: -1 };
    if (sortBy === 'date-asc') {
      sortOption = { date: 1, createdAt: 1 };
    } else if (sortBy === 'amount-desc') {
      sortOption = { amount: -1 };
    } else if (sortBy === 'amount-asc') {
      sortOption = { amount: 1 };
    }

    const transactions = await Transaction.find(filter).sort(sortOption);

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    // Basic Validation
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Please provide type, amount, and category' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: numAmount,
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error in addTransaction:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure transaction belongs to authenticated user
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }

    const { type, amount, category, description, date } = req.body;

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
      transaction.amount = numAmount;
    }

    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (description !== undefined) transaction.description = description;
    if (date) transaction.date = new Date(date);

    const updatedTransaction = await transaction.save();

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure transaction belongs to authenticated user
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Transaction removed' });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
