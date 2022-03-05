const axios = require("axios");
const config = require("config");
const { Meta } = require("../models/metadata");
const { fileDownloader } = require("./fileDownloader");

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

async function saveMetadata(res, blFileIdentifier) {
  //   const metadata = {
  //     data: res.data,
  //   };

  const db_metadata = new Meta({
    data: res.data,
  });

  const result = await db_metadata.save();

  if (result) {
    fileDownloader(blFileIdentifier, result.data.referenzItems);

    console.log(`Metadat ${result.data.artefaktTyp} saved to the Database!`);
  }
  //   assignDataValue(metadata);
}

// async function assignDataValue(name) {
//   const db_metadata = new Meta(name);

//   const result = await db_metadata.save();

//   if (result) {
//       fileDownloader();

//   }

//   //   console.log("meta data successfully saved to db", result);
// }

// async function updateMetadata() {
//   const messages = await Message.find().select("-__v").sort("created_at");

//   for (let index = 0; index < messages.length; index++) {
//     const mssg = messages[index];
//     getMetaData(mssg.value["blFileIdentifer"]);
//   }
// }

// exports.updateMetadata = updateMetadata;
exports.getMetaData = getMetaData;

// async function stroeBaseline() {
//   const messages = await Meta.find().select("-__v").sort("created_at");
//   const name = messages[0].value["blFileIdentifer"];
//   const addr = blFileBase(name);
//   console.log(name);

//   axios({
//     url: addr, //your url
//     method: "GET",
//     headers: {
//       "x-api-key": token,
//     },
//     responseType: "blob",
//   }).then((response) => {
//     fs.writeFileSync(`${name}.txt`, response.data);
//   });
// }

/*
// const getBreeds = async () => {
//   try {
//     return await axios.get("https://dog.ceo/api/breeds/list/all");
//   } catch (error) {
//     console.error(error);
//   }
// };
const getMetaData = async () => {
  try {
    const res = await axios.get(`https://${baseUrl}${blFileEndpoint}`, {
      headers: {
        "x-api-key": token,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
  }
};

const countBreeds = async () => {
  const breeds = await getMetaData();

  if (breeds.data.message) {
    // console.log(`Got ${Object.entries(breeds.data.message).length} breeds`);
    const db_metadata = new Meta({
      status: breeds.status,
      data: breeds.data,
      content: breeds,
    });

    const result = await db_metadata.save();
    console.log(result);
    return result;
  }
};


*/
