const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const controller = require('../controllers/subscriptionController');

// RESTful API endpoints
router.get('/',  controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
