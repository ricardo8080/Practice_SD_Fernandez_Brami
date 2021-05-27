const mqtt = require('mqtt');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME +':'+ process.env.PORT);
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const ip = require("ip");
const os = require("os");
const id = os.hostname();

function intervalFunc() {
    client.publish(process.env.TOPIC, getData());
};

function getData() {
    const time = new Date();
    var months = ["January", "February", "March", "April", "May", 
    "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    const dateFormated = days[time.getDay()]+ " " +
                        months[time.getMonth()] + " "  
                        time.getDate() + " "  +
                        time.getHours + ":" +
                        time.getMinutes + ":" +
                        time.getSeconds +
                        " -04 " + time.getFullYear();
    const data = {
        time: dateFormated,
        container: id,
        ip: ip.address()
    }
    return JSON.stringify(data);
};


client.on('connect', function () {
    setInterval(intervalFunc, 5000);
});