var ls = require('ls');

exports.getSendCmdStr = function (cmdPrefix, deviceAddress){
	return Buffer.from("B0C0A80101001A", "hex")
};

const hello = () =>{
	console.log('hello ~')
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

module.exports.hello = hello
module.exports.str2hex = str2hex
module.exports.getDeviceList = getDeviceList
