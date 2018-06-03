var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var count = 0;


router.get('/counters', (req, res, next) => {
    count++;
    res.json(count);
});

router.post('/login', (req, res, next) => {
	console.log(req.body)
    res.send("logged in successfully");
});

router.post('/signup', (req, res, next) => {
	console.log(req.body)
    res.send("signed up successfully");
});

module.exports = router;