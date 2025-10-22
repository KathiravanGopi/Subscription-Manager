const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const controller = require('../controllers/subscriptionController');

// RESTful API endpoints - all protected
router.get('/', auth, controller.list);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
