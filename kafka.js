const { Message } = require("./models/message");
const { getMetaData } = require("./pipeline/metadata");
const mongoose = require("mongoose");
const config = require("config");

async function sendKafka() {
  // "fbdf30d8-e0a0-4d1d-8b91-9498ebc62871" - 6 MB
  // b569f132-8434-4f80-96c5-234d9f8b1069 - 30 MB
  // f1b4a809-266a-418c-aed9-9abcea60abf4 - 150 MB
  // bfb97921-c4f3-4b44-b51b-b6cff1665a1d - 300 MB
  // 37d2d8da-f197-4438-bdf6-e9f511005b36 - 500 MB
  try {
    await mongoose.connect(config.get("db"));
    const message = {
      blFileIdentifer: "b569f132-8434-4f80-96c5-234d9f8b1069",
    };
    console.log(`Message recieved!`);

    // Save Messages to the Database
    const db_message = new Message({
      partition: 0,
      topic: "mhp",
      value: message,
    });

    const result = await db_message.save();
    console.log(
      `Message ${result.value.blFileIdentifer} saved to the Database!`
    );

    if (result) {
      // Save Metadata to the Database
      getMetaData(result.value.blFileIdentifer);
    }

    console.info("Done!");
  } catch (err) {
    console.error("Could not send Message " + err);
  }
}

exports.sendKafka = sendKafka;

/*

    let i = 1;
    setInterval(async () => {
      try {
        console.log(`Message: ${i} recieved!`);

        // Save Messages to the Database
        const db_message = new Message({
          partition: 0,
          topic: "mhp",
          value: message,
        });

        const result = await db_message.save();

        if (result) {
          // Save Metadata to the Database
          getMetadata(result.value.blFileIdentifer);
          console.log(
            `Message ${result.value.blFileIdentifer} saved to the Database!`
          );
        }

        i--;
      } catch (err) {
        console.error("Could not send Message " + err);
      }
    }, 1000);
    */
