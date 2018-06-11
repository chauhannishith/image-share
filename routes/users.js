const config =require('../config/database');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const methodOverride= require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const Project = require('../models/project');
const User = require('../models/user');
const Images = require('../models/images');
const UserSession = require('../models/session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const node_env = process.env.NODE_ENV || 'development';

var count = 0;

Grid.mongo = mongoose.mongo;
var gfs = Grid(mongoose.connection);
gfs.collection('images');

//local storage
// const storage = multer.diskStorage({
// 	destination: './public/uploads',
// 	filename: function(req, file, cb){	
// 		cb(null, file.fieldname+path.extname(file.originalname))
// 	}
// })
//for local storage
// const upload = multer({
// 	storage: storage,
// 	limits: {fileSize: 10 * 1024 * 1024}, //1mb 
// 	fileFilter: function(req, file, cb){
// 		// console.log(req.files,"****************************")
// 		checkFileType(file, cb);
// 	}
// }).array('image')

//for db storage
var mongodb_uri;
if(node_env === 'production'){
	mongodb_uri = process.env.MONGODB_URI;//custom mlab uri
}
else if(node_env === 'localdev'){
	mongodb_uri = config.localdb;//local
}
else{
	mongodb_uri = config.database;//specified mlab
}

const storage = new GridFsStorage({
  url: mongodb_uri,
  file: (req, file) => {
  	console.log("3",req.body)
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images',
          metadata: {
          	projectId: req.body.projectId
          }
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({
	storage: storage
}).array('image');

//check file extension
function checkFileType(file, cb){
	//Allowed
	const fileTypes = /jpeg|jpg|gif|png/;
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = fileTypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null, true)
	}
	else{
		cb('Error: images only')
	}
}

router.get('/counters', (req, res, next) => {
    count++;
    res.json(count);
});

router.post('/upload', (req, res, next) => {
	console.log("2",req.body)
	upload(req, res, (err) => {
		console.log("1",req.body)
		if(err){
			if(err.code === 'LIMIT_FILE_SIZE'){
				console.log("Error: File size too large");
				res.status(200).send({message:"File size too large", success: false})	
			}
			else{
				console.log("error"+err);
				res.status(200).send({message:err, success: false})
			}
		}
		else{
			if(req.files == undefined){
				console.log("undefined")
				res.status(200).send({message:"No files selected", success: false})
			}
			else{
				console.log("files uploaded")	
				// console.log(req.files)
				res.status(200).send({message:"uploaded successfully", success: true})
			}
		}
	})
})

router.post('/login', (req, res, next) => {
  	passport.authenticate('local',(err, user, info) => {
  		if(err){
  			console.log(err)
  			return next(err);
  		}
  		if(!user){
  			// console.log('No user found')
  			return res.send({
  				message:"Email and passwords do not match",
  				success: false
  			});
  		}
  		req.logIn(user, function(err) {
  			if(err){
  				return next(err);
  			}
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