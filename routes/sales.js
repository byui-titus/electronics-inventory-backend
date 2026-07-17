const express = require('express');
const router = express.Router();
const salesController = require ('../controllers/sales.js');

router.post('/sell/:id', salesController.sellProduct);

router.get('/today', salesController.getTodaySales);

router.get('/profit', salesController.getProfitSummary);

router.get('/dashboard', salesController.getDashboard);

router.get('/', salesController.getAllSales);

router.get('/report/:filter', salesController.generateSalesReport);

module.exports = router;