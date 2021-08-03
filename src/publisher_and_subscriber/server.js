import zmq from 'zeromq';



async function runServer() {
    const sockReceiver = new zmq.Reply();
    const sockPublisher = new zmq.Publisher();

    console.log('starting...');
    await sockReceiver.bind('tcp://*:5555');
    await sockPublisher.bind('tcp://*:5556');
    console.log('started.');

    for await (const [msg] of sockReceiver) {
        const id = msg.toString();
        console.log(`Received : #[${id}]`);

        // speichern in DB
        await sockReceiver.send('success');

        setTimeout(() => {
            sockPublisher.send(['worker', id]);
        }, Math.floor(Math.random() * (500 - 100) + 100));

    }
}

runServer();
