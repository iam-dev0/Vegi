import uuid from "uuid-v4";
import { Storage } from "@google-cloud/storage";
import path from "path";
import { GOOGLE_CLOUD_PROJECT_ID, DEFAULT_BUCKET_NAME } from "../config/config";

const GOOGLE_CLOUD_KEYFILE = path.join(__dirname, "../googlecredentials.json"); //

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE
});

const sendUploadToGCS = async (req, res, next) => {
  let imageUrls = [];
  if (!req.files) {
    //req.files.cloudStorageImageUrls = imageUrls;
    req.isFiles='false';
    return next();
  }
  req.isFiles='true';
  const bucket = storage.bucket(DEFAULT_BUCKET_NAME);
  let promises = [];

  req.files.forEach(file => {
    let filename = `${Date.now()}-${uuid()}`; //${file.originalname}
    const blob = bucket.file(filename);
    const newPromise = new Promise((resolve, reject) => {
      blob
        .createWriteStream({
          resumable: false,
          predefinedAcl: "publicRead",
          metadata: {
            contentType: file.mimetype
          }
        })
        .on("finish", async response => {
          imageUrls.push(getPublicUrl(DEFAULT_BUCKET_NAME, filename));
          resolve(response);
        })
        .on("error", err => {
          reject("error: ", err);
        })
        .end(file.buffer);
    });
    promises.push(newPromise);
  });

  Promise.all(promises)
    .then(response => {
      req.files.cloudStorageImageUrls = imageUrls;
      next();
    })
    .catch(err => {
      req.files.cloudStorageError = err;
      next(err);
    });
};

export const getPublicUrl = (bucketName, fileName) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;

export default sendUploadToGCS;
