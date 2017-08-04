var config = require('./src/config');
var tools = require('./src/tools');
var Client = require('node-rest-client').Client;
var client = new Client();
client.on('error', function (err) {
	console.error('Something went wrong on the client', err);
});

var eventRestUrl = config.restUrl+'events/';
var eventID = "5983f843bb37541b3c1e9dcb";

const getEventById = (id) =>{
	console.log('id is:' + id)
	console.log('full url is:' + eventRestUrl + id)
	client.get(eventRestUrl + id, function (data, response) {
		console.log(data);
	}).on('error', function (err) {
		console.log('something went wrong on the request', err.request.options);
	});
}

const insertEvent = (args) =>{
	//use post method as insert function
	client.post( eventRestUrl, args, function (data, response) {
		console.log(data);
	});
}

const updateEvent = (id, args)=> {
	//patch method
	client.registerMethod("patchMethod", eventRestUrl + id, "PATCH");
	client.methods.patchMethod(args, function (data, response) {
		console.log(data);
	});
}

module.exports ={
	getEventById,
	insertEvent,
	updateEvent
}
