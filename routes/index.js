const express = require('express');
const router = express.Router();

router.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});
});

module.exports = router;