const router = require('express').Router();

router.use('/', require('./swagger.js'));

const productRoutes = require('./product.js');
router.use('/products', productRoutes);

const saleRoutes = require('./sales.js');
router.use('/sales', saleRoutes);

router.get('/', (req, res) => {
    
    res.send('hello there');
});

//router.use('/products', require ('./product.js'));
//router.use('/sales', require ('./sales.js'));

module.exports = router;