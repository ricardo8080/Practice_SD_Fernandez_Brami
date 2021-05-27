var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
//var client  = mqtt.connect('mqtt://brokertp2')
//var client  = mqtt.connect('mqtt://'+process.env.IP + ':'+process.env.LISTEN)


function intervalFunc() {
    console.log('Cant stop me now!');
    client.publish('presence', getData())
}

function getData() {
    var time = new Date();
    var cont = 
    var data = {
	time: date,
	container: "69696969",
	ip: "69.69.69.69"
    }
}

client.on('connect', function () {
//    client.publish('presence', 'Hello mqtt')
    setInterval(intervalFunc, 5000);
})
