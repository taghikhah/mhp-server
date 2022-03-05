const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: "AKIARPFRJ2UK2DQ2LZW2",
  secretAccessKey: "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",
  region: "eu-west-1",
});

const uploadFile = (fileDir, fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileDir);

  // Setting up S3 upload parameters
  const params = {
    Bucket: "wincent-server",
    Key: fileName,
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

// const params = {
//   Bucket: "wincent-server",
//   CreateBucketConfiguration: {
//     // Set your region here
//     LocationConstraint: "eu-west-1",
//   },
// };

// s3.createBucket(params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   else console.log("Bucket Created Successfully", data.Location);
// });

exports.uploadFile = uploadFile;
