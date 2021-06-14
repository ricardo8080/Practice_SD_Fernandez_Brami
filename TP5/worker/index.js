const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
const sleep = require('system-sleep');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();
const TOPICWORKERREQUEST = 'upb/' + id + '/request'
const TOPICWORKERRESPONSE = 'upb/' + id + '/response'

function getId() {
    const data = { worker_id: id }
    console.log("id");
    console.log(data);
    return JSON.stringify(data);
};

function getResponseData() {
    const data = {
        freq: (Math.random() + 0.5),
        iteration: (Math.floor(Math.random() * 15) + 5) 
    }
    console.log("data");
    console.log(data);
    return JSON.stringify(data);
};

client.on('connect', function () {
    sleep(5000);
    //Send worker_id to master
    client.publish(process.env.TOPICMASTERREGISTER, getId());
    //subscribe for esp32 requests
    client.subscribe(TOPICWORKERREQUEST, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
});

client.on('message', async function (topic, message) {
    // message is Buffer
    if(topic == TOPICWORKERREQUEST) {
        client.publish(TOPICWORKERRESPONSE, getResponseData());
    }
})
