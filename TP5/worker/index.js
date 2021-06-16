const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
const sleep = require('system-sleep');
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const id = os.hostname();
const TOPICWORKERREQUEST = 'upb/' + id + '/request'

function getId() {
    const data = { worker_id: id }
    console.log("id");
    console.log(data);
    return JSON.stringify(data);
};

function getResponseData() {
    const freq = parseFloat((Math.random() + 0.50).toFixed(2));
    const data = {
        freq: freq,
        iteration: (Math.floor(Math.random() * 15) + 5) 
    }
    console.log("data");
    console.log(data);
    return JSON.stringify(data);
};

client.on('connect', function () {
    sleep(8000);
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
    TOPICSENSORIDRESPONSE='upb/'+JSON.parse(message).sensor_id+'/response'
    if(topic == TOPICWORKERREQUEST) {
        client.publish(TOPICSENSORIDRESPONSE, getResponseData());
    }
})
