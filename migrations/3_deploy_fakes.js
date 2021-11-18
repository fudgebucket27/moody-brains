const FakeCollection = artifacts.require("./FakeCollection.sol");
const RandomCollection = artifacts.require("./RandomCollection.sol");
const NftContract = artifacts.require("./MoodyBrainsNFT.sol");

module.exports = async (deployer, network, addresses) => {
  console.log("Deploying to " + network);

  const collectionID = 4;
  // const baseURI = "http://moody-static.s3-website.us-east-2.amazonaws.com";
  const baseURI = "ipfs://bafybeih6yronhzyybh3vuny4l2z6krvd2nubpe3kafy4n2hx4xn7yig7rm";
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

  // const nftContract = await NftContract.deployed();
  // await nftContract.addCollection(RandomCollection.address);
};
