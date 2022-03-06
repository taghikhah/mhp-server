const express = require("express");
const messages = require("../routes/messages");
const metadats = require("../routes/metadats");
const files = require("../routes/files");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/messages", messages);
  app.use("/api/metadats", metadats);
  app.use("/api/files", files);
};
