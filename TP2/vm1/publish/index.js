var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://brokertp2:7777')

console.log("im running");

client.on('message', function (topic, message) {
	console.log(message.toString())
	setTimeout(
		function(){
			client.publish("Hello");
			console.log("Hello");
		},
		5000
	);
	client.end();
});
