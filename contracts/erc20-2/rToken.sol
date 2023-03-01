// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title rToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract rToken is ERC20 {

    // TODO: Complete this contract functionality
    constructor(address _underlyingToken, string memory _name, string memory _symbol)
    ERC20(_name, _symbol) {
        
    }
}
