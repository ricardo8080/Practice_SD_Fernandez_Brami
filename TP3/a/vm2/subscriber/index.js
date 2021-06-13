var mqtt = require('mqtt');
//var client  = mqtt.connect('mqtt://' + process.env.HOST + ':' + process.env.PORT);
var client  = mqtt.connect('mqtt://' + process.env.HOST);

client.on('connect', function() {
    client.subscribe(process.env.TOPIC, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    //client.end()
  })
