import { doMergeCollection1, doMergeCollection20211224 } from "./mergeimage.mjs";
import { pinDir } from "./pinToIpfs.mjs";
import { genMetadatasForCollection } from "./metadata.mjs";
import { resizeAllImageInDir } from "./resize.mjs";
import fs from "fs";

async function main() {
  const collectionName = "collection_20211224_100";
  const personDirs = ["100"];

  const collectionInfoFile = "./collections/" + collectionName + "/collectionInfo.json";
  // const collectionInfo = await doMergeCollection20211224(collectionName, personDirs);
  // console.log(collectionInfo);
  // // pin Images to IPFS
  // const imagePinResult = await pinDir(collectionInfo.imageDir, "images of " + collectionInfo.name);
  // console.log("imagePinResult:", imagePinResult);
  // const imagePath = "ipfs://" + imagePinResult.IpfsHash;
  // collectionInfo.imagePath = imagePath;
  // fs.writeFileSync(
  //   collectionInfoFile,
  //   JSON.stringify(collectionInfo, undefined, 2)
  // );


  const collectionInfo = JSON.parse(fs.readFileSync(collectionInfoFile, "ascii"));
  const { metadataInfo , indexInfo } = genMetadatasForCollection(collectionInfo);
  console.log("metadataInfo:", metadataInfo);
  

  const metadataPinResult = await pinDir(metadataInfo.baseDir, "metadata of " + collectionInfo.name);
  console.log("metadataPinResult:", metadataPinResult);

  for (const item of indexInfo.items) {
    item.defaultURI = "ipfs://" + metadataPinResult.IpfsHash + "/" + item.defaultURILocal.substring(10);
  }
  console.log("indexInfo:", indexInfo);

  fs.writeFileSync(
    "./collections/" + collectionName +"/index.json",
    JSON.stringify(indexInfo, undefined, 2)
  );

  // await resizeAllImageInDir(
  //   "./collections/" + collectionName +"/images/",
  //   "./collections/" + collectionName + "/images_small/"
  // );
}

// async function uploadMetadata(collectionName) {
//   const collectionInfoFile = "./collections/" + collectionName + "/collectionInfo.json";
//   const collectionInfo = fs.read
// }

main()
  .then(() => process.exit(0))
  .catch(err => {console.error(err); process.exit(1);});
