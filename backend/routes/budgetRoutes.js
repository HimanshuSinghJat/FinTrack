const express = require('express');
const router = express.Router();
const { getBudget, setBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All budget routes require authentication

router.route('/')
  .get(getBudget)
  .post(setBudget);

module.exports = router;
