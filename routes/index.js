var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/bar', function(req, res, next) {
  res.render('bar');
});

module.exports = router;
