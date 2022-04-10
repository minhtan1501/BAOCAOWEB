const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl')

router.get('/products', productCtrl.getProducts)
router.get('/products/:id',productCtrl.getProduct)

router.post('/products',productCtrl.createProducts)
router.delete('/products/:id',productCtrl.deleteProducts)
router.put('/products/:id',productCtrl.updateProducts)



module.exports = router