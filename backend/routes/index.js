var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.json({ status: 'ok', service: 'subscription-management-backend' });
});

module.exports = router;
