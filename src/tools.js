var ls = require('ls');
var shell = require("shelljs");
var fs = require("fs");
var request = require('request');
var config = require('./config')

exports.getSendCmdStr = function (cmdPrefix, deviceAddress){
	return Buffer.from("B0C0A80101001A", "hex")
};

const reboot = () =>{
	console.log('begin reboot()')
	shell.exec("sudo reboot");
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
				return array[1].trim();
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
		if(filterArray[i].startsWith(cmdstr)){
			console.log('=====================return true.');
			return true;
		}
	}
	
	return false;

}

module.exports.filterCmd = filterCmd
module.exports.getSerialNo = getSerialNo
module.exports.downloadFile = downloadFile
module.exports.reboot = reboot
module.exports.cleanup = cleanup
module.exports.str2hex = str2hex
module.exports.getDeviceList = getDeviceList
