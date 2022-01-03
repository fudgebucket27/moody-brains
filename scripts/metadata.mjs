import { calculateTokenId } from "./mergeimage.mjs";
import fs from "fs";
import sharp from 'sharp';

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
      "Created": "12/2021",
      "IPFSHash": "",
      "description": "Loopheads is a Loopring 'Moody Brains' NFT collection",
      "external_uri": "https://loopheads.world"
    },
    items: []
  };
  const basePrice = "160000000000000000"; // baseAmount: 1000 LRC (10**21)
  // const imageDir = collectionInfo.imageDir;
  
  const tokenIdNameMap = new Map();
  for (const tokenInfo of collectionInfo.tokens) {
    const tokenId = calculateTokenId(collectionId, basePrice, tokenInfo.id);
    tokenIdNameMap.set(tokenId, tokenInfo.name);
    result.tokenIds.add(tokenId);

    const imageUrl = tokenInfo.imageIpfsPath + "/" + tokenInfo.name + "_" + tokenInfo.i + "_" + tokenInfo.j + ".png";
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
        name: tokenInfo.name,
        defaultURI: "metadatas/"+ tokenId + "/" + tokenInfo.i + "_" + tokenInfo.j + "/metadata.json",
        imageBaseURI: tokenInfo.imageIpfsPath,        
        images: []
      };
      for (let i = 0; i < baseLevelsLen; i++) {
        for (let j = 0; j < relativeLevelsLen; j++) {
          // const imageInfo = {
          //   big: "images/" + tokenInfo.name + "_" + imageDir + "_" + i + "_" + j + ".png",
          //   small: "images_small/" + tokenInfo.name + "_" + imageDir + "_" + i + "_" + j + ".png",
          // }
          const imageFile = tokenInfo.name + "_" + i + "_" + j + ".png";
          item.images.push(imageFile);
        }        
      }
      indexInfo.items.push(item);
    }
  }

  fs.writeFileSync(
    baseDir + "mint-params.json",
    JSON.stringify(result, undefined, 2)
  );

  const idNameMapFile = "./collections/" + collectionInfo.name + "/id_name_map.json";
  fs.writeFileSync(
    idNameMapFile,
    JSON.stringify([...tokenIdNameMap.entries()], undefined, 2)
  );

  return { metadataInfo: result, indexInfo };
}
