var mongoose = require('mongoose');
var UserSessionSchema = mongoose.Schema({
	userId:{
		type: String,
		default: ''
	},
	timestamp:{
		type: Date,
		default: Date.now()
	},
	isDeleted:{
		type: Boolean,
		deafult: false
	}
});

module.exports = mongoose.model('UserSession',UserSessionSchema);