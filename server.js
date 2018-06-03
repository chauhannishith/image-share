const config =require('./config/database');
const cors = require('cors');
const express =require('express');
const mongoose = require('mongoose');
const nev = require('email-verification')(mongoose);
const logger = require('morgan');
const passport = require('passport');
const port = process.env.PORT || 3001;
const User = require('./models/user');
const users = require('./routes/users');


const app = express();

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

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

const mongodb_uri = process.env.MONGODB_URI || config.database || config.localdb;//custom || mlab || local

mongoose.connect(mongodb_uri);
mongoose.Promise = global.Promise;

nev.configure({
    verificationURL: 'http://myawesomewebsite.com/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'myawesomewebsite_tempusers',
 
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'myawesomeemail@gmail.com',
            pass: 'mysupersecretpassword'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    }
}, function(error, options){
});

app.use('/api/users', users);

app.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});
});

app.listen(port, () => console.log("Server started, listening on port", port));