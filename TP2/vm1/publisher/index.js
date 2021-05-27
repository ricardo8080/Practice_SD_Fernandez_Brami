var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://brokertp2:1883');
var ip = require("ip");
var os = require("os");
var id = os.hostname();

function intervalFunc() {
    console.log('Sending data :)');
    client.publish(process.env.TOPIC, getData());
    //client.publish('precense', getDate());
}

function getData() {
    var time = new Date();
    var data = {
	time: date,
	container: id,
	ip: ip
    }
}

client.on('connect', function () {
//    client.publish('presence', 'Hello mqtt')
    setInterval(intervalFunc, 5000);
})
