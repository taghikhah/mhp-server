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
// sendKafka();

var time = 1;

var interval = setInterval(function () {
  if (time <= 20) {
    sendKafka();
    time++;
  } else {
    clearInterval(interval);
  }
}, 10000);

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
