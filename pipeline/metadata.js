const axios = require("axios");
const config = require("config");
const { Meta } = require("../models/metadata");
const { fileDownloader } = require("./files");
const { uploadFile } = require("./upload");
const fs = require("fs");
const archiver = require("archiver");

function blFileUrl(blFileIdentifier) {
  return `https://${config.baseUrl}/${config.nutzDatenInformation}/${blFileIdentifier}`;
}

function getMetaData(blFileIdentifier) {
  axios
    .get(blFileUrl(blFileIdentifier), {
      headers: {
        "x-api-key": config.apiKey,
      },
    })
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      // console.log(res.data);
      saveMetadata(res, blFileIdentifier);
    })
    .catch((error) => {
      console.error(error);
    });
}

function getAllDirFiles(dirPath) {
  const files = fs.readdirSync(dirPath);

  const arrayOfFiles = [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(file);
    }
  });

  return arrayOfFiles.length;
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
      resolve(console.log(archive.pointer() + " Total bytes to upload"))
    );
    archive.finalize();
  });
}

function getFile(path, name, response, timeout = 10000) {
  const intervalObj = setInterval(function () {
    const count = getAllDirFiles(path);

    if (count > response) {
      clearInterval(intervalObj);
      zipDirectory(
        `${__basedir}/downloads/${name}`,
        `${__basedir}/uploads/${name}.zip`
      ).then(() => {
        uploadFile(`${__basedir}/uploads/${name}.zip`, `${name}.zip`);
      });
    }
  }, timeout);
}

async function saveMetadata(res, blFileIdentifier) {
  const db_metadata = new Meta({
    data: res.data,
  });

  const result = await db_metadata.save();

  if (result) {
    console.log(`Metadat ${result.data.artefaktTyp} saved to the Database!`);
    // Download Files
    const response = fileDownloader(
      blFileIdentifier,
      result.data.referenzItems
    );
    getFile(
      `${__basedir}/downloads/${blFileIdentifier}`,
      blFileIdentifier,
      response,
      (timeout = 10000)
    );
  }
}

// async function updateMetadata() {
//   const messages = await Message.find().select("-__v").sort("created_at");

//   for (let index = 0; index < messages.length; index++) {
//     const mssg = messages[index];
//     getMetaData(mssg.value["blFileIdentifer"]);
//   }
// }

// exports.updateMetadata = updateMetadata;
exports.getMetaData = getMetaData;
