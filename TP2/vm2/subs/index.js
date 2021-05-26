var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://' + process.env.IP + ':' + process.env.LISTEN);

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
