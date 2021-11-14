// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

import "../external/Strings.sol";
import '@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol';

/**
 * @title Collection
 *
 * Devs: currently `is ICollection*` is commented out because I haven't found a good way
 * to share the interface contract between different solidity versions. The Collection
 * contracts are compiled with solidity 0.7 because of the dependency on the uniswap
 * oracle lib, and the main NFT contracts are compiled with solidity 0.8 because it
 * uses the latest openzeppelin versions of the contract. The interface is used by
 * both set of contracts which currently makes the compilation fail when used by both
 * sets of contracts.
 */
contract RandomCollection/* is ICollection*/
{
    using Strings for uint;
    using OracleLibrary for address;

    uint32 public constant CURRENT_PRICE_SECONDS_AGO = 5 minutes;
    uint32 public constant PREVIOUS_PRICE_SECONDS_AGO = 12 hours;

    uint32  immutable public /*override*/ collectionID;
    string public baseTokenURI;

    int[] public priceLevels;
    int[] public relativeLevels;

    constructor(
        uint32         _collectionID,
        string  memory _baseTokenURI,
        int[]   memory _priceLevels,
        int[]   memory _relativeLevels
        )
    {
        collectionID = _collectionID;
        baseTokenURI = _baseTokenURI;
        priceLevels = _priceLevels;
        relativeLevels = _relativeLevels;
    }

    function tokenURI(uint256 tokenId)
        //override
        public
        view
        returns (string memory)
    {
        // Data format:
        // -  4 bytes: collection ID
        // - 16 bytes: base price
        // - 12 bytes: id
        require(uint32((tokenId >> 224) & 0xFFFFFFFF) == collectionID, "inconsistent collection id");

        uint baseLevel = getBaseLevel();
        uint relativeLevel = getRelativeLevel();

        return string(
            abi.encodePacked(
                baseTokenURI,
                "/",
                tokenId.toString(),
                "/",
                baseLevel.toString(),
                "_",
                relativeLevel.toString(),
                "/metadata.json"
            )
        );
    }

    function getRelativeLevel()
        public
        view
        returns (uint level)
    {
        level = random(1) % relativeLevels.length;
    }

    function getBaseLevel()
        public
        view
        returns (uint level)
    {
        level = random(2) % priceLevels.length;
    }

    function random(uint salt) private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, salt)));
    }

}
