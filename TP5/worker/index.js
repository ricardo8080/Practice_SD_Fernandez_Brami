const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const worker_register  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const worker_register  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();

function intervalFunc() {
    worker_register.publish(process.env.TOPICMASTERREGISTER, getData());
    console.log(getData())
};

function getData() {
    const data = { worker_id: id }
    return JSON.stringify(data);
};


worker_register.on('connect', function () {
    setInterval(intervalFunc, 20000);
});