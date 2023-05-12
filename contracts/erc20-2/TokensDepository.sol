// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {rToken} from "./rToken.sol";

/**
 * @title TokensDepository
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract TokensDepository {
    // TODO: Complete this contract functionality

    mapping(address => IERC20) public tokens;
    mapping(address => rToken) public rTokens;

    constructor(address _aave, address _uni, address _weth) {
        tokens[_aave] = IERC20(_aave);
        tokens[_uni] = IERC20(_uni);
        tokens[_weth] = IERC20(_weth);

        rTokens[_aave] = new rToken(_aave, "RAAVE", "rAave");
        rTokens[_uni] = new rToken(_uni, "RAUNI", "rUni");
        rTokens[_weth] = new rToken(_weth, "RWETH", "rWeth");
    }

    function deposit(address _token, uint256 _amount) external {
        IERC20 token = tokens[_token];
        require(address(token) != address(0), "Invalid tokens");

        bool successTransfer = token.transferFrom(msg.sender, address(this), _amount);
        require(successTransfer, "Token transfer can't be happened");

        rTokens[_token].mint(msg.sender, _amount);
    }

    function withdraw(address _token, uint256 _amount) external {
        IERC20 token = tokens[_token];
        require(address(token) != address(0), "Invalid tokens");

        if (token.balanceOf(address(this)) < _amount) {
            revert("Invalid amount");
        }

        rTokens[_token].burn(msg.sender, _amount);
        (bool success) = token.transfer(msg.sender, _amount);
        require(success, "Token transfer can't be happened");
    }
}
