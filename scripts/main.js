import { doMergeCollection1 } from "./mergeimage.js";
import { pinDir } from "./pinToIpfs.js";
import { genMetadatasForCollection } from "./metadata.js";

async function main() {
  const collectionInfo = await doMergeCollection1();
  console.log(collectionInfo);
  const imagePinResult = await pinDir(collectionInfo.imageDir, "images of " + collectionInfo.name); // pin Images to IPFS
  console.log("imagePinResult:", imagePinResult);
  const imagePath = "/ipfs/" + imagePinResult.IpfsHash + "/";
  const metadataDir = genMetadatasForCollection(collectionInfo, imagePath);
  console.log("metadataDir:", metadataDir);
  const metadataPinResult = await pinDir(metadataDir, "metadata of " + collectionInfo.name);
  console.log("metadataPinResult:", metadataPinResult);
}

main()
  .then(() => process.exit(0))
  .catch(err => {console.error(err); process.exit(1)});
