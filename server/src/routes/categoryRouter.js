const router  = require('express').Router();
const categoryCtrl = require('../controllers/categoryCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.put('/category/:id',auth,authAdmin, categoryCtrl.updateCategory)
router.delete('/category/:id',auth,authAdmin,categoryCtrl.deleteCategory);
router.post('/category',auth,authAdmin,categoryCtrl.createCategory);
router.get('/category',categoryCtrl.getCategories);



module.exports = router;


