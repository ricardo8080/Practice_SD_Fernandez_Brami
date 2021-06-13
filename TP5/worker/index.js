const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const marter_register  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const marter_register  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();

function intervalFunc(worker_id) {
    marter_register.publish(process.env.TOPICMASTERREGISTER, 'container_id');
    //marter_register.publish(process.env.TOPICMASTERREGISTER, worker_id);
    console.log("aacontainer_id sent")
};

marter_register.on('connect', function () {
    setInterval(intervalFunc, 10000);
});