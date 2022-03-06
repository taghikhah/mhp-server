const { Meta } = require("../models/metadata");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const metadats = await Meta.find().sort("created_at");
  res.send(metadats);
});

module.exports = router;
