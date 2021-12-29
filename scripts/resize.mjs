import sharp from 'sharp';
import fs from "fs";

async function resizeAllImageInDir(imgDir, newDir) {
  const imageFiles = fs.readdirSync(imgDir);
  // console.log("imageFiles:", imageFiles);

  for (const image of imageFiles) {
    console.log("resize image:", image + "...");
    const imageFile = imgDir + image;
    const newImageFile = newDir + image;
    
    const res =  await sharp(imageFile).resize(256, 256).png().toFile(newImageFile);
    console.log("res:", res);
  }
}

export {resizeAllImageInDir};
