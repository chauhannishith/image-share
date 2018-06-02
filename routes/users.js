var express = require('express');
var router = express.Router();
var User = require('../models/user');
var count = 0;


router.get('/counters', (req, res, next) => {
    count++;
    res.json(count);
});

module.exports = router;