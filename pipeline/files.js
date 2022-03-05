const fs = require("fs");
const axios = require("axios");
const config = require("config");

function blFileBase(blFileIdentifier) {
  return `https://${config.baseUrl}/${config.baseLine}/${blFileIdentifier}`;
}

function blFileFrame(blFileIdentifier, fileType, fileIdentifier) {
  return `https://${config.baseUrl}/${config.nutzDaten}/${blFileIdentifier}/${fileType}/${fileIdentifier}`;
}

function fileDownloader(blFileIdentifier, referenzItems) {
  // Store baseline
  fs.mkdirSync(`./downloads/${blFileIdentifier}`, { recursive: true });
  axios({
    url: blFileBase(blFileIdentifier),
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
  let i = 0;
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
      })
        .then((response) => {
          fs.writeFileSync(
            `./downloads/${blFileIdentifier}/${referenzierteData.filename}`,
            response.data
          );
        })
        .catch((err) => console.log(err.message));
      i++;
    }
  }
  return i;
}

exports.fileDownloader = fileDownloader;
