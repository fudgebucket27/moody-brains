import sharp from 'sharp';
import fs from "fs";

async function resizeAllImageInDir(imgDir, newDir) {
  fs.mkdirSync(newDir, { recursive: true });  
  const imageFiles = fs.readdirSync(imgDir);
  // console.log("imageFiles:", imageFiles);

  for (const image of imageFiles) {
    console.log("resize image:", image + "...");
    const imageFile = imgDir + image;
    const newImageFile = newDir + image;
    
    const res =  await sharp(imageFile).resize(128, 128).png().toFile(newImageFile);
    console.log("res:", res);
  }
}

async function createNormalSmallImagesForV20211224() {
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

  fs.mkdirSync("./collections/collection_20211224/images_small");
  // for (const tail)
}

export {resizeAllImageInDir};
