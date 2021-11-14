const FakeCollection = artifacts.require("./FakeCollection.sol");

module.exports = async (deployer, network, addresses) => {
  console.log("Deploying to " + network);

  const collectionID = 1;
  const baseURI = "http://moody-static.s3-website.us-east-2.amazonaws.com";
  const priceLevels = [-10, 0, 10];
  const relativeLevels = [-20, 0, 20];
  await deployer.deploy(
    FakeCollection,
    collectionID,
    baseURI,
    priceLevels,
    relativeLevels,
    {gas: 5000000}
  );
  console.log("FakeCollection contract: " + FakeCollection.address);
};
