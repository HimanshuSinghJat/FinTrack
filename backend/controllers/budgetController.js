const Budget = require('../models/Budget');

// @desc    Get current user budget for a month/year
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = req.query.month ? Number(req.query.month) : currentDate.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : currentDate.getFullYear();

    const budget = await Budget.findOne({
      userId: req.user._id,
      month,
      year,
    });

    if (!budget) {
      return res.status(200).json({
        userId: req.user._id,
        month,
        year,
        amount: 0,
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error('Error in getBudget:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Set or update monthly budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { amount, month, year } = req.body;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({ message: 'Please provide a valid non-negative budget amount' });
    }

    const currentDate = new Date();
    const budgetMonth = month ? Number(month) : currentDate.getMonth() + 1;
    const budgetYear = year ? Number(year) : currentDate.getFullYear();

    let budget = await Budget.findOne({
      userId: req.user._id,
      month: budgetMonth,
      year: budgetYear,
    });

    if (budget) {
      budget.amount = Number(amount);
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user._id,
        month: budgetMonth,
        year: budgetYear,
        amount: Number(amount),
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error('Error in setBudget:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getBudget,
  setBudget,
};
