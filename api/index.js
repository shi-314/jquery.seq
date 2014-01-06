var version = '/v1',
	port = 8080,
	express = require('express'),
	env = process.argv[2] || process.env.NODE_ENV || 'development',
	app = express(),
	mongoose = require('mongoose');

app.configure('development', function() {
	app.use(express.bodyParser());
	this.db = mongoose.connect('mongodb://localhost/seq', ['sequences']);
});


app.get(version+'/getList/:mail', function (req, res) {
	res.json({
		status: 'well well well...'+req.params.mail
	});
});

app.put(version+'/add', function (req, res) {
	console.log(req.body);
	this.db.put(req.body);
	res.json(req.body);
});

app.listen(8080);
console.log('Listening on port ' + port + ' ...');
