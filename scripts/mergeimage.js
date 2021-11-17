const fs = require("fs");
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');

async function doMerge20211116() {
    const bgs = ["poor", "rich"];
    const moods = ["normal", "sad", "happy"];

    for (const bg of bgs) {
        for (const mood of moods) {
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
            const resFile = "scripts/nft-materials/version20211116/result/" + bg + "-" + mood + ".png";
            fs.writeFileSync(resFile, b64, "base64");
        }
    }
}

async function main() {
    await doMerge20211116();
}

main()
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1) })