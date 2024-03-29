var version = '/v1',
	port = 8080,
	express = require('express'),
	env = process.argv[2] || process.env.NODE_ENV || 'development',
	app = express(),
	mongo = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID;

app.configure('development', function () {

	app.use(express.bodyParser());

	mongo.connect("mongodb://localhost/seq", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		db.collection('seq', function (err, collection) {
			if (err !== null)
				console.log(err);
			else
				app.sequences = collection;
		});

		console.log('Connected to mongodb');
	});

});

app.all('*', function (req, res, next) {

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	next();

});

app.put(version + '/save', function (req, res) {

	var obj = {
		email: req.body.email,
		name: req.body.name,
		elements: req.body.elements,
		connections: req.body.connections
	};

	if (req.body._id !== undefined) obj._id = ObjectID(req.body._id);

	app.sequences.save(obj, function (err, mongoRes) {
		if (err !== null) {
			console.log(err)
		} else {
			console.log('added new sequence "' + obj.name + '" for ' + obj.email + ' with id ' + obj._id);
			res.json({ _id: obj._id });
			console.log(obj);
		}
	});

});

app.get(version + '/list/:email', function (req, res) {

	console.log('fetching list for ' + req.params.email);

	var list = app.sequences.find({email: req.params.email}).toArray(function (what, list) {
		res.json(list);
	});

});

app.get('*', function(req, res){

	res.status(404);
	res.send({ error: 'Not found' });

});


app.listen(8080);
console.log('Listening on port ' + port + ' ...');
