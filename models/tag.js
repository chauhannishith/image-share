var mongoose = require('mongoose');
var TagSchema = mongoose.Schema({
	userId:{
		type: String
	},
	tag: [{
		tagname: String,
		images: [String]
	}]
});

module.exports = mongoose.model('Tag',TagSchema);