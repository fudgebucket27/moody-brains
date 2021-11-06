const NftContract = artifacts.require("./CuriousWeasels.sol");

module.exports = async (deployer, network, addresses) => {
  console.log("Deploying to " + network);

  const loopringExchangeAddress = "0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4";

  let owner;
  if (network === 'rinkeby') {
    owner = addresses[0];
  } else if (network === 'development') {
    owner = addresses[0];
  } else {
    owner = addresses[0];
  }

  await deployer.deploy(NftContract, loopringExchangeAddress, {gas: 5000000});
  const nft = await NftContract.deployed();
  await nft.transferOwnership(owner);

  console.log("NFT contract: " + nft.address);
};
