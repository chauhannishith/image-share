const config =require('./config/database');
const cors = require('cors');
const express =require('express');
const mongoose = require('mongoose');
const nev = require('email-verification')(mongoose);
const node_env = process.env.NODE_ENV || 'development';
const nodemailer = require('nodemailer');
const logger = require('morgan');
const passport = require('passport');
const port = process.env.PORT || 3001;
const User = require('./models/user');
const users = require('./routes/users');
const index = require('./routes/index');

var mongodb_uri;
var verificationUrl;

const app = express();

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
    res.locals.user = req.user || "nishith";
    next();
});

app.use(logger('dev'));	//dev gives proper coloured log
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // for development allow everyone
// var whitelist = ['http://example1.com', 'http://example2.com'] //allow only these
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
//  cors(corsOptions) add in any route needed


if(node_env === 'production'){
	mongodb_uri = process.env.MONGODB_URI;//custom mlab uri
}
else if(node_env === 'localdev'){
	mongodb_uri = config.localdb;//local
}
else{
	mongodb_uri = config.database;//specified mlab
}

mongoose.connect(mongodb_uri);
mongoose.Promise = global.Promise;

// var smtpTransport = nodemailer.createTransport({
//     from: 'replyemail@example.com',
//     options: {
//         host: 'smtp.ethereal.email',
//         port: 587,
//         auth: {
//             user: 'nkbxs4cda5dtjwiz@ethereal.email',
//             pass: '1xbQvVS7zzzMFuNQRd'
//         }
//     }
// });

// nev.configure({
//     verificationURL: process.env.BACKEND_URL + '/email-verification/${URL}',
//     persistentUserModel: User,
//     tempUserCollection: 'tempusers',
 
//     transportOptions: {
//         service: 'Gmail',
//         auth: {
//             user: 'nkbxs4cda5dtjwiz@ethereal.email',
//             pass: '1xbQvVS7zzzMFuNQRd'
//         }
//     },
//     verifyMailOptions: {
//         from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
//         subject: 'Please confirm account',
//         html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
//         text: 'Please confirm your account by clicking the following link: ${URL}'
//     }
// }, function(error, options){
// });



app.use('/api/users', users);
app.use('/', index);

app.listen(port, () => console.log("Server started, listening on port", port));