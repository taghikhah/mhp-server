const express = require("express");
const config = require("config");
const app = express();

// Set the base URL
global.__basedir = __dirname;

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const { sendKafka } = require("./kafka");
sendKafka();

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

const { updateMetadata } = require("./pipeline/metadata");
// updateMetadata();

// const { fileManager } = require("./pipeline/files");
// fileManager();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
