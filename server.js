const express =require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const port = process.env.PORT || 3001;
const users = require('./routes/users');
const config =require('./config/database');
var cors = require('cors')

const app = express();

app.use(logger('dev'));
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

const mongodb_uri = process.env.MONGODB_URI || config.database || config.localdb;
mongoose.connect(mongodb_uri);
mongoose.Promise = global.Promise;

app.use('/api/users', users);

app.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});
});

app.listen(port, () => console.log("Server started, listening on port", port));