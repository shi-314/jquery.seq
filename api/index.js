var version = '/v1';
var express = require('express');

app = express();

app.get(version+'/getList/:mail', function (req, res) {
	res.json({
		status: 'well well well...'+req.params.mail
	})
});

app.post(version+'/addSeq/:mail', function (req, res) {
	res.json({
		status: req.param
	})
});

app.listen(8000);
console.log('Listening ...');
