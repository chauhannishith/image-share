const express =require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const port = process.env.PORT || 3001;
const users = require('./routes/users');
const config =require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongodb_uri = process.env.MONGODB_URI || config.localdb || config.database;
mongoose.connect(mongodb_uri);
mongoose.Promise = global.Promise;

app.use('/api/users', users);

app.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});
});

app.listen(port, () => console.log("Server started, listening on port", port));