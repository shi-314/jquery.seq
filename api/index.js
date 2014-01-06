var version = '/v1',
	port = 8080,
	express = require('express'),
	env = process.argv[2] || process.env.NODE_ENV || 'development',
	app = express();

app.configure('development', function() {
	app.use(express.bodyParser());
});


app.get(version+'/getList/:mail', function (req, res) {
	res.json({
		status: 'well well well...'+req.params.mail
	});
});

app.put(version+'/addSeq/:mail', function (req, res) {
	console.log(req.body);
	res.json(req.body);
});

app.listen(8080);
console.log('Listening on port ' + port + ' ...');
