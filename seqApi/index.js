var express = require('express');

app = express();

app.get('/getList', function (req, res) {
	res.json({
		status: 'well well well...'
	})
});

app.listen(8000);
console.log('Listening ...');
