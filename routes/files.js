const { Files } = require("../models/file");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const files = await Files.find().sort("created_at");
  res.send(files);
});

module.exports = router;
