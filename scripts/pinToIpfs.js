const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('a720cdca8a4a56b9e865', 'f8113c8a4ce98014857ea6d43f982ac44b3bdb296369c93fb1fe46b32e07d298');

export async function pinDir(sourcePath, name) {
  // const sourcePath = '/home/ubuntu/kongliang/ipfs-test/data/';
  const options = {
    pinataMetadata: {
      name
    },
    pinataOptions: {
      cidVersion: 0
    }
  };
  const result = await pinata.pinFromFS(sourcePath, options);
  console.log(result);
  return result;
}
