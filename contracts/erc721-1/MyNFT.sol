// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    uint16 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.1 ether;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyNFT", "MTK") {}

    function safeMint(address to) external payable {
        require(msg.value == MINT_PRICE, "not enough ether");
        uint256 tokenId = _tokenIdCounter.current();

        require(tokenId < MAX_SUPPLY, "Max token supply");

        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
