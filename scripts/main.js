import { doMergeCollection1 } from "./mergeimage";
import { pinDir } from "./pinToIpfs";
import { genMetadatasForCollection } from "./metadata";

async function main() {
  const collectionInfo = await doMergeCollection1();
  // const imagePinResult = await pinDir(baseDir, name); // pin Images to IPFS
  // console.log("imagePinResult:", imagePinResult);
  const imagePath = "/ipfs/12345xxxxx"; // + imagePinResult.IpfsHash;
  const metadataDir = genMetadatasForCollection(collectionInfo, imagePath);
  console.log("metadataDir:", metadataDir);
  // const metadataPinResult = await pinDir(metadataDir, "metadata of" + collectionInfo.name);
  // console.log("metadataPinResult:", metadataPinResult);
}

main()
  .then(() => process.exit(0))
  .catch(err => {console.error(err); process.exit(1)});
