const express = require("express");
const messages = require("../routes/messages");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/messages", messages);
};
