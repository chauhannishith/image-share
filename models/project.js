var mongoose = require('mongoose');
var ProjectSchema = mongoose.Schema({
	createdby:{
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	timestamp:{
		type: Date,
		default: Date.now()
	},
	sharedwith:[{
		userId: String,
		firstname: String,
		lastname: String,
		email: String
	}]
});

module.exports = mongoose.model('Project',ProjectSchema);