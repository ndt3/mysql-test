var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET s */
router.get('/insert/user', function(req, res, next) {
  res.send('this first time to check url pattern');
});

module.exports = router;
