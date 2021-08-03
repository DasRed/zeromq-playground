//  Hello World client
import zmq from 'zeromq';

async function runMessageSender() {
    console.log('Connecting sender to server…');

    //  Socket to talk to server
    const sock = new zmq.Request();
    sock.connect('tcp://localhost:5555');

    for (let id = 1; id <= 100; id++) {
        console.log(Date.now() + ` Sending #[${id}]`);
        await sock.send(id)
        const result = await sock.receive()
        console.log(Date.now() + ` #[${id}] Received ${result.toString()}`);
    }
}

async function runWorker(index) {
    console.log(`Connecting #${index} worker to server…`);

    const sockSubscriber = new zmq.Pull();
    sockSubscriber.connect("tcp://127.0.0.1:5556");

    for await (const [msg] of sockSubscriber) {
        console.log(Date.now() + ` #[${msg.toString()}] received a message related to: #${index}`);
        const delay = Math.floor(Math.random() * (500 - 10) + 10);
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

for (let i = 1; i <= 10; i++) {
    runWorker(i);
}

runMessageSender();
