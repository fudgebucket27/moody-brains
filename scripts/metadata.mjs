import { calculateTokenId } from "./mergeimage.mjs";
import fs from "fs";

export function genMetadatasForCollection(collectionInfo, imagePath) {
  const collectionId = collectionInfo.id;
  const baseLevelsLen = collectionInfo.baseLevels.length;
  const relativeLevelsLen = collectionInfo.relativeLevels.length;
  const nftContractAddress = "0x677b26373e125d8b68F2f33f23A2027e7881c3B9";

  const baseDir = process.cwd() + "/collections/" + collectionInfo.name + "/metadatas/";
  const result = {
    baseDir,
    nftContractAddress,
    tokenIds: new Set()
  };
  for (const tokenInfo of collectionInfo.tokens) {
    const tokenId = calculateTokenId(collectionId, tokenInfo.id);
    result.tokenIds.add(tokenId);

    const imageUrl = imagePath + tokenInfo.name + "_" + tokenInfo.i + "_" + tokenInfo.j + ".png";
    const metadata = {
      "name": `Loophead #${tokenInfo.id}`,
      "description": `A collection of Moody Brains - Loophead #${tokenInfo.id}`,
      "image": imageUrl,
      "external_uri": "https://loopring.io",
      "cache_expiry_seconds": 3600,
      "attributes": [
        {
          "trait_type": "Ticker", 
          "value": "LRC"
        },        
        {
          "trait_type": "Gender", 
          "value": tokenInfo.gender
        },
        {
          "trait_type": "Creator", 
          "value": "Chong Zhang <zhangchong@loopring.io>"
        },
      ]
    };

    const metadataDir = baseDir + tokenId + "/" + tokenInfo.i + "_" + tokenInfo.j + "/";
    fs.mkdirSync(metadataDir, { recursive: true });
    fs.writeFileSync(
      metadataDir + "metadata.json",
      JSON.stringify(metadata, undefined, 2)
    );
  }

  fs.writeFileSync(
    baseDir + "mint-params.json",
    JSON.stringify(result, undefined, 2)
  );
  return result;
}
