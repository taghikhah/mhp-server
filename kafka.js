const { Message } = require("./models/message");
const { getMetaData } = require("./pipeline/metadata");
const mongoose = require("mongoose");
const config = require("config");

async function sendKafka(id) {
  try {
    await mongoose.connect(config.get("db"));
    const message = {
      blFileIdentifer: id,
    };

    // Save Messages to the Database
    const db_message = new Message({
      partition: 0,
      topic: "mhp",
      value: message,
    });

    const result = await db_message.save();
    console.log(`[MESSAGE] ${result.value.blFileIdentifer} metadata saved!`);

    if (result) {
      // Save Metadata to the Database
      getMetaData(result.value.blFileIdentifer);
    }

    // console.info("Fake Kafka Generator Successfully Sent!");
  } catch (err) {
    console.error("Could not send Message " + err);
  }
}

exports.sendKafka = sendKafka;
