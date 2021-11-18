const fs = require("fs");
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const { BigNumber } = require("bignumber.js");

async function doMerge20211116() {
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

            const imageBaseDir = "collections/moody-brains-1118/" + tokenDir + "/images/";
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

// collectionId: hex string, without 0x
// tokenId: hex string, without 0x
function calculateTokenId(collectionId, tokenId) {
    const pad1 = 8 - collectionId.length;
    const pad2 = 56 - tokenId.length;
    const hexStr = "0".repeat(pad1) + collectionId + "0".repeat(pad2) + tokenId;
    const bn = new BigNumber(hexStr, 16);
    return bn.toString(10);
}

async function main() {
    await doMerge20211116();
}

main()
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1) })