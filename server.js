const express =require('express');
const mongoose = require('mongoose');

var users = require('./routes/users');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var users = require('./routes/users');

const mongodb_uri = "mongodb://nishith:qwerty123@ds245210.mlab.com:45210/imagetask";
const promise = mongoose.connect(process.env.MONGODB_URI || mongodb_uri);

const port = process.env.PORT || 3001;

app.use('/api/users', users);

app.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});
});

app.listen(port, () => console.log("Server started, listening on port", port));