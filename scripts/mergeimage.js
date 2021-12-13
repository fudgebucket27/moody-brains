const fs = require("fs");
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const { BigNumber } = require("bignumber.js");

async function doMerge20211116() {
  // collectionId: hex string, without 0x
  // tokenId: hex string, without 0x
  function calculateTokenId(collectionId, tokenId) {
    const pad1 = 8 - collectionId.length;
    const pad2 = 56 - tokenId.length;
    const hexStr = "0".repeat(pad1) + collectionId + "0".repeat(pad2) + tokenId;
    const bn = new BigNumber(hexStr, 16);
    return bn.toString(10);
  }

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

export async function doMerge20211209() {
  const personDir = "nfts-raw/nft-first-batch/person";
  const bgDir = "nfts-raw/nft-first-batch/bg";
  const headDir = "nfts-raw/nft-first-batch/head";

  const persons = fs.readdirSync(personDir);
  const bgs = fs.readdirSync(bgDir);
  const heads = fs.readdirSync(headDir);

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

        const tokenDir = person.replace(/\.[^/.]+$/, "");
        console.log("tokenDir", tokenDir);
        const baseDir = "collections/moody-brains-1209/" + tokenDir + "/" + i + "_" + j + "/";
        fs.mkdirSync(baseDir, { recursive: true });

        const imageFile = i + "_" + j + ".png";
        fs.writeFileSync(baseDir + imageFile, b64, "base64");

        const metadata = {
          image: imageFile,
          imageSize: "",
          source: "",
          createdAt: new Date().toISOString(),
          name: "" + i + "_" + j,
          license: ""
        };
        fs.writeFileSync(baseDir + "metadata.json", JSON.stringify(metadata, undefined, 2));
      }
    }
  }
}

// async function main() {
//   await doMerge20211209();
// }

// main()
//   .then(() => process.exit(0))
//   .catch(err => { console.error(err); process.exit(1) })
