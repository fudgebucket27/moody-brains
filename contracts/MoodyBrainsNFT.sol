// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./AddressSet.sol";
import "./external/IL2MintableNFT.sol";

import "./ICollection.sol";

/**
 * @title MoodyBrainsNFT
 */

contract MoodyBrainsNFT is ERC1155, Ownable, IL2MintableNFT, AddressSet
{
    event CollectionUpdated(
        uint32  indexed collectionID,
        ICollection     collection
    );

    event MintFromL2(
        address owner,
        uint256 id,
        uint    amount,
        address minter
    );

    bytes32 internal constant MINTERS = keccak256("__MINTERS__");
    bytes32 internal constant DEPRECATED_MINTERS = keccak256("__DEPRECATED_MINTERS__");

    address public immutable layer2Address;

    mapping(uint32 => ICollection) collections;

    modifier onlyFromLayer2
    {
        require(msg.sender == layer2Address, "not authorized");
        _;
    }

    modifier onlyFromMinter
    {
        require(isMinter(msg.sender), "not authorized");
        _;
    }

    constructor(address _layer2Address)
        ERC1155("")
    {
        layer2Address = _layer2Address;
    }

    function mint(
        address       account,
        uint256       id,
        uint256       amount,
        bytes  memory data
        )
        external
    onlyFromMinter
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address          to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes     memory data
        )
        external
    onlyFromMinter
    {
        _mintBatch(to, ids, amounts, data);
    }

    function addCollection(ICollection collection)
        external
        onlyOwner
    {
        uint32 id = collection.collectionID();
        collections[id] = collection;
        emit CollectionUpdated(id, collection);
    }

    function setMinter(
        address minter,
        bool enabled
        )
        external
        onlyOwner
    {
        if (enabled) {
            addAddressToSet(MINTERS, minter, true);
            if (isAddressInSet(DEPRECATED_MINTERS, minter)) {
                removeAddressFromSet(DEPRECATED_MINTERS, minter);
            }
        } else {
            removeAddressFromSet(MINTERS, minter);
            addAddressToSet(DEPRECATED_MINTERS, minter, true);
        }
    }

    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        // The collection ID is always stored in the highest 32 bits
        uint32 collectionID = uint32((tokenId >> 224) & 0xFFFFFFFF);
        return collections[collectionID].tokenURI(tokenId);
    }

    // Layer 2 logic

    function mintFromL2(
        address          to,
        uint256          id,
        uint             amount,
        address          minter,
        bytes   calldata data
        )
        external
        override
    onlyFromLayer2
    {
        require(isMinter(minter), "invalid minter");

        _mint(to, id, amount, data);
        emit MintFromL2(to, id, amount, minter);
    }

    function minters()
        public
        view
        override
        returns (address[] memory)
    {
        return addressesInSet(MINTERS);
    }

    function isMinter(address addr)
        public
        view
        returns (bool)
    {
        return isAddressInSet(MINTERS, addr) || isAddressInSet(DEPRECATED_MINTERS, addr);
    }
}
