const express = require('express');
const router = express.Router();
//for unauthenticated routes
router.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});

});

module.exports = router;