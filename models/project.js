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
	}
});

module.exports = mongoose.model('Project',ProjectSchema);