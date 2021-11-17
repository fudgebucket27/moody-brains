const FakeCollection = artifacts.require("./FakeCollection.sol");
const RandomCollection = artifacts.require("./RandomCollection.sol");
const NftContract = artifacts.require("./MoodyApesNFT.sol");

module.exports = async (deployer, network, addresses) => {
  console.log("Deploying to " + network);

  const collectionID = 3;
  // const baseURI = "http://moody-static.s3-website.us-east-2.amazonaws.com";
  const baseURI = "/ipfs/QmaCks5r5gmN4W1PEUF3pjYxy11qfjNX8r4ufXCNY5zTqQ";
  const priceLevels = [-1, 50];
  const relativeLevels = [-20, 0, 20];
  // await deployer.deploy(
  //   FakeCollection,
  //   collectionID,
  //   baseURI,
  //   priceLevels,
  //   relativeLevels,
  //   {gas: 5000000}
  // );
  // console.log("FakeCollection contract: " + FakeCollection.address);

  await deployer.deploy(
    RandomCollection,
    collectionID,
    baseURI,
    priceLevels,
    relativeLevels,
    {gas: 5000000}
  );
  console.log("RandomCollection contract: " + RandomCollection.address);

  const nftContract = await NftContract.deployed();
  await nftContract.addCollection(RandomCollection.address);
};
