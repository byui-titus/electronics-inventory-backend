const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search route must stay on top
router.get('/search', productController.searchProducts);

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
