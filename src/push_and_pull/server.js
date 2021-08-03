import zmq from 'zeromq';



async function runServer() {
    const sockReceiver = new zmq.Reply();
    const sockPush = new zmq.Push();

    console.log('starting...');
    await sockReceiver.bind('tcp://*:5555');
    await sockPush.bind('tcp://*:5556');
    console.log('started.');

    for await (const [msg] of sockReceiver) {
        const id = msg.toString();
        console.log(Date.now() + ` Received : #[${id}]`);

        // speichern in DB
        await sockReceiver.send('success');
        await sockPush.send(id);
    }
}

runServer();
