var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Weather Underground app, Please navigate to appropriate page to use this service' });

});


module.exports = router;
