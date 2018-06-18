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
	subgroups: [{
		groupTitle: String,
		createdby: String,
		timestamp: Date
	}],
	sharedwith:[{
		userId: String,
		firstname: String,
		lastname: String,
		email: String
	}]
});

module.exports = mongoose.model('Project',ProjectSchema);