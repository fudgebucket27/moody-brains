// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

//import "./ICollection.sol";
import "./external/Strings.sol";

import '@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';

/**
 * @title Collection
 */
contract Collection/* is ICollection*/
{
    using Strings for uint;
    using OracleLibrary for address;

    uint32 public constant CURRENT_PRICE_SECONDS_AGO = 5 minutes;
    uint32 public constant PREVIOUS_PRICE_SECONDS_AGO = 12 hours;

    IUniswapV3Pool immutable public uniswapPool;
    uint128 immutable public baseAmount;
    string public baseTokenURI;

    int[] public priceLevels;
    int[] public relativeLevels;

    constructor(
        string  memory _baseTokenURI,
        IUniswapV3Pool _uniswapPool,
        uint128        _baseAmount,
        int[]   memory _priceLevels,
        int[]   memory _relativeLevels
        )
    {
        baseTokenURI = _baseTokenURI;
        uniswapPool = _uniswapPool;
        baseAmount = _baseAmount;
        priceLevels = _priceLevels;
        relativeLevels = _relativeLevels;
    }

    function tokenURI(uint256 tokenId)
        //override
        external
        view
        returns (string memory)
    {
        // Data format:
        // -  4 bytes: collection ID
        // - 16 bytes: base price
        // - 12 bytes: id
        uint basePrice = (tokenId >> 96) & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        uint id = tokenId & 0xFFFFFFFFFFFFFFFFFFFFFFFF;

        uint currentPrice = getPrice(CURRENT_PRICE_SECONDS_AGO);
        uint previousPrice = getPrice(PREVIOUS_PRICE_SECONDS_AGO);

        uint baseLevel = getBaseLevel(currentPrice, basePrice);
        uint relativeLevel = getRelativeLevel(currentPrice, previousPrice);

        return string(
            abi.encodePacked(
                baseTokenURI,
                "/",
                id.toString(),
                "/",
                basePrice.toString(),
                "/",
                baseLevel.toString(),
                "/",
                relativeLevel.toString(),
                "/metadata.json"
            )
        );
    }

    function getPrice(uint32 secondsAgo)
        public
        view
        returns (uint price)
    {
        // Currently returns the AVERAGE price over the passed in duration.
        // Can be changed but I think this should work well.
        int24 tick = address(uniswapPool).consult(secondsAgo);
        price = OracleLibrary.getQuoteAtTick(
            tick,
            baseAmount,
            uniswapPool.token1(),
            uniswapPool.token0()
        );
    }

    function getRelativeLevel(uint currentPrice, uint previousPrice)
        public
        view
        returns (uint level)
    {
        int change = int(currentPrice) - int(previousPrice);
        uint basePrice = (currentPrice >= previousPrice) ? previousPrice : currentPrice;
        if (basePrice != 0) {
            change = (change * 100) / int(basePrice);
        }
        return getRangeLevel(relativeLevels, change);
    }

    function getBaseLevel(uint currentPrice, uint basePrice)
        public
        view
        returns (uint level)
    {
        int change = int(currentPrice) - int(basePrice);
        return getRangeLevel(priceLevels, change);
    }

    function getRangeLevel(int[] memory levels, int value)
        public
        pure
        returns (uint level)
    {
        for (uint i = 0; i < levels.length; i++) {
            if (value < levels[i]) {
                return i;
            }
        }
        return levels.length;
    }
}
