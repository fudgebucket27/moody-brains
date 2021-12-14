import fs from "fs";
import mergeImages from 'merge-images';
import canvasPkg from 'canvas';
const { Canvas, Image } = canvasPkg;
import BigNumber from "bignumber.js";
import assert from "assert";

function calculateTokenId(collectionId, tokenId) {
  const collectionIdHexStr = new BigNumber(collectionId).toString(16);
  const tokenIdHexStr = new BigNumber(tokenId).toString(16);  

  const pad1 = 8 - collectionIdHexStr.length;
  const pad2 = 56 - tokenIdHexStr.length;
  const hexStr = "0".repeat(pad1) + collectionIdHexStr + "0".repeat(pad2) + tokenIdHexStr;
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
      console.log("generate image with:", bg, mood);

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

async function doMergeCollection1() {
  const personDir = "nfts-raw/V20211213/person";
  const bgDir = "nfts-raw/V20211213/bg";
  const headDir = "nfts-raw/V20211213/head";

  let persons = fs.readdirSync(personDir);
  const bgs = fs.readdirSync(bgDir);
  const heads = fs.readdirSync(headDir);
  // console.log("bgs:", bgs);
  // console.log("heads:", heads);

  persons = persons.slice(0, 2);
  console.log("persons:", persons);

  const collectionName = "collection_1";
  const baseDir = "collections/" + collectionName + "/images/";
  const collectionInfo = {
    id: 1,
    name: collectionName,
    imageDir: process.cwd() + "/" + baseDir,
    baseLevels: [-25, -10, 10, 25],
    relativeLevels: [-25, -10, 10, 25],
    tokens: []
  };

  assert(collectionInfo.baseLevels.length + 1 == bgs.length, "base levels size not equal");
  assert(collectionInfo.relativeLevels.length + 1 == heads.length, "relative levels size not equal");

  let tokenId = 0;
  for (const person of persons) {
    tokenId ++;
    // console.log(person);
    for (const [i, bg] of bgs.entries()) {
      for (const [j, head] of heads.entries()) {
        console.log([
          personDir + "/" + person,
          bgDir + "/" + bg,
          headDir + "/" + head,
        ]);
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

        // console.log("b64.length:", b64.length);

        const basename = person.replace(/\.[^/.]+$/, "");
        // console.log("basename", basename);
        const [tokenName, gender] = basename.split("-");
        
        fs.mkdirSync(baseDir, { recursive: true });

        const imageFile = tokenName + "_" + i + "_" + j + ".png";
        fs.writeFileSync(baseDir + imageFile, b64, "base64");

        const tokenInfo = {
          id: tokenId,
          name: tokenName,
          imageSize: Math.ceil(b64.length * 3 / 4),
          gender
        };

        // console.log("tokenInfo:", tokenInfo);
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

export { calculateTokenId, doMergeCollection1 };
