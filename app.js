const os = require('os');
const { Kafka } = require('kafkajs');
const kafkaBroker1 = process.env.KAFKA_BROKER1;
const kafkaBroker2 = process.env.KAFKA_BROKER2;
const kafkaBroker3 = process.env.KAFKA_BROKER3;

// Kafka configuration
const kafka = new Kafka({
    clientId: 'cpu-monitor-app',
    brokers: [kafkaBroker1, kafkaBroker2, kafkaBroker3],
});

const producer = kafka.producer();

// Kafka topic to publish CPU data
const kafkaTopic = 'cpu_levels';

// Function to get CPU usage
function getCPUUsage() {
    const cpus = os.cpus();
    const totalUsage = cpus.reduce((acc, core) => {
        const total = core.times.user + core.times.nice + core.times.sys + core.times.idle + core.times.irq;
        const usage = total - core.times.idle;
        return acc + (usage / total) * 100;
    }, 0);

    return totalUsage / cpus.length;
}

// Send CPU usage data to Kafka
async function sendCPUUsageToKafka() {
    const cpuUsage = getCPUUsage();
    const message = {
        topic: kafkaTopic,
        messages: [{ value: JSON.stringify({ cpuUsage: cpuUsage.toFixed(2) }) }],
    };

    try {
        await producer.send(message);
        console.log(`Sent CPU usage to Kafka: ${cpuUsage.toFixed(2)}%`);
    } catch (error) {
        console.error('Error sending message to Kafka:', error);
    }
}

// Connect to Kafka and start monitoring
async function run() {
    await producer.connect();
    console.log('Kafka producer is ready');

    setInterval(sendCPUUsageToKafka, 60000); // Send data every 1 minute (60000 milliseconds)
}

run().catch(error => {
    console.error('Error in the Kafka producer:', error);
});
