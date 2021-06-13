function intervalFunc() {
    client.publish(process.env.TOPIC, getData());
    console.log("aaa")
};

function getData() {
    const time = new Date();
    const data = {
        time: time,
        container: id,
        ip: ip.address()
    }
    return JSON.stringify(data);
};

