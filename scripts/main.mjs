import { doMergeCollection1 } from "./mergeimage.mjs";
import { pinDir } from "./pinToIpfs.mjs";
import { genMetadatasForCollection } from "./metadata.mjs";

async function main() {
  const collectionInfo = await doMergeCollection1();
  console.log(collectionInfo);
  // // pin Images to IPFS
  // const imagePinResult = await pinDir(collectionInfo.imageDir, "images of " + collectionInfo.name); 
  // console.log("imagePinResult:", imagePinResult);
  // const imagePath = "ipfs://" + imagePinResult.IpfsHash + "/";
  // const metadataDir = genMetadatasForCollection(collectionInfo, imagePath);
  // console.log("metadataDir:", metadataDir);
  // const metadataPinResult = await pinDir(metadataDir, "metadata of " + collectionInfo.name);
  // console.log("metadataPinResult:", metadataPinResult);
}

main()
  .then(() => process.exit(0))
  .catch(err => {console.error(err); process.exit(1)});
