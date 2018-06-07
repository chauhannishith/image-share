const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserSession = require('../models/session');
const bcrypt = require('bcryptjs');
const passport = require('passport');

var count = 0;

router.get('/counters', (req, res, next) => {
    count++;
    res.json(count);
});

router.post('/login', (req, res, next) => {
  	passport.authenticate('local',(err, user, info) => {
  		if(err)
  			return next(err);
  		if(!user)
  			return res.send({
  				message:"no user found ",
  				success: false
  			});
  		req.logIn(user, function(err) {
  			if(err)
  				return next(err);
  			return res.send({
  				message:"successfully logged in ",
  				success: true, user: user
  			});
  		})
  	})(req, res, next);
});

router.post('/signup', (req, res, next) => {
	// console.log(req.body)
	var email = req.body.email.toLowerCase();
	email = email.trim();
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var password = req.body.password;


	var newUser = new User({
		email: email,
		firstname: fname,
		lastname: lname,
		password: password
	});

	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			if(err){
				console.log("user error");
			}
			newUser.password = hash;
			newUser.save(function(err){
				if(err){
					console.log("some error:u"+ uname + ", e:"+ email +", p:" + password);
					return;
				}
				else{
					console.log("success adding user")
					res.send({
						message: "signed up successfully",
						success: true
					});
				}
			});
		});
	});

});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.json("successfully logged out");
});

module.exports = router;