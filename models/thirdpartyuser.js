var mongoose = require('mongoose');
var ThirdPartyUserSchema = mongoose.Schema({

}, {strict: false});

module.exports = mongoose.model('ThirdPartyUser',ThirdPartyUserSchema);