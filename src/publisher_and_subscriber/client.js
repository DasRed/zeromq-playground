//  Hello World client
import zmq from 'zeromq';

async function runMessageSender() {
    console.log('Connecting sender to server…');

    //  Socket to talk to server
    const sock = new zmq.Request();
    sock.connect('tcp://localhost:5555');


    for (let i = 0; i < 3; i++) {
        const id = Math.floor(Math.random() * (99999 - 10000) + 10000);

        console.log(`Sending #[${id}]`);
        await sock.send(id)
        sock.receive().then(([result]) => console.log(`#[${id}] Received ${result.toString()}`));
    }
}

async function runWorker(index) {
    console.log('Connecting worker to server…');


    const sockSubscriber = new zmq.Subscriber();
    sockSubscriber.connect("tcp://127.0.0.1:5556");
    sockSubscriber.subscribe('worker ' + index);

    for await (const [topic, msg] of sockSubscriber) {
        console.log(`#[${msg.toString()}] received a message related to: ${topic.toString()} on worker #${index}`);
    }
}

runMessageSender();
runWorker(1);
runWorker(2);
