const express =require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/test', (req,res) => {
	res.json({first:"nishith", last: "chauhan"});
});

app.listen(port, () => console.log("Server started, listening on port", port));