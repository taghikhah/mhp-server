const express = require("express");
const config = require("config");
const app = express();

// Set the base URL
global.__basedir = __dirname;

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const consumers = require("./routes/consumers");
// start the consumer
consumers().catch((err) => {
  console.error("error in consumer: ", err);
});

const producers = require("./routes/producers");
// call the `produce` function
// producers().catch((err) => {
//   console.error("error in producer: ", err);
// });

// const assignDataValue = require("./routes/metadata");
const { updateMetadata } = require("./routes/metadata");
// updateMetadata();

// const { fileManager } = require("./routes/fileManager");
// fileManager();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
