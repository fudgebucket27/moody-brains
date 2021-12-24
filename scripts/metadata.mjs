import { calculateTokenId } from "./mergeimage.mjs";
import fs from "fs";

export function genMetadatasForCollection(collectionInfo, imagePath) {
  const collectionId = collectionInfo.id;
  const baseLevelsLen = collectionInfo.baseLevels.length;
  const relativeLevelsLen = collectionInfo.relativeLevels.length;
  const nftContractAddress = "0x1cACC96e5F01e2849E6036F25531A9A064D2FB5f";

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
      "description": "Loopheads is a Loopring 'Moody Brains' NFT collection",
      "image": imageUrl,
      "external_uri": "https://loopheads.world",
      "cache_expiry_seconds": 300,
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
          "trait_type": "Designer",
          "value": "Chong Zhang <zhangchong@loopring.io>"
        },
        {
          "trait_type": "Minter",
          "value": "Loopring"
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
