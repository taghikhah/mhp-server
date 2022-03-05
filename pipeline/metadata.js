const axios = require("axios");
const config = require("config");
const { Meta } = require("../models/metadata");
const { fileDownloader } = require("./files");
const { uploadFile } = require("./upload");
const fs = require("fs");

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

function getFile(path, timeout = 60000) {
  const intervalObj = setInterval(function () {
    const file = path;
    const fileExists = fs.existsSync(file);

    console.log("Checking for: ", file);

    if (fileExists) {
      clearInterval(intervalObj);
      uploadFile(path, path.split("\\").pop().split("/").pop());
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
    fileDownloader(blFileIdentifier, result.data.referenzItems, () => {
      getFile(
        `${__basedir}/uploads/${blFileIdentifier}.zip`,
        (timeout = 60000)
      );
    });
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
