// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;


/**
 * @title ICollection
 */
interface ICollection
{
    function collectionName()
        public
        view
        returns (string memory);
        
    function collectionID()
        public
        view
        returns (uint32 id);

    function tokenURI(uint256 tokenId)
        public
        view
        returns (string memory);
}
