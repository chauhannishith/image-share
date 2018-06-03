var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var config = require('./database');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
	//local strategy
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		session: true
	},function(username,password, done){
		//check email
		console.log("passportjs "+username+password)
		var query = {username:username};
		User.findOne(query, function(err, user){
			if(err)
				throw err;
			if(!user)
				return done(null,false, {message:'No user found'});

			//match password
			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err)
					throw err;

				if(isMatch){
					return done(null, user);
				}
				else{
					return done(null, false, {message: 'wrong password'});
				}
			});
		});

	}));


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
}