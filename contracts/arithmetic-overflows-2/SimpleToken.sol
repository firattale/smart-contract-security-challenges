// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title SimpleToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract SimpleToken {
    address public minter;
    mapping(address => uint256) public getBalance;
    uint256 public totalSupply;

    constructor() {
        minter = msg.sender;
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == minter, "not minter");
        getBalance[_to] += _amount;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(getBalance[msg.sender] - _value >= 0);
        getBalance[msg.sender] -= _value;
        getBalance[_to] += _value;
        return true;
    }
}
