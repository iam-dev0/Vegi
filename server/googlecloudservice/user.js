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
  let imageUrl = "";
  if (!req.file) {
    //req.files.cloudStorageImageUrl = imageUrls;
    req.isFile = "false";
    return next();
  }
  req.isFile = "true";
  const bucket = storage.bucket(DEFAULT_BUCKET_NAME);

  let filename = `${Date.now()}-${uuid()}`; //${file.originalname}
  const blob = bucket.file(filename);
  blob
    .createWriteStream({
      resumable: false,
      predefinedAcl: "publicRead",
      metadata: {
        contentType: req.file.mimetype
      }
    })
    .on("finish", async response => {
      imageUrl = getPublicUrl(DEFAULT_BUCKET_NAME, filename);
      req.file.cloudStorageImageUrl = imageUrl;
      next();
    })
    .on("error", err => {
      req.file.cloudStorageError = err;
      next(err);
    })
    .end(req.file.buffer);
};

export const getPublicUrl = (bucketName, fileName) =>
  `https://storage.googleapis.com/${bucketName}/${fileName}`;

export default sendUploadToGCS;
