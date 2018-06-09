const express = require('express');
const router = express.Router();
const multer = require('multer')
const Project = require('../models/project');
const User = require('../models/user');
const UserSession = require('../models/session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');

var count = 0;

const storage = multer.diskStorage({
	destination: './public/uploads',
	filename: function(req, file, cb){	
		cb(null, file.fieldname+path.extname(file.originalname))
	}
})

const upload = multer({
	storage: storage
}).any()

router.get('/counters', (req, res, next) => {
    count++;
    res.json(count);
});

router.post('/upload', (req, res, next) => {
	upload(req, res, (err) => {
		if(err)
			console.log(err)
		else{
			console.log(req.files)
			res.send('test')
		}
	})
	console.log(req.body)
	res.status(200)
})

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
  				success: true, 
  				sessionID: req.sessionID,
  				session: req.session
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

router.post('/create', (req,res) => {
	var projectTitle = req.body.title;
	var userID = req.body.userID;
	var newProject = new Project({
		title: projectTitle,
		createdby: userID
	})
	newProject.save(function(err){
		if(err){
			console.log("some error");
			return;
		}
		else{
			console.log("success adding project")
			res.send({
				message: "project added successfully",
				success: true
			});
		}
	})
});

router.post('/projects', (req,res) => {
	var userID = req.body.userID;
	// console.log(req.body)
	Project.find({createdby: userID}, (err, projects) => {
		if(err){
			console.log("some error");
			return;
		}
		else{
			console.log("success finding projects")
			res.send({
				message: "project added successfully",
				success: true,
				projects: projects
			});
		}
	})
});

router.get('/logout', (req, res, next) => {
	console.log(req)
	req.logout();
	res.json("successfully logged out");
});

module.exports = router;