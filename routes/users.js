const config =require('../config/database');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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
var jwtSecret = 'supersecretkey';
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
          	userId: req.body.userId
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


router.get('/images/:filename', (req, res, next) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// check file
		if(!file || file.length === 0){
			return res.status(404).send({message:'No file exists', success: false})
		}

		if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
			var readStream = gfs.createReadStream(file.filename)
			readStream.pipe(res)
		}
		else{
			res.status(200).send({message:'no file', success: false})
		}
	});
});

router.get('/counters', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) => {
		if(err){
			console.log(err)
		}
		else{
			count++;
    		res.json(count);
		}
	});
    
});

router.post('/upload', (req, res, next) => {
	// console.log("2",req.body)
	upload(req, res, (err) => {
		// console.log("1",req.body)
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

router.get('/files', (req, res, next) => {
	gfs.files.find().toArray((err, files) => {
		// check files
		if(!files || files.length === 0){
			return res.status(404).send({message:'There are no files', success: false})
		}
		// else{
		// 	files.map((file) =>{
		// 		if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
		// 			file.isImage = true;
		// 		}
		// 		else{
		// 			file.isImage = false;
		// 		}	
		// 	})	
		// 		res.status(200).send({files: files})
		// }
		console.log(files)
		return res.json(files);
	});
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
  			//
  			// return res.send({
  			// 	message:"successfully logged in ",
  			// 	success: true, 
  			// 	sessionID: req.sessionID,
  			// 	session: req.session
  			// });
  			//
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

router.post('/create', verifyToken, (req,res) => {

	//
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send('error')
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

// router.get('/logout', (req, res, next) => {
// 	console.log(req)
// 	req.logout();
// 	res.json("successfully logged out");
// });

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