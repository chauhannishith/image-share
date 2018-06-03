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
	var email = req.body.email;
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var password = req.body.password;


	var newUser = new User({
		email: email,
		firstname: fname,
		lastname: lname,
		password: password
	});

	newUser.save(function(err){
		if(err){
			console.log("some error:u"+ fname + ", e:"+ email +", p:" + password);
			return;
		}
		else{
			console.log("success")
		}
	});

    res.send("signed up successfully");
});

module.exports = router;