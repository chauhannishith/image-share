const config =require('../config/database');
var frontend;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const methodOverride= require('method-override');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const Project = require('../models/project');
const User = require('../models/user');
const ThirdPartyUser = require('../models/thirdpartyuser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
var jwtSecret = 'supersecretkey';
const node_env = process.env.NODE_ENV || 'development';

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL + '/api/users/auth/google/callback'
  },
  (token, tokenSecret, profile, done) => {
  	// console.log("reached here")
      ThirdPartyUser.findOne({ "profile.id": profile.id }, function (err, user) {
  		if(err){
  			console.log(err)
  			return next(err);
  		}
  		if(!user){
  			console.log('No user found')
  			var user = new ThirdPartyUser({
  				profile//googleId: profile.id
  			})
  			user.save(err=> {
  				if(err)
  					console.log(error)
  				return done(err, user)
  			})

  		}
  		else{
  			// console.log(user)
        return done(err, user);
  		}

      });
  }
));

var count = 0;


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
	frontend = process.env.REACT_APP_URL
}
else if(node_env === 'localdev'){
	mongodb_uri = config.localdb;//local
	frontend = 'http://localhost:3000'
}
else{
	mongodb_uri = config.database;//specified mlab
	frontend = 'http://localhost:3000'
}

Grid.mongo = mongoose.mongo;
var conn = mongoose.connection;
var gfs;
conn.once('open', () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('images')
})
// var gfs = Grid(mongoose.connection);
// gfs.collection('images');


const storage = new GridFsStorage({
  url: mongodb_uri,
  file: (req, file) => {
  	// console.log("3",req.body)
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
          	projectId: req.body.projectId,
          	uploadedby: req.authData.user._id,
          	name: req.authData.user.firstname + ' ' + req.authData.user.lastname,
          	subgroup: req.body.subgroup
          }
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({
	storage: storage,
	fileFilter: function(req, file, cb){
		// console.log(req.files,"****************************")
		checkFileType(file, cb);
	}
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

router.post('/upload', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		// console.log(authData)
		req.authData = authData
		upload(req, res, (err) => {
		// console.log("1",req.authData)
			if(err){
				if(err.code === 'LIMIT_FILE_SIZE'){
					console.log("Error: File size too large");
					res.status(404).send({message:"File size too large", success: false})	
				}
				else{
					console.log("error"+err);
					res.status(404).send({message:err, success: false})
				}
			}
			else{
				if(req.files == undefined){
					console.log("undefined")
					res.status(404).send({message:"No files selected", success: false})
				}
				else{
					console.log("files uploaded")	
					// console.log(req.files)
					res.status(200).send({message:"uploaded successfully", success: true})
				}
			}
		})
	})
	// console.log("2",req.body)
	
})

router.get('/files/:id', (req, res, next) => {
	gfs.files.find({"metadata.projectId": req.params.id}).toArray((err, files) => {
		// check files
		if(!files || files.length === 0){
			return res.status(200).send({message:'There are no files', success: false})
		}
		else{
			files.map((file) =>{
				if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
					file.isImage = true;
				}
				else{
					file.isImage = false;
				}	
			})	
				res.status(200).send({files: files, success: true})
		}
		// console.log(files)
		// return res.json(files);
	});
});

router.get('/images/:id', (req, res, next) => {
	 // console.log(req.params.id)
	gfs.files.findOne({ filename: req.params.id }, (err, file) => {
		// check file
		// console.log(file)
		if(!file || file.length === 0){
			return res.status(404).send({message:'No file exists', success: false})
		}

		if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
			var readStream = gfs.createReadStream({filename: file.filename})
			readStream.pipe(res)
			// res.status(200).send('file found')
		}
		else{
			res.status(200).send({message:'no file', success: false})
		}
	});
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
  	'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google'),
  (req, res) => {
  	// console.log(req.user)
  	var tempUser = JSON.parse(JSON.stringify(req.user))
  	var user = {
  		_id: tempUser._id,
  		email: tempUser.profile.emails[0].value,
  		firstname: tempUser.profile.name.givenName,
  		lastname: tempUser.profile.name.familyName
  	}
  	console.log(user)
    	jwt.sign({user: user}, jwtSecret, { expiresIn: '1d' }, (err, token) => {
    		// console.log(token)
    		res.redirect(frontend+'/auth/'+token);
  		})
  	// res.redirect(frontend+'/home')
});

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
  			else{
  				jwt.sign({user: user}, jwtSecret, { expiresIn: '1d' }, (err, token) => {
  					res.status(200).send({message: 'successfully logged in', success: true, token: token})	
  				})
  				
  			}
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

//create new project
router.post('/create', verifyToken, (req,res) => {

	//
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({message: 'Please login again', success: false})
		}
		else{
			var projectTitle = req.body.title;
			var userID = authData.user._id;
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
		}
	});
		//
});

//create new subgroups
router.post('/createsubgroup', verifyToken, (req,res) => {
	//
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({message: 'Please login again', success: false})
		}
		else{
			var group = {
				groupTitle: req.body.title,
				createdby: authData.user._id,
				timestamp: Date.now()
			}
			Project.findOneAndUpdate({_id: req.body.projectId},
				{$push: {subgroups: group}},
				(err, project) => {
					// console.log(project)
					if(err){
						console.log(err)
						res.status(200).send({message: "Failed to create subgroup", success: false})
					}
					else{
						res.status(200).send({message: "group created", success: true})
					}
			})
		}
	});
		//
});

//fetch projects
router.post('/projects', verifyToken, (req,res) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			// console.log(authData)
			var userID = authData.user._id;
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
			//
		}
	});

});

//projects with user by other persons
router.post('/sharedprojects', verifyToken, (req,res) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			// console.log(authData)
			var userID = authData.user._id;
			console.log(userID)
			Project.find({sharedwith: {$elemMatch: {_id: userID}}}, (err, projects) => {
				if(err){
					console.log("some error");
					return;
				}
				else{
					// console.log(projects)
					console.log("success finding projects")
					res.send({
						message: "shared project fetched successfully",
						success: true,
						sharedProjects: projects
					});
				}
			})
			//
		}
	});

});

//share project with other users by their registered email
router.post('/share', verifyToken, (req,res) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			// console.log(authData)
			var email = req.body.email;
			User.findOne({email: email}, (error, user) => {
				// console.log(user)
				if(error){
					console.log(error)
				}
				if(!user){
					// console.log("this 1")
					      ThirdPartyUser.findOne({ "profile.emails[0].value": email }, function (err, tuser) {
					  		if(err){
					  			console.log(err)
					  			// return next(err);
					  		}
					  		if(!tuser){
					  			res.status(200).send({message: "user does not exist", success: false})
					  		}
					  		else{
					  			// console.log(tuser)
								var newuser = {
									userId: tuser._id,
									firstname: tuser.profile.givenName,
									lastname: tuser.profile.name.familyName,
									email: tuser.profile.emails[0]
								}	
								Project.findOneAndUpdate({_id: req.body.projectId},
									{$push: {sharedwith: user}},
									(err, project) => {
										console.log(project)
										if(err){
											console.log(err)
											res.status(200).send({message: "share with user failed", success: false})
										}
										else{
											res.status(200).send({message: "shared with user", success: true})
										}
								})
					  		}
					      });
					// res.status(200).send({message: "user does not exist", success: false})
				}

				var newuser = {
					userId: user._id,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email
				}	
				Project.findOneAndUpdate({_id: req.body.projectId},
					{$push: {sharedwith: user}},
					(err, project) => {
						console.log(project)
						if(err){
							console.log(err)
							res.status(200).send({message: "share with user failed", success: false})
						}
						else{
							res.status(200).send({message: "shared with user", success: true})
						}
				})
			})
		}
	});
});


module.exports = router;

function verifyToken(req, res, next){
	//get header value
	// console.log(req.headers)
	const bearerHeader = req.headers['authorization'];
	//we will pass as bearer token
	if( typeof bearerHeader !== undefined) {
		//splitting space
		var bearer = bearerHeader.split(' ')
		//token
		var bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	}
	else{
		res.status(404).send({redirect: true})
	}
	
}