const fs = require("fs");
const archiver = require("archiver");
const axios = require("axios");
const config = require("config");
// const express = require("express");

// const { Meta } = require("../models/metadata");
// const { Message } = require("../models/message");

function blFileBase(blFileIdentifier) {
  return `https://${config.baseUrl}/${config.baseLine}/${blFileIdentifier}`;
}

function blFileFrame(blFileIdentifier, fileType, fileIdentifier) {
  return `https://${config.baseUrl}/${config.nutzDaten}/${blFileIdentifier}/${fileType}/${fileIdentifier}`;
}

async function zipDirectory(sourceDir, outPath) {
  var output = fs.createWriteStream(outPath);
  var archive = archiver("zip");

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });

  archive.on("error", function (err) {
    console.log(err);
  });

  archive.pipe(output);
  archive.directory(sourceDir, false);
  archive.finalize();
}

async function fileDownloader(blFileIdentifier, referenzItems) {
  // Store baseline
  // const messages = await Message.find().select("-__v").sort("created_at");
  // const blFileIdentifier = messages[0].value["blFileIdentifer"];
  fs.mkdirSync(`./downloads/${blFileIdentifier}`, { recursive: true });

  axios({
    url: blFileBase(blFileIdentifier), //your url
    method: "GET",
    headers: {
      "x-api-key": config.apiKey,
    },
    responseType: "blob",
  }).then((response) => {
    fs.writeFileSync(
      `./downloads/${blFileIdentifier}/${blFileIdentifier}.txt`,
      response.data
    );
  });

  // Store other files
  // const meta = await Meta.find({
  //   "data.artefaktTyp": `BL_${blFileIdentifier}.bin`,
  // });

  // const referenzItemsArr = meta[0].data.referenzItems;

  for (const referenzItem of referenzItems) {
    for (const referenzierteData of referenzItem.referenzierteDaten) {
      axios({
        url: blFileFrame(
          blFileIdentifier,
          referenzierteData.filetype,
          referenzierteData.fileIdentifier
        ),
        method: "GET",
        headers: {
          "x-api-key": config.apiKey,
        },
        responseType: "blob",
      }).then((response) => {
        fs.writeFileSync(
          `./downloads/${blFileIdentifier}/${referenzierteData.filename}`,
          response.data
        );
      });
    }
  }

  zipDirectory(
    `${__basedir}/downloads/${blFileIdentifier}`,
    `${__basedir}/uploads/${blFileIdentifier}.zip`
  );
}

exports.fileDownloader = fileDownloader;
