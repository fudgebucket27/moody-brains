// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;


/**
 * @title ICollection
 */
abstract contract ICollection
{
    function collectionID()
        public
        view
        virtual
        returns (uint32 id);

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        returns (string memory);
}
