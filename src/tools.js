var ls = require('ls');
var shell = require("shelljs");
var fs = require("fs");
var request = require('request');
var config = require('./config');
const EventEmitter = require('events');
const eventPipe = new EventEmitter();

const Machine = require('./machineRestInterface');

exports.getSendCmdStr = function (cmdPrefix, deviceAddress){
	return Buffer.from("B0C0A80101001A", "hex")
};

const reboot = () =>{
	console.log('begin reboot()')
	shell.exec("sudo reboot");
}
const unzipRuntime = () =>{
	console.log('unzipRuntime')
	shell.exec("tar zxvf /home/pi/coffee-client.tgz");
	shell.exec("sh /home/pi/coffee-client/startup.sh");
}
const str2hex = (str) => {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i ++) {
                var ascii = str.charCodeAt(i);
                arr.push(ascii);
        }
        arr.push(255);
        arr.push(255);
        arr.push(255);
        return new Buffer(arr);
}

const getDeviceList = () => {
	var deviceList = [];

	for (var file of ls('/dev/ttyUSB*')) {
	  deviceList.push(file.name);
	}
	return deviceList;
}

const downloadFile = (uri,filename,callback) => {
	var stream = fs.createWriteStream(filename);
	request(uri).pipe(stream).on('close', callback); 
}

const cleanup = () => {
	console.log('begin to clean up!');
}

const getSerialNo = () => {
	var fs       = require('fs'),
	    readline = require('readline'),
	    instream = fs.createReadStream('/proc/cpuinfo');

	var rl = readline.createInterface(
	{
	    input: instream,
	    terminal: false
	});

	rl.on('line', function(line) 
	{
		if(line.startsWith('Serial')){
			var array = line.split(':');
			if(array.length==2){
				console.log(array[1].trim());
				console.log("begin to emit event serialNo");
				eventPipe.emit("serialNo",array[1].trim());
				//return array[1].trim();
			}else{
				console.log('error to read /proc/cpuinfo');
				return 'error device'
			}
		}
			
	    // if(instream.isEnd()) ...
	});
}

const filterCmd = (cmdstr, filterArray) => {
	for( var i=0; i< filterArray.length; i++)
	{
		if(filterArray[i].startsWith(cmdstr) || cmdstr.startsWith(filterArray[i])){
			console.log('=====================return true.');
			return true;
		}
	}
	if(config.shutdown.startsWith(cmdstr)){
		eventPipe.emit('reboot','power button is pressed.',0);
	}	
	return false;

}

const filterReadCmd = (cmdstr, filterArray) => {
	for( var i=0; i< filterArray.length; i++)
	{
		if(isReadCmd(cmdstr,filterArray[i])){
			console.log('got read filter cmd.=====================return true.');
			return true;
		}
	}
	return false;

}
const isPowerOff = () =>{
	var deviceList = getDeviceList();
	if(deviceList.length == 2){
		return false;
	}else{
		return true;
	}
}
const isReadCmd = (line, cmdStr) =>{
	if((line.length>17) && (line.substring(7,9) == cmdStr.substring(7,9)) && (line.substring(15,17) == cmdStr.substring(15,17))){
		return true;
	}else
		return false
}

module.exports.isReadCmd = isReadCmd
module.exports.eventPipe = eventPipe
module.exports.isPowerOff = isPowerOff
module.exports.filterCmd = filterCmd
module.exports.filterReadCmd = filterReadCmd
module.exports.getSerialNo = getSerialNo
module.exports.downloadFile = downloadFile
module.exports.reboot = reboot
module.exports.unzipRuntime = unzipRuntime
module.exports.cleanup = cleanup
module.exports.str2hex = str2hex
module.exports.getDeviceList = getDeviceList
