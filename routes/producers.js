const { Kafka } = require("kafkajs");

// Test Kafka Server
const test = {
  clientId: "hello-world",
  brokers: ["192.168.0.132:9092"],
  topic: "TutorialTopic",
};

const kafka = new Kafka({
  clientId: test.clientId,
  brokers: test.brokers,
});

const producer = kafka.producer();

// we define an async function that writes a new message each second
const producers = async () => {
  await producer.connect();
  let i = 0;

  setInterval(async () => {
    try {
      const messageObj = {
        blFileIdentifier: "fbdf30d8-e0a0-4d1d-8b91-9498ebc62871",
      };

      await producer.send({
        topic: test.topic,
        messages: [
          {
            key: String(i),
            value: Buffer.from(JSON.stringify(messageObj)),
          },
        ],
      });

      console.log(`Message: ${i} sent!`);
      i++;
    } catch (err) {
      console.error("Could not send Message " + err);
    }
  }, 1000);
};

module.exports = producers;
