const fs = require("fs");
const archiver = require("archiver");
const axios = require("axios");
const config = require("config");

function blFileBase(blFileIdentifier) {
  return `https://${config.baseUrl}/${config.baseLine}/${blFileIdentifier}`;
}

function blFileFrame(blFileIdentifier, fileType, fileIdentifier) {
  return `https://${config.baseUrl}/${config.nutzDaten}/${blFileIdentifier}/${fileType}/${fileIdentifier}`;
}

// function delay(i) {
//   return new Promise((resolve) => setTimeout(resolve, i * 250));
// }

// async function delayedUpload(i, filePath, fileName) {
//   await delay(i);
//   uploadFile(filePath, fileName);
// }

function zipDirectory(sourceDir, outPath) {
  var output = fs.createWriteStream(outPath);
  var archive = archiver("zip");

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(output);
    // console.log(archive.pointer() + " Total bytes");
    output.on("close", () => resolve());
    archive.finalize();
  });
}

async function fileDownloader(blFileIdentifier, referenzItems) {
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
        .then(() => {
          zipDirectory(
            `${__basedir}/downloads/${blFileIdentifier}`,
            `${__basedir}/uploads/${blFileIdentifier}.zip`
          );
        });
      i++;
    }

    return {
      path: `${__basedir}/uploads/${blFileIdentifier}`,
      name: `${blFileIdentifier}.zip`,
    };
  }

  // uploadFile(`${__basedir}/uploads/${blFileIdentifier}.zip`, blFileIdentifier);
  // await delayedUpload(
  //   i,
  //   `${__basedir}/uploads/${blFileIdentifier}.zip`,
  //   `${blFileIdentifier}.zip`
  // );
}

exports.fileDownloader = fileDownloader;
