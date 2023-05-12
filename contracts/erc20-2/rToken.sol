// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title rToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract rToken is ERC20, Ownable {
    // TODO: Complete this contract functionality

    address underlyingToken;

    constructor(address _underlyingToken, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        require(_underlyingToken != address(0), "Invalid address");
        underlyingToken = _underlyingToken;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _to, uint256 _amount) external onlyOwner {
        _burn(_to, _amount);
    }
}
