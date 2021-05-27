var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://brokertp2:1883');
var ip = require("ip");
var getId = require('docker-container-id');
var id = await getId();

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
