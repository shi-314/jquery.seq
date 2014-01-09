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

		db.collection('seq', function (err, collection) {
			if(err !== null)
				console.log(err);
			else
				app.sequences = collection;
		});

		console.log('Connected to mongodb');
	});
});

app.all('*', function (req, res, next) {
	console.log('test');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	next();
});

app.get(version + '/getList/:mail', function (req, res) {
	res.json({
		status: 'well well well...' + req.params.mail
	});
});

app.put(version + '/add', function (req, res) {
	app.sequences.save(req.body, function(err, res) {
		console.log('added sequence "'+res.name+'" for '+res.email+' with id '+res._id);
	});
	res.json(req.body);
});

app.listen(8080);
console.log('Listening on port ' + port + ' ...');
