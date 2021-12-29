import { doMergeCollection1, doMergeCollection20211224 } from "./mergeimage.mjs";
import { pinDir } from "./pinToIpfs.mjs";
import { genMetadatasForCollection } from "./metadata.mjs";
import { resizeAllImageInDir } from "./resize.mjs";

async function main() {
  await resizeAllImageInDir(
    "./collections/collection_20211224/images/",
    "./collections/collection_20211224/images_small/"
  );
  
  // const collectionInfo = await doMergeCollection20211224();
  // console.log(collectionInfo);
  // pin Images to IPFS
  // const imagePinResult = await pinDir(collectionInfo.imageDir, "images of " + collectionInfo.name);
  // console.log("imagePinResult:", imagePinResult);
  // const imagePath = "ipfs://" + imagePinResult.IpfsHash + "/";
  // const metadataInfo = genMetadatasForCollection(collectionInfo, imagePath);
  // console.log("metadataInfo:", metadataInfo);
  // const metadataPinResult = await pinDir(metadataInfo.baseDir, "metadata of " + collectionInfo.name);
  // console.log("metadataPinResult:", metadataPinResult);
}

main()
  .then(() => process.exit(0))
  .catch(err => {console.error(err); process.exit(1);});
