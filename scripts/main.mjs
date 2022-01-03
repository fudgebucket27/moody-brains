import { doMergeCollection1, doMergeCollection20211224 } from "./mergeimage.mjs";
import { pinDir } from "./pinToIpfs.mjs";
import { genMetadatasForCollection } from "./metadata.mjs";
import { resizeAllImageInDir } from "./resize.mjs";
import fs from "fs";

function mergeCollectionInfos() {
  const collectionDirTails = [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "1000"
  ];

  const collectionInfoMerged = {
    id: 20211224,
    name: "collection_20211224",
    baseLevels: [-25, -10, 10, 25],
    relativeLevels: [-25, -10, 10, 25],
    tokens: []
  };

  // let tokenId = 0;
  for(const tail of collectionDirTails) {
    const collectionFile = "./collections/collection_20211224_" + tail + "/collectionInfo.json";
    const collectionInfo = JSON.parse(fs.readFileSync(collectionFile, "ascii"));
    for (const token of collectionInfo.tokens) {
      let tokenName = token.name;
      // if (tail === "100") {
      //   tokenName = tokenName + "_100"
      // }
      const tokenInfo = {
        id: token.id + Number(tail),
        name: tokenName,
        imageIpfsPath: collectionInfo.imagePath,
        i: token.i,
        j: token.j
      };
      collectionInfoMerged.tokens.push(tokenInfo);
    }
  }

  const collectionDir = "./collections/" + collectionInfoMerged.name;
  fs.mkdirSync(collectionDir, {recursive: true});
  fs.writeFileSync(collectionDir + "/collectionInfo.json", JSON.stringify(collectionInfoMerged, undefined, 2));

  return collectionInfoMerged;
}

async function main() {
  // const collectionName = "collection_20211224_100";
  // const personDirs = ["100"];

  // const collectionInfoFile = "./collections/" + collectionName + "/collectionInfo.json";
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

  const collectionInfo = mergeCollectionInfos();
  // const collectionInfo = JSON.parse(fs.readFileSync(collectionInfoFile, "ascii"));
  const { metadataInfo , indexInfo } = genMetadatasForCollection(collectionInfo);
  console.log("metadataInfo:", metadataInfo);
  
  console.log("pin metadatas to IPFS...");
  const metadataPinResult = await pinDir(metadataInfo.baseDir, "metadata of " + collectionInfo.name);
  console.log("metadataPinResult:", metadataPinResult);

  for (const item of indexInfo.items) {
    item.defaultURI = "ipfs://" + metadataPinResult.IpfsHash + "/" + item.defaultURI.substring(10);
  }
  indexInfo.properties.IPFSHash = metadataPinResult.IpfsHash;
  console.log("indexInfo:", indexInfo);

  fs.writeFileSync(
    "./collections/" + collectionInfo.name +"/index.json",
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
