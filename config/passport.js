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
	},function(email,password, done){
		//check email
		console.log("passportjs "+email+password)
		var query = {email:email};
		User.findOne(query, function(err, user){
			if(err){
				console.log(err)
				throw err;
			}
			if(!user){
				// console.log("this 1")
				return done(null,false, {message:'No user found'});
			}

			//match password
			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err){
					console.log(err)
					throw err;
				}

				if(isMatch){
					// console.log("this 2")
					return done(null, user);
				}
				else{
					// console.log("this 3")
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