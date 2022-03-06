const express = require("express");
const config = require("config");
const app = express();

// Set the base URL
global.__basedir = __dirname;

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

// const wsServer = require("./startup/socket");
// wsServer;

const { sendKafka } = require("./kafka");

// "fbdf30d8-e0a0-4d1d-8b91-9498ebc62871" - 6 MB
// b569f132-8434-4f80-96c5-234d9f8b1069 - 30 MB
// f1b4a809-266a-418c-aed9-9abcea60abf4 - 150 MB
// bfb97921-c4f3-4b44-b51b-b6cff1665a1d - 300 MB
// 37d2d8da-f197-4438-bdf6-e9f511005b36 - 500 MB
const messages = [
  "fbdf30d8-e0a0-4d1d-8b91-9498ebc62871",
  "b569f132-8434-4f80-96c5-234d9f8b1069",
];

for (const message of messages) {
  sendKafka(message);
}
// var time = 1;
// var interval = setInterval(function () {
//   if (time <= 20) {
//     sendKafka();
//     time++;
//   } else {
//     clearInterval(interval);
//   }
// }, 20000);

const consumers = require("./pipeline/consumers");
// start the consumer
// consumers().catch((err) => {
//   console.error("error in consumer: ", err);
// });

const producers = require("./pipeline/producers");
// call the `produce` function
// producers().catch((err) => {
//   console.error("error in producer: ", err);
// });

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
