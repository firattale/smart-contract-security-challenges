// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLockSecured {
    mapping(address => uint256) public getBalance;
    mapping(address => uint256) public getLockTime;

    constructor() {}

    function depositETH() public payable {
        getBalance[msg.sender] += msg.value;
        getLockTime[msg.sender] = block.timestamp + 30 days;
    }

    function increaseMyLockTime(uint256 _secondsToIncrease) public {
        getLockTime[msg.sender] += _secondsToIncrease;
    }

    function withdrawETH() public {
        require(getBalance[msg.sender] > 0);
        require(block.timestamp > getLockTime[msg.sender]);

        uint256 transferValue = getBalance[msg.sender];
        getBalance[msg.sender] = 0;

        (bool sent,) = msg.sender.call{value: transferValue}("");
        require(sent, "Failed to send ETH");
    }
}
