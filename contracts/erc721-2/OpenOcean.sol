// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title OpenOcean
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract OpenOcean {
    // TODO: Complete this contract functionality

    // TODO: Constants
    uint256 constant MAX_PRICE = 100 ether;
    // TODO: Item Struct

    struct Item {
        uint256 itemId;
        address collectionContract;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool isSold;
    }
    // TODO: State Variables and Mappings

    uint256 public itemsCounter;
    mapping(uint256 => Item) public listedItems;

    constructor() {}

    // TODO: List item function
    // 1. Make sure params are correct
    // 2. Increment itemsCounter
    // 3. Transfer token from sender to the contract
    // 4. Add item to listedItems mapping
    function listItem(address _collection, uint256 _tokenId, uint256 _price) external {
        IERC721 collection = IERC721(_collection);
        require(_collection != address(0), "invalid address");
        require(collection.ownerOf(_tokenId) == msg.sender, "You are not the owner!");
        require(_price < MAX_PRICE, "Item is more than max price");

        itemsCounter++;

        collection.transferFrom(msg.sender, address(this), _tokenId);
        listedItems[itemsCounter] = Item(itemsCounter, _collection, _tokenId, _price, payable(msg.sender), false);
    }

    // TODO: Purchase item function
    // 1. Check that item exists and not sold
    // 2. Check that enough ETH was paid
    // 3. Change item status to "sold"
    // 4. Transfer NFT to buyer
    // 5. Transfer ETH to seller
    function purchase(uint256 _itemId) external payable {
        Item storage item = listedItems[_itemId];

        require(item.collectionContract != address(0), "Item does not exist");
        require(item.isSold != true, "Item already sold");
        require(msg.value >= item.price, "You didn't send enough ETH");

        item.isSold = true;

        IERC721 contractCollection = IERC721(item.collectionContract);

        contractCollection.transferFrom(address(this), msg.sender, item.tokenId);

        (bool sent,) = item.seller.call{value: item.price}("");
        require(sent, "Failed to send Ether");
    }
}
