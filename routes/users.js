const bcrypt = require('bcryptjs');
const config =require('../config/database');
const crypto = require('crypto');
const express = require('express');
var frontend;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const jwt = require('jsonwebtoken');
var jwtSecret = 'supersecretkey';
const multer = require('multer');
const mongoose = require('mongoose');
const node_env = process.env.NODE_ENV || 'development';
const passport = require('passport');
const path = require('path');
const Project = require('../models/project');
const router = express.Router();
const Tag = require('../models/tag')
const ThirdPartyUser = require('../models/thirdpartyuser');
const User = require('../models/user');

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
  			// var tempUser = JSON.parse(JSON.stringify(profile))
  			var user = new ThirdPartyUser({
  				profile
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


//local storage of images
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
		if(err){
			console.log(err)
			res.status(200).send({message: 'Please login again', success: false})
		}else{
			// console.log(authData)
			req.authData = authData
			upload(req, res, (err) => {
			// console.log("1",req.authData)
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
		}
	})
	// console.log("2",req.body)
	
})

router.get('/fetchtags', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({message: 'Please login again', success: false})
		}
		else{
			Tag.findOne({userId: authData.user._id}, (err, usertags) => {
			if(err){
				console.log(err)
				res.status(200).send({message: 'error occured', success: false, error: err})
			}
			// console.log(usertags)
			res.status(200).send({message: 'sending tags', success: true, tags: usertags})
			})
		}
	});
	//
});

//add tag
router.post('/addtag', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			// res.status(200).send({message: 'Please login again', success: false})
		}
		else{
			//find if user exists in tag collection, if not then add user
			if(!req.body.tagname || !req.body.filename){
				res.status(200).send({message: "Failed to add tag", success: false})
				return next();
			}
			Tag.findOne({userId: authData.user._id},				
				(err, tag) => {
					// console.log(project)
					if(err){
						console.log(err)
						res.status(200).send({message: "Failed to add tag", success: false})
					}
					if(!tag){
						console.log('no tag')
						var newTag = new Tag({
							userId: authData.user._id,
							tag: [{
								tagname: req.body.tagname,
								images: [req.body.filename]
							}]
						})

						newTag.save(err => {
							if(err){
								console.log("error adding new tag")
								res.status(404).send({message: 'error occured', success: false, error: err})
							}
							// else{
							// 	res.status(200).send({message: "tag added", success: true})
							// }
						})
					}
					else{
						//user exists, push new filename
						Tag.findOneAndUpdate({_id: tag._id, "tag.tagname": req.body.tagname },
							{$push: {"tag.$.images": req.body.filename}},
							(err, tagg) => {
								// console.log(project)
								if(err){
									console.log(err)
									res.status(200).send({message: "Failed to add to existing subgroup", success: false})
								}
								if(!tagg){
									console.log('tag not with user')
									var newTag = {
										tagname: req.body.tagname,
										images: [req.body.filename]
									}
									Tag.findOneAndUpdate({_id: tag._id},
										{$push: {tag: newTag}},
										(err, addedtag) => {
											if(err){
												console.log(err)
												res.status(200).send({message: 'error occured', success: false, error: err})
											}
											if(!addedtag){
												console.log("please try again")
												res.status(200).send({success: false, message:'please check'})
											}
											// else{
											// 	res.status(200).send({message: "new tag and image added", success: true})		
											// }
										})
								}
						})
					}
			})
			//update file metadata
	    	//
	    	gfs.files.findOne({ filename: req.body.filename, "metadata.tags": req.body.tagname }, (err, file) => {
				// check files
				if(file){
					// console.log('tag exists')
					return res.status(200).send({message:'yes', success: true})
				}
				else{
						gfs.files.findOneAndUpdate(
					      { filename: req.body.filename },
					      { $push: {"metadata.tags": req.body.tagname} },
					      (err, update) => {
					      	if(err){
					      		console.log(err)
					      		res.status(200).send({message: 'error occured', success: false, error: err})
					      	}
					      	else{
					      		// console.log('tag added')
					      		res.status(200).send({message: 'success adding tag to image', success: true})
					      	}
					      } 
				    	)
				}
			});
	    	//
		}
	});
});


//fetch all files in project by id
router.get('/files/:id', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			// res.status(200).send({message: 'Please login again', success: false})
		}
		else{	
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
			});
		}
	})
});

//delete file
router.post('/files', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
		}
		else{
			if(!req.body.imageId || !req.body.filename){
				res.status(200).send({message: "Failed to delete image", success: false})
			}
			Tag.update( {/*userId: authData.user._id*/}, { $pull: {tag: {"images": req.body.filename }} },{multi: true},(err, affected) => {
				if(err){
					console.log(err)
					res.status(200).send({message: 'ERROR', success: false})	
				}
				else{
					// console.log(affected)
					gfs.remove({_id: req.body.imageId, root: 'images'}, (err, gridStore) => {
						if(err){
							console.log(err)
							res.status(404).send({message:error, success: false})
						}
						else{
							res.status(200).send({message: 'File successfully deleted', success: true})	
						}
					})					
				}
			})				
		}
	});
	
});

//fetch all files by tag
router.get('/tagfiles/:id', (req, res, next) => {
	gfs.files.findOne({filename: req.params.id}, (err, file) => {
		// check files
		if(!file || file.length === 0){
			return res.status(200).send({message:'File does not exist or has been deleted', success: false})
		}

		if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
			file.isImage = true;
		}
		else{
			file.isImage = false;
		}	
		res.status(200).send({file: file, success: true})
	});
});

//fetch image
router.get('/images/:id', (req, res, next) => {
	 // console.log(req.params.id)
	gfs.files.findOne({ filename: req.params.id }, (err, file) => {
		// check file
		// console.log(file)
		if(!file || file.length === 0){
			return res.status(200).send({message:'No file exists', success: false})
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
  	// console.log(user)
    	jwt.sign({user: user}, jwtSecret, { expiresIn: '1d' }, (err, token) => {
    		// console.log(token)
    		if(err){
    			console.log(err)
    			res.status(200).send({message: 'Error occured', success: false, error: err})
    		}
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
  			return res.status(200).send({
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
  					res.status(200).send({message: 'Successfully logged in', success: true, token: token})	
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
				res.status(200).send({message: 'Error occured', success: false, error: err})
			}
			newUser.password = hash;
			newUser.save(function(err){
				if(err){
					console.log("Some error:"+ fname + ", e:"+ email +", p:" + password);
					return;
				}
				else{
					console.log("success adding user")
					res.status(200).send({
						message: "Signed up successfully",
						success: true
					});
				}
			});
		});
	});

});

//create new project
router.post('/create', verifyToken, (req, res) => {
	//
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({message: 'Please login again', success: false})
		}
		else{
			if(!req.body.title){
				res.status(200).send({message: "Failed to create project", success: false})
			}
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
					res.status(200).send({
						message: "Project added successfully",
						success: true
					});
				}
			})
		}
	});
		//
});

//create new subgroups
router.post('/createsubgroup', verifyToken, (req, res) => {
	//
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({message: 'Please login again', success: false})
		}
		else{
			if(!req.body.title || !req.body.projectId){
				res.status(200).send({message: "Failed to create group", success: false})
			}
			var group = {
				groupTitle: req.body.title,
				createdby: authData.user._id,
				timestamp: Date.now()
			}

			Project.findOne({_id: req.body.projectId, "subgroups.groupTitle": req.body.title }, (err, project) => {
				if(err){
					console.log(err)
					res.status(200).send({message: "Failed to create subgroup", success: false})
				}
			
				if(!project){
					Project.findOneAndUpdate({_id: req.body.projectId},
						{$push: {subgroups: group}},
						(err, project) => {
							// console.log(project)
							if(err){
								console.log(err)
								res.status(200).send({message: "Failed to create subgroup", success: false})
							}
							else{
								res.status(200).send({message: "Group created", success: true})
							}
					})
				}
				else{
					console.log(err)
					res.status(200).send({message: "Group already exists", success: false})
				}
			})
		}
	});
});

//fetch projects
router.post('/projects', verifyToken, (req, res) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			// console.log(authData)
			var userID = authData.user._id;
			Project.find({createdby: userID}, (err, projects) => {
				if(err){
					console.log("some error");
					return;
				}
				else{
					// console.log("success finding projects")
					res.status(200).send({
						message: "Project added successfully",
						success: true,
						projects: projects
					});
				}
			})
			//
		}
	});

});

//fetch project's data
router.post('/project', verifyToken, (req, res) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			// console.log(authData)
			Project.findOne({_id: req.body.projectId}, (err, project) => {
				if(err){
					console.log("some error");
					return;
				}
				else{
					// console.log("success finding projects")
					res.status(200).send({
						message: "Project fetched successfully",
						success: true,
						project: project
					});
				}
			})
			//
		}
	});

});

//projects with user by other persons
router.post('/sharedprojects', verifyToken, (req, res) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			var userID = authData.user._id;
			// console.log(userID)
			Project.find({sharedwith: {$elemMatch: {userId: userID}}}, (err, projects) => {
				if(err){
					console.log("some error");
					res.status(200).send({message: 'Error occured', success: false, error: err})
				}
				else{
					// console.log(projects)
					console.log("success finding projects")
					res.status(200).send({
						message: "Shared project fetched successfully",
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
router.post('/share', verifyToken, (req, res, next) => {
	jwt.verify(req.token, jwtSecret, (err, authData) =>{
		if(err){
			console.log(err)
			res.status(200).send({redirect:true})
		}
		else{
			// console.log(authData)
			if(!req.body.email || !req.body.projectId){
				res.status(200).send({message: "Failed to share project", success: false})
			}
			var email = req.body.email;
			if(authData.user.email === email){
				res.status(200).send({message: "You can't share", success: false})
				return next();
			}
			else{//find project and check if shared
				var projectID = req.body.projectId;
				Project.findOne({_id: projectID, "sharedwith.email": email}, (error, project) => {
					if(err){
						console.log("some error");
						res.status(200).send({message: 'Error occured', success: false, error: err});
					}
					if(!project){
						console.log("user not added previously")
						// res.status(200).send({
						// 	message: "User already added",
						// 	success: false							
						// });
						// return next();						// console.log('finally')
					}
					else{
						// console.log(projects)
						console.log("user already added")
						res.status(200).send({
							message: "User already added",
							success: false							
						});
						return next();
					}
					//find if user exists
					User.findOne({email: email}, (error, user) => {
						// console.log(user)
						if(error){
							console.log(error)
							res.status(200).send({message: 'Error occured', success: false, error: err})
							return next();
						}
						if(!user){
							// console.log("this 1")
					      ThirdPartyUser.findOne({ "profile.emails.value": email }, function (err, tuser) {
					  		if(err){
					  			console.log(err)
					  			res.status(200).send({message: 'Error occured', success: false, error: err})
					  			// return next(err);
					  		}
					  		if(!tuser){
					  			res.status(200).send({message: "User does not exist", success: false})
					  		}
					  		else{
					  			// console.log(tuser)
					  			var tempUser = JSON.parse(JSON.stringify(tuser))
								var newuser = {
									userId: tempUser._id,
									firstname: tempUser.profile.givenName,
									lastname: tempUser.profile.name.familyName,
									email: tempUser.profile.emails[0].value
								}	
								//update project
								Project.findOneAndUpdate({_id: projectID},
									{$push: {sharedwith: newuser}},
									(err, project) => {
										console.log(project)
										if(err){
											console.log(err)
											res.status(200).send({message: "Share with user failed", success: false})
										}
										else{
											res.status(200).send({message: "Shared with user", success: true})
										}
								})
					  		}
					      });
							// res.status(200).send({message: "user does not exist", success: false})
						}
						else{
							var newuser = {
								userId: user._id,
								firstname: user.firstname,
								lastname: user.lastname,
								email: user.email
							}	
							Project.findOneAndUpdate({_id: req.body.projectId},
								{$push: {sharedwith: newuser}},
								(err, project) => {
									// console.log(project)
									if(err){
										console.log(err)
										res.status(200).send({message: "Share with user failed", success: false})
									}
									else{
										res.status(200).send({message: "Shared with user", success: true})
									}
							})
						}
					})
				})//
			}
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