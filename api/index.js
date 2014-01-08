var version = '/v1',
	port = 8080,
	express = require('express'),
	env = process.argv[2] || process.env.NODE_ENV || 'development',
	app = express(),
	mongo = require('mongodb').MongoClient;

app.configure('development', function () {
	app.use(express.bodyParser());

	mongo.connect("mongodb://localhost/seq", function (err, db) {
		if (err) { return console.dir(err); }
		app.sequences = db.collection('seq', function (err, collection) {});
	});
});

app.all('/', function (req, res, next) {
	console.log('test');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.get(version + '/getList/:mail', function (req, res) {
	res.json({
		status: 'well well well...' + req.params.mail
	});
});

app.put(version + '/add', function (req, res) {
	console.log(app.db);
	app.sequences.put(req.body);
	res.json(req.body);
});

app.listen(8080);
console.log('Listening on port ' + port + ' ...');
