const router = require('express').Router();

const paymentCrtl = require('../controllers/paymentsCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.post('/payment',auth,paymentCrtl.createPayment);
router.get('/payment',auth,authAdmin,paymentCrtl.getPayments);

module.exports = router;