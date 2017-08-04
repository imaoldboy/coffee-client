var config = require('./config');
var tools = require('./tools');
var Client = require('node-rest-client').Client;
var client = new Client();
client.on('error', function (err) {
	console.error('Something went wrong on the client when coffee machine begin to connect to the server', err);
});

var machineRestUrl = config.restUrl+'machines/';

const getMachineById = (id) =>{
	console.log('id is:' + id)
	console.log('full url is:' + machineRestUrl + id)
	client.get(machineRestUrl + id, function (data, response) {
		console.log(data);
	}).on('error', function (err) {
		console.log('something went wrong on the request of getMachineById', err.request.options);
	});
}

const insertMachine = (args) =>{
	client.post( machineRestUrl, args, function (data, response) {
		console.log(data);
	});
}

const updateMachine = (id, args)=> {
	//patch method
	client.registerMethod("patchMethod", machineRestUrl + id, "PATCH");
	client.methods.patchMethod(args, function (data, response) {
		console.log(data);
	});
}

module.exports ={
	getMachineById,
	insertMachine,
	updateMachine
}


//const Machine = require('./src/machineRestInterface');
//const id = '59841905369dbc1ee8d5511a';
//get by id
//Machine.getMachineById(id);

//insert
//var args = {
//	data: { remarks: "insert from rest clinet 111" },
//	headers: { "Content-Type": "application/json" }
//};
//Machine.insertMachine(args);

//update
//var args = {
//	data: { remarks: "this title has been changed 22", serialNo: "abcd" },
//	headers: { "Content-Type": "application/json" }
//};
//Machine.updateMachine(id, args)

