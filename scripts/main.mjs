import { doMergeCollection1, doMergeCollection20211224 } from "./mergeimage.mjs";
import { pinDir } from "./pinToIpfs.mjs";
import { genMetadatasForCollection } from "./metadata.mjs";
import { resizeAllImageInDir } from "./resize.mjs";
import fs from "fs";

async function main() {
  const collectionName = "collection_20211224_100";
  
  // const collectionInfo = await doMergeCollection20211224(collectionName);
  // console.log(collectionInfo);
  // // pin Images to IPFS
  // const imagePinResult = await pinDir(collectionInfo.imageDir, "images of " + collectionInfo.name);
  // console.log("imagePinResult:", imagePinResult);
  // const imagePath = "ipfs://" + imagePinResult.IpfsHash;
  // collectionInfo.imagePath = imagePath;
  // fs.writeFileSync(
  //   "./collections/" + collectionName + "/collectionInfo.json",
  //   JSON.stringify(collectionInfo, undefined, 2)
  // );
  
  // const metadataInfo = genMetadatasForCollection(collectionInfo, imagePath);
  // console.log("metadataInfo:", metadataInfo);
  // const metadataPinResult = await pinDir(metadataInfo.baseDir, "metadata of " + collectionInfo.name);
  // console.log("metadataPinResult:", metadataPinResult);

  await resizeAllImageInDir(
    "./collections/" + collectionName +"/images/",
    "./collections/" + collectionName + "/images_small/"
  );
}

main()
  .then(() => process.exit(0))
  .catch(err => {console.error(err); process.exit(1);});
