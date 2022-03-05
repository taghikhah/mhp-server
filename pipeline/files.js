const fs = require("fs");
const archiver = require("archiver");
const axios = require("axios");
const config = require("config");
const { uploadFile } = require("./upload");

function blFileBase(blFileIdentifier) {
  return `https://${config.baseUrl}/${config.baseLine}/${blFileIdentifier}`;
}

function blFileFrame(blFileIdentifier, fileType, fileIdentifier) {
  return `https://${config.baseUrl}/${config.nutzDaten}/${blFileIdentifier}/${fileType}/${fileIdentifier}`;
}

function zipDirectory(sourceDir, outPath) {
  var output = fs.createWriteStream(outPath);
  var archive = archiver("zip");

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(output);
    // console.log(archive.pointer() + " Total bytes");
    output.on("close", () =>
      resolve(console.log(archive.pointer() + " Total bytes"))
    );
    archive.finalize();
  });
}

function fileDownloader(blFileIdentifier, referenzItems, callback) {
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
        .then(() => {
          zipDirectory(
            `${__basedir}/downloads/${blFileIdentifier}`,
            `${__basedir}/uploads/${blFileIdentifier}.zip`
          );
        });
    }
  }

  callback();

  // uploadFile(`${__basedir}/uploads/${blFileIdentifier}.zip`, blFileIdentifier);
}

exports.fileDownloader = fileDownloader;
