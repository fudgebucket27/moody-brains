const truffleAssert = require('truffle-assertions');
var assert = require('assert');

const NftContract = artifacts.require("CuriousWeasels.sol");
const Collection = artifacts.require("Collection.sol");
const TestUniswapPool = artifacts.require("TestUniswapPool.sol");

contract("NFT", (accounts) => {
  const owner = accounts[0];
  const minterA = accounts[1];
  const minterB = accounts[2];
  const userA = accounts[3];
  const userB = accounts[4];

  const baseTokenURI = "ipfs://QmZahwjzcxb5a3wuTRQfj6MRXHWGgZM7HXbGKm7xiV3YFv";

  let nft;
  let ethCollection;
  let uniswapPool;

  // Can be fetched from the ETH/USDC uniswap V3 pool:
  // https://etherscan.io/address/0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8#readContract
  const setOraclePrices = async (tickCumulatives, secondsPerLiquidityCumulativeX128s) => {
    const secondsAgo = [0,300,43200];
    for (let i = 0; i < tickCumulatives.length; i++) {
      await uniswapPool.setObservation(secondsAgo[i], tickCumulatives[i], secondsPerLiquidityCumulativeX128s[i]);
    }
    //console.log("currentPrice : " + await ethCollection.getPrice(secondsAgo[1]));
    //console.log("previousPrice: " + await ethCollection.getPrice(secondsAgo[2]));
  };

  const getTokenId = (collectionID, basePrice, id) => {
    return "0x" +
      collectionID.toString(16).padStart(8, "0") +
      basePrice.toString(16).padStart(32, "0") +
      id.toString(16).padStart(24, "0");
  };

  const getUri = (id, basePrice, baseLevel, relativeLevel) => {
    return baseTokenURI + "/" + id + "/" + basePrice + "/" + baseLevel + "/" + relativeLevel + "/metadata.json";
  };

  before(async () => {
    nft = await NftContract.deployed();

    uniswapPool = await TestUniswapPool.new();

    const baseAmount = "1" + "0".repeat(18);
    const priceLevels = [10000000000];
    const relativeLevels = [-20, 20];
    ethCollection = await Collection.new(
      baseTokenURI,
      uniswapPool.address,
      baseAmount,
      priceLevels,
      relativeLevels,
      {from: owner}
    );

    await nft.setCollection(1, ethCollection.address, {from: owner});
  });

  it("mint", async () => {
    await nft.setMinter(minterA, true, {from: owner});

    // Mint an NFT
    const collectionID = 1;
    const basePrice = 0;
    const id = 123;
    const tokenId = getTokenId(collectionID, basePrice, id);
    //console.log("tokenID: " + tokenId);
    await nft.mint(userA, tokenId, 1, "0x", {from: minterA});

    // Price remains the same
    await setOraclePrices(
      ["3154878136729","3154820433529","3146567560795"],
      ["0","0","0"]
    );
    assert.equal(await nft.uri(tokenId), getUri(id, basePrice, 0, 1), "unexpected uri");

    // Price increated by more than +20%
    await setOraclePrices(
      ["3154878136729","3154820433529","3146467560795"],
      ["0","0","0"]
    );
    assert.equal(await nft.uri(tokenId), getUri(id, basePrice, 0, 2), "unexpected uri");

    // Price decreased by more than -20%
    await setOraclePrices(
      ["3154878136729","3154820433529","3146657560795"],
      ["0","0","0"]
    );
    assert.equal(await nft.uri(tokenId), getUri(id, basePrice, 0, 0), "unexpected uri");

    // Try to mint from an unauthorized addresss
    truffleAssert.fails(
      nft.mint(userA, 123, 1, "0x", {from: userA}),
      truffleAssert.ErrorType.revert,
      "not authorized"
    );
  });
});
