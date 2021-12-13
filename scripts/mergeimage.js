const fs = require("fs");
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const { BigNumber } = require("bignumber.js");
const assert = require("assert");

export function calculateTokenId(collectionId, tokenId) {
  const pad1 = 8 - collectionId.length;
  const pad2 = 56 - tokenId.length;
  const hexStr = "0".repeat(pad1) + collectionId + "0".repeat(pad2) + tokenId;
  const bn = new BigNumber(hexStr, 16);
  return bn.toString(10);
}

async function doMerge20211116() {
  // collectionId: hex string, without 0x
  // tokenId: hex string, without 0x
  const bgs = ["poor", "rich"];
  const moods = ["normal", "sad", "happy"];

  const collectionId = "4";
  const tokenId = "1";
  const tokenDir = calculateTokenId(collectionId, tokenId);

  for (let i = 0; i < bgs.length; i++) {
    for (let j = 0; j < moods.length; j++) {
      const bg = bgs[i];
      const mood = moods[j];
      console.log("generate image with:", bg, mood)

      let b64 = await mergeImages([
        "scripts/nft-materials/version20211116/bg/" + bg + ".png",
        "scripts/nft-materials/version20211116/hat/baseball.png",
        "scripts/nft-materials/version20211116/face/face.png",
        "scripts/nft-materials/version20211116/mood/" + mood + ".png",
        "scripts/nft-materials/version20211116/dress/green.png",
      ], {
        Canvas: Canvas,
        Image: Image
      });

      console.log("b64:", b64);
      b64 = b64.replace(/^data:image\/png;base64,/, "");

      const imageBaseDir = "collections/moody-brains-1118/images/" + tokenDir + "/";
      // const resDir =  "collections/moody-brains-1118/" + tokenDir + "/" + i + "_" + j + "/";
      fs.mkdirSync(imageBaseDir, { recursive: true });

      const imageFile = i + "_" + j + ".png";
      fs.writeFileSync(imageBaseDir + imageFile, b64, "base64");

      // const metadata = {
      //     name: "" + i + "_" + j,
      //     image: imageFile
      // };
      // fs.writeFileSync(resDir + "metadata.json", JSON.stringify(metadata, undefined, 2));
    }
  }
}

export async function doMergeCollection1() {
  const personDir = "nfts-raw/nft-first-batch/person";
  const bgDir = "nfts-raw/nft-first-batch/bg";
  const headDir = "nfts-raw/nft-first-batch/head";

  const persons = fs.readdirSync(personDir);
  const bgs = fs.readdirSync(bgDir);
  const heads = fs.readdirSync(headDir);
  console.log("bgs:", bgs);
  console.log("heads:", heads);

  const collectionName = "collection_1";
  const collectionInfo = {
    id: 1,
    name: collectionName,
    baseLevels: [-25, -10, 0, 10, 25],
    relativeLevels: [-25, -10, 0, 10, 25],
    tokens: []
  };
  assert(collectionInfo.baseLevels.length == bgDir.length, "base levels size not equal");
  assert(collectionInfo.relativeLevels.length == headDir.length, "relative levels size not equal");

  let tokenId = 0;
  for (const person of persons) {
    // console.log(person);
    for ([i, bg] of bgs.entries()) {
      for ([j,head] of heads.entries()) {
        console.log(person, bg, head);
        let b64 = await mergeImages([
          personDir + "/" + person,
          bgDir + "/" + bg,
          headDir + "/" + head,
        ], {
          Canvas: Canvas,
          Image: Image
        });

        // console.log("b64:", b64);
        b64 = b64.replace(/^data:image\/png;base64,/, "");

        const basename = person.replace(/\.[^/.]+$/, "");
        console.log("basename", basename);
        const [tokenName, gender] = basename.split("-");
        const baseDir = "./collections/" + collectionName + "/images/";
        fs.mkdirSync(baseDir, { recursive: true });

        const imageFile = tokenName + "_" + i + "_" + j + ".png";
        fs.writeFileSync(baseDir + imageFile, b64, "base64");

        const tokenInfo = {
          id: tokenId ++,
          name: tokenName,
          gender
        };

        collectionInfo.tokens.push(tokenInfo);
      }
    }
  }

  fs.writeFileSync(
    "./collections/" + collectionName + "/collectionInfo.json",
    JSON.stringify(collectionInfo, undefined, 2)
  );
  return collectionInfo;
}
