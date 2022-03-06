const { Kafka } = require("kafkajs");
const { Message } = require("../models/message");
const { getMetaData } = require("./metadata");

// Main Kafka Server
const mhp = {
  clientId: "mhp-mobility-big-1",
  brokers: [
    "sulky-01.srvs.cloudkafka.com:9094",
    "sulky-03.srvs.cloudkafka.com:9094",
    "sulky-02.srvs.cloudkafka.com:9094",
  ],
  topic: "7kijucqv-mhp-mobility-hackathon-su-big",
};

const kafka = new Kafka({
  clientId: mhp.clientId,
  brokers: mhp.brokers,
  authenticationTimeout: 1000,
  reauthenticationThreshold: 10000,
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: "7kijucqv",
    password: "s9tFt4-t4CsnDFE1ILMZK_x1byMUW6PJ",
  },
});

const consumer = kafka.consumer({ groupId: mhp.clientId });

/*
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

const consumer = kafka.consumer({ groupId: test.clientId });
*/

const consumers = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: mhp.topic, fromBeginning: true });
  await consumer.run({
    partitionsConsumedConcurrently: 3, // Default: 1
    eachMessage: async ({ topic, partition, message }) => {
      // Save Messages to the Database
      const db_message = new Message({
        partition: partition,
        topic: topic,
        value: JSON.parse(message.value.toString()),
      });

      const result = await db_message.save();

      if (result) {
        // Save Metadata to the Database
        getMetaData(result.value.blFileIdentifer);
        console.log(
          `[MESSAGE] ${result.value.blFileIdentifer} metadata saved to the Database!`
        );
      }
    },
  });
};

module.exports = consumers;
