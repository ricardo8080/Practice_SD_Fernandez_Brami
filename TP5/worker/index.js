const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();
const TOPICWORKERREQUEST = 'upb/' + id + '/request'
const TOPICWORKERRESPONSE = 'upb/' + id + '/response'

function getId() {
    const data = { worker_id: id }
    return JSON.stringify(data);
};

function getResponse() {
    const data = {
        freq: (Math.random() + 0.5),
        iteration: (Math.floor(Math.random() * 15) + 5) 
    }
    return JSON.stringify(data);
};

client.publish(process.env.TOPICMASTERREGISTER, getId());

client.on('connect', function () {
    client.subscribe(TOPICWORKERREQUEST, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
});

client.on('message', async function (topic, message) {
    // message is Buffer
    if(topic == TOPICWORKERREQUEST) {
        client.publish(TOPICWORKERRESPONSE, getResponse());
    }
})
