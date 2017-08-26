var SerialPort = require("serialport");
var readCmd1 = Buffer.from("B0C0A80101001A", "hex")
var dataBuffer = new Array();
var port = new SerialPort("/dev/ttyUSB0",{
	bandrate:9600,
	autoOpen:false,
	stopBits:1,
	timeOut:2
});


function writeDC2DB(dc1,dc2){
	console.log(dc1);
	console.log(dc2);
}

function readDC(data, cmd){
	var index = data.indexOf(cmd);
	if(index !== -1){
		console.log("====================includes a0 : " + data.indexOf(cmd));
		if(data[index+2] && data[index+3]){
			var dc1 = parseInt(data[index+2], 16);	
			var dc2 = parseInt(data[index+3], 16);	
			writeDC2DB(dc1, dc2);
		}
	}
	for(x in data){
		if(data[x] == 'ff')
			console.log('Data:--------------', data[x]);
		else
			console.log('Data:---', data[x]);
	}
}

function writeCmd(){
	console.log('in writeCmd()');

	readDC(dataBuffer, 'a0');
	dataBuffer.length = 0;
	port.write(readCmd1);
}

port.open(function (err) {
	if (err) {
		return console.log('Error opening port: ', err.message);
	}
	setInterval(writeCmd,2000);
 
});


port.on('open', function() {
	console.log('in open');
});

port.on('data', function (data) {
//	console.log('Data:', data.toString('hex'));
	dataBuffer.push(data.toString('hex'));
});
