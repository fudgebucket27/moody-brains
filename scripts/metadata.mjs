import { calculateTokenId } from "./mergeimage.mjs";
import fs from "fs";

export function genMetadatasForCollection(collectionInfo) {
  const collectionId = collectionInfo.id;
  const baseLevelsLen = collectionInfo.baseLevels.length + 1;
  const relativeLevelsLen = collectionInfo.relativeLevels.length + 1;
  const nftContractAddress = "0x1cACC96e5F01e2849E6036F25531A9A064D2FB5f";

  const baseDir = process.cwd() + "/collections/" + collectionInfo.name + "/metadatas/";
  const result = {
    baseDir,
    nftContractAddress,
    tokenIds: new Set()
  };

  const indexInfo = {
    properties: {
      "Minter": "Loopring",
      "Pair": "LRC/ETH",
      "Created": "12/2021"
    },
    items: []
  };
  const basePrice = "6000";
  
  for (const tokenInfo of collectionInfo.tokens) {
    const tokenId = calculateTokenId(collectionId, basePrice, tokenInfo.id);
    result.tokenIds.add(tokenId);

    const imageUrl = collectionInfo.imagePath + "/" + tokenInfo.name + "_" + tokenInfo.i + "_" + tokenInfo.j + ".png";
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
        // {
        //   "trait_type": "Gender",
        //   "value": tokenInfo.gender
        // },
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

    if (tokenInfo.i == 2 && tokenInfo.j == 2) {
      const item = {
        nftID: tokenId,
        defaultURI: "",
        defaultURILocal: "metadatas/" + tokenId + "/" + tokenInfo.i + "_" + tokenInfo.j + "/metadata.json",        
        metadata,
        images: []
      };
      for (let i = 0; i < baseLevelsLen; i++) {
        for (let j = 0; j < relativeLevelsLen; j++) {
          const imageInfo = {
            big: "images/" + tokenInfo.name + "_" + tokenInfo.i + "_" + tokenInfo.j + ".png",
            small: "images_small/" + tokenInfo.name + "_" + tokenInfo.i + "_" + tokenInfo.j + ".png",
          }
          item.images.push(imageInfo);
        }        
      }
      indexInfo.items.push(item);
    }
  }

  fs.writeFileSync(
    baseDir + "mint-params.json",
    JSON.stringify(result, undefined, 2)
  );

  return { metadataInfo: result, indexInfo };
}
