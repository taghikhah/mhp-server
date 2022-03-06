const { Message } = require("../models/message");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await Message.find().select("-__v").sort("created_at");
  res.send(messages);
});

module.exports = router;
