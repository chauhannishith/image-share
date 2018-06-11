var mongoose = require('mongoose');
var ImageSchema = mongoose.Schema({
	addedby:{
		type: String,
		required: true
	},
	timestamp:{
		type: Date,
		default: Date.now()
	},
});

module.exports = mongoose.model('Image',ImageSchema);