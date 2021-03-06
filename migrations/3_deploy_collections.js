const FakeCollection = artifacts.require("./FakeCollection.sol");
const RandomCollection = artifacts.require("./RandomCollection.sol");
const NftContract = artifacts.require("./MoodyBrainsNFT.sol");

module.exports = async (deployer, network, addresses) => {
  console.log("Deploying to " + network);

  const collectionID = 1;
  // const baseURI = "http://moody-static.s3-website.us-east-2.amazonaws.com";
  const baseURI = "ipfs://QmQpyMjEy8ZQjaNWZrC4CQJQidfS2iWASUr6PAZY9CGTkf";
  const priceLevels = [-25, -10, 10, 25];
  const relativeLevels = [-25, -10, 10, 25];
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

  // const nftContract = await NftContract.deployed();
  // await nftContract.addCollection(RandomCollection.address);
};
