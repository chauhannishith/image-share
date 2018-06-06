var mongoose = require('mongoose');
var SessionSchema = mongoose.Schema({
	userId:{
		type: String,
		default: ''
	},
	timestamp:{
		type: Date,
		default: Date.now()
	},
	isDeleted:{
		type: Boolenan,
		deafult: false
	}
});

module.exports = mongoose.model('Session',SessionSchema);