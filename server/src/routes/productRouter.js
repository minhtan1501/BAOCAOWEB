const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl')
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
router.get('/products', productCtrl.getProducts)
router.get('/products/:id',productCtrl.getProduct)

router.post('/products',auth,authAdmin,productCtrl.createProducts)
router.delete('/products/:id',productCtrl.deleteProducts)
router.put('/products/:id',auth,authAdmin,productCtrl.updateProducts)



module.exports = router